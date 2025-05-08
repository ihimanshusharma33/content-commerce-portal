import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/pdf-viewer.css'; // Fixed import path

const PDFViewer = ({ pdfUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [pageCanvases, setPageCanvases] = useState<HTMLCanvasElement[]>([]);

  // Detect screen size and set appropriate initial scale
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      
      // Don't change scale on resize, only set initial scale
      if (scale === 1.0) {
        setScale(mobileView ? 0.8 : 1.5);
      }

      // Update controls height for dynamic container sizing
      if (controlsRef.current) {
        setControlsHeight(controlsRef.current.offsetHeight);
      }
      
      // Adjust PDF container height dynamically
      updatePdfContainerHeight();
    };

    // Function to update PDF container height
    const updatePdfContainerHeight = () => {
      if (containerRef.current && pdfContainerRef.current && controlsRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const controlsHeight = controlsRef.current.offsetHeight;
        // Set the PDF container height to fill the available space
        pdfContainerRef.current.style.height = `calc(100% - ${controlsHeight}px)`;
      }
    };

    // Set initial scale based on screen size
    handleResize();

    // Update measurements when screen size changes
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Additional effect to measure controls height after render
  useEffect(() => {
    if (controlsRef.current) {
      setControlsHeight(controlsRef.current.offsetHeight);
      
      // Ensure PDF container height is updated
      if (pdfContainerRef.current) {
        pdfContainerRef.current.style.height = `calc(100% - ${controlsRef.current.offsetHeight}px)`;
      }
    }
  }, []);

  // Set the worker source path explicitly
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
  }, []);

  // Load PDF document
  useEffect(() => {
    if (!pdfUrl || typeof pdfUrl !== 'string') {
      setError("Invalid PDF URL provided");
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);
    console.log("Loading PDF from:", pdfUrl);

    pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      renderAllPages(pdf, scale);
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to load PDF:", err);
      setError(`Failed to load PDF: ${err.message}`);
      setIsLoading(false);
    });
  }, [pdfUrl]);

  // Re-render pages when scale changes
  useEffect(() => {
    if (pdfDoc) {
      renderAllPages(pdfDoc, scale);
    }
  }, [scale]);

  const renderAllPages = async (pdf, scale) => {
    // Check if container reference exists
    if (!canvasContainerRef.current) {
      console.error('Canvas container reference is null');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Safer way to clear existing content - use innerHTML instead of manual child removal
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = '';
      }

      const numPages = pdf.numPages;
      const newCanvases: HTMLCanvasElement[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
          // Verify canvasContainerRef is still valid before each page render
          if (!canvasContainerRef.current) {
            console.warn('Canvas container no longer exists during rendering of page', pageNum);
            break;
          }

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });
          
          // Create canvas wrapper div
          const pageContainer = document.createElement('div');
          pageContainer.className = 'pdf-page-container';
          
          // Create the canvas element
          const canvas = document.createElement('canvas');
          canvas.className = 'pdf-canvas';
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          // Render page
          const context = canvas.getContext('2d');
          if (context) {
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
          }
          
          // Apply watermark to each page
          const watermarkDiv = document.createElement('div');
          watermarkDiv.className = 'pdf-watermark';
          watermarkDiv.textContent = 'Confidential';
          
          // Append elements - check again if container still exists
          pageContainer.appendChild(canvas);
          pageContainer.appendChild(watermarkDiv);
          
          // Final check before appending to DOM
          if (canvasContainerRef.current) {
            canvasContainerRef.current.appendChild(pageContainer);
            newCanvases.push(canvas);
          }
        } catch (err) {
          console.error(`Error rendering page ${pageNum}:`, err);
        }
      }
      
      setPageCanvases(newCanvases);
    } catch (error) {
      console.error('Error in renderAllPages:', error);
      setError(`Failed to render PDF pages: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Disable right-click, selection, keyboard shortcuts, and prevent copy
  useEffect(() => {
    // Prevent context menu (right click)
    const preventDefault = (e) => e.preventDefault();

    // Prevent keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
      // Prevent Ctrl+P (Print), Ctrl+S (Save), etc.
      if ((e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 's' ||
          e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
      }
    };

    // Prevent copy
    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('keydown', preventKeyboardShortcuts);
    document.addEventListener('copy', preventCopy);

    // Disable selection throughout the PDF viewer
    if (containerRef.current) {
      containerRef.current.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('copy', preventCopy);
    };
  }, []);

  // Enable pinch to zoom and other touch gestures for mobile
  useEffect(() => {
    if (!isMobile || !pdfContainerRef.current) return;
    
    // Allow touch-action in CSS for the PDF container to enable native zooming
    if (pdfContainerRef.current) {
      pdfContainerRef.current.style.touchAction = 'pinch-zoom';
    }
    
    if (canvasContainerRef.current) {
      canvasContainerRef.current.style.overflow = 'auto';
      (canvasContainerRef.current.style as any).WebkitOverflowScrolling = 'touch';
    }
  }, [isMobile]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(5, prevScale + 0.2));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(0.2, prevScale - 0.2));
  };

  return (
    <div
      ref={containerRef}
      className="pdf-viewer-container"
      style={{ height: '100%', maxHeight: '100vh' }}
    >
      {/* Controls at the top - responsive layout, hide on mobile */}
      <div
        ref={controlsRef}
        className="pdf-controls"
      >
        {/* Only show zoom controls on desktop */}
        {!isMobile && (
          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-0 w-full sm:w-auto justify-center">
            <button
              onClick={handleZoomOut}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md transition-colors"
            >
              <span className="text-lg">−</span>
            </button>
            <span className="text-xs sm:text-sm whitespace-nowrap min-w-[2.5rem] text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md transition-colors"
            >
              <span className="text-lg">+</span>
            </button>
          </div>
        )}
      </div>

      {/* PDF Viewer with proper responsive classes */}
      <div
        ref={pdfContainerRef}
        className={`pdf-content-area ${isMobile ? 'touch-pinch-zoom' : ''}`}
        style={{ 
          overflow: 'auto', 
          height: `calc(100% - ${controlsHeight}px)`,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {/* The canvas container with proper sizing based on PDF dimensions */}
        <div
          ref={canvasContainerRef}
          className="pdf-canvas-container"
          style={{
            minWidth: 'min-content',
            width: 'auto',
            padding: '1rem',
            overflow: 'visible'
          }}
        >
          {isLoading && (
            <div className="pdf-loading">
              <div className="pdf-spinner"></div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="pdf-error" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
