import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/pdf-viewer.css'; // Fixed import path

const PDFViewer = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const varOcg = useRef(); // watermark div ref

  // Detect screen size and set appropriate initial scale
  useEffect(() => {
    const handleResize = () => {
      // Don't change scale on resize, only set initial scale
      if (scale === 1.0) {
        const isMobile = window.innerWidth < 768;
        setScale(isMobile ? 0.8 : 1.5);
      }

      // Update controls height for dynamic container sizing
      if (controlsRef.current) {
        setControlsHeight(controlsRef.current.offsetHeight);
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
    }
  }, []);

  useEffect(() => {
    // Set the worker source path explicitly
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
  }, []);

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
      renderPage(pdf, pageNum, scale);
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to load PDF:", err);
      setError(`Failed to load PDF: ${err.message}`);
      setIsLoading(false);
    });
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, pageNum, scale);
    }
  }, [pageNum, scale]);

  const renderPage = (pdf, num, scale) => {
    pdf.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');

      // Set canvas dimensions based on the viewport
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      setCanvasDimensions({ width: viewport.width, height: viewport.height });
      // Render the PDF page
      page.render({
        canvasContext: context,
        viewport: viewport,
      });
    });
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
    >
      {/* Controls at the top - responsive layout */}
      <div
        ref={controlsRef}
        className="pdf-controls"
      >


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
      </div>

      {/* PDF Viewer with proper responsive classes */}
      <div
        ref={pdfContainerRef}
        className="pdf-content-area"
      >
        {/* The canvas container with proper sizing based on PDF dimensions */}
        <div
          ref={canvasContainerRef}
          className="pdf-canvas-container"
        >
          {/* Inner container for the canvas */}
          <div className="canvas-wrapper">
            {isLoading && (
              <div className="pdf-loading">
                <div className="pdf-spinner"></div>
              </div>
            )}

            <div
              ref={varOcg}
              className="pdf-watermark"
            >
              Confidential
            </div>

            <canvas
              ref={canvasRef}
              className="pdf-canvas"
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='flex justify-center items-center gap-2 mb-2'>
          <button
            onClick={() => setPageNum((prev) => Math.max(1, prev - 1))}
            disabled={pageNum <= 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-2 sm:px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Previous
          </button>
          <div className="text-xs sm:text-sm whitespace-nowrap">
            Page <span className="font-bold">{pageNum}</span> of <span className="font-medium">{totalPages}</span>
          </div>
          <button
            onClick={() => setPageNum((prev) => Math.min(totalPages, prev + 1))}
            disabled={pageNum >= totalPages}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-2 sm:px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Next
          </button>
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
