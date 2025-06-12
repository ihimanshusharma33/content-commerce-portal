import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/pdf-modal.css';

// Set PDF worker path to use your local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/src/webWorker/pdfWorker.js';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title = 'Document'
}) => {
  const [scale, setScale] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set initial scale based on device
  useEffect(() => {
    if (isOpen) {
      setScale(isMobile ? 0.8 : 1.2);
      setError(null);
      setIsLoading(true);
    }
  }, [isOpen, isMobile]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="pdf-modal">
      <div className="pdf-modal-backdrop" onClick={onClose}></div>
      
      <div className="pdf-modal-container">
        {/* Header */}
        <div className="pdf-modal-header">
          <h2 className="text-xl font-semibold truncate">{title}</h2>

          <div className="pdf-controls">
            {!isMobile && (
              <>
                <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom in">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} title="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="pdf-modal-content">
          {pdfUrl && isOpen && (
            <SimplePDFViewer
              pdfUrl={pdfUrl}
              scale={scale}
              onLoadingChange={setIsLoading}
              onError={setError}
              isMobile={isMobile}
              setScale={setScale}
            />
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="pdf-loading">
            <div className="pdf-spinner"></div>
            <p>Loading PDF...</p>
          </div>
        )}

        {/* Error message */}
        {error && !isLoading && (
          <div className="pdf-error">
            <p>Failed to load PDF: {error}</p>
            <Button onClick={() => {
              setError(null);
              setIsLoading(true);
            }}>
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated SimplePDFViewer component
interface SimplePDFViewerProps {
  pdfUrl: string;
  scale: number;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
  isMobile: boolean;
  setScale: (scale: number) => void;
}

const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({
  pdfUrl,
  scale,
  onLoadingChange,
  onError,
  isMobile,
  setScale
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const [totalPages, setTotalPages] = useState(0);

  // Load PDF document
  useEffect(() => {
    if (!pdfUrl) {
      onError('No PDF URL provided');
      onLoadingChange(false);
      return;
    }

    const loadPdf = async () => {
      try {
        onLoadingChange(true);
        onError(null);

        console.log('Loading PDF from:', pdfUrl);
        console.log('Using worker:', pdfjsLib.GlobalWorkerOptions.workerSrc);

        // Create loading task with better configuration
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          httpHeaders: {
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache'
          },
          withCredentials: false,
          isEvalSupported: false,
          maxImageSize: 1024 * 1024, // 1MB max image size
          disableFontFace: false,
          disableRange: false,
          disableStream: false
        });

        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);

        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        
        // Start rendering pages
        await renderAllPages(pdf);
        
      } catch (err) {
        console.error('Failed to load PDF:', err);
        onError(`Failed to load PDF: ${err.message || 'Unknown error'}`);
        onLoadingChange(false);
      }
    };

    loadPdf();

    // Cleanup function
    return () => {
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
    };
  }, [pdfUrl, onError, onLoadingChange]);

  // Re-render when scale changes
  useEffect(() => {
    if (pdfDocRef.current && totalPages > 0) {
      renderAllPages(pdfDocRef.current);
    }
  }, [scale, totalPages]);

  const renderAllPages = async (pdfDoc: any) => {
    if (!containerRef.current || !pdfDoc) return;

    try {
      // Clear container
      containerRef.current.innerHTML = '';

      // Create pages container
      const pagesContainer = document.createElement('div');
      pagesContainer.className = 'pdf-pages-wrapper';
      containerRef.current.appendChild(pagesContainer);

      // Render each page
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          // Create page container
          const pageContainer = document.createElement('div');
          pageContainer.className = 'pdf-page-container';
          pageContainer.style.marginBottom = '20px';
          pageContainer.style.position = 'relative';
          pageContainer.style.display = 'flex';
          pageContainer.style.justifyContent = 'center';

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.className = 'pdf-canvas';
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.maxWidth = '100%';
          canvas.style.height = 'auto';
          canvas.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';

          // Add watermark
          const watermark = document.createElement('div');
          watermark.textContent = 'Confidential';
          watermark.style.position = 'absolute';
          watermark.style.top = '50%';
          watermark.style.left = '50%';
          watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
          watermark.style.fontSize = `${Math.max(20, scale * 30)}px`;
          watermark.style.color = 'rgba(255, 0, 0, 0.1)';
          watermark.style.fontWeight = 'bold';
          watermark.style.pointerEvents = 'none';
          watermark.style.userSelect = 'none';
          watermark.style.zIndex = '10';

          pageContainer.appendChild(canvas);
          pageContainer.appendChild(watermark);
          pagesContainer.appendChild(pageContainer);

          // Render page to canvas
          const context = canvas.getContext('2d');
          if (context) {
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
            
            console.log(`Page ${pageNum} rendered successfully`);
          }

        } catch (pageError) {
          console.error(`Error rendering page ${pageNum}:`, pageError);
        }
      }

      onLoadingChange(false);

    } catch (err) {
      console.error('Error rendering pages:', err);
      onError('Failed to render PDF pages');
      onLoadingChange(false);
    }
  };

  // Touch gesture handling for mobile
  useEffect(() => {
    if (!containerRef.current || !isMobile) return;
    
    const container = containerRef.current;
    let isPinching = false;
    let initialDistance = 0;
    let startScale = scale;
    let lastTapTime = 0;
    
    const getDistance = (touches: TouchList): number => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinching = true;
        initialDistance = getDistance(e.touches);
        startScale = scale;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        // Double tap detection
        const now = Date.now();
        const timeSince = now - lastTapTime;

        if (timeSince < 300 && timeSince > 0) {
          // Double tap - toggle zoom
          const newScale = scale > 1 ? 1 : 2;
          setScale(newScale);
          e.preventDefault();
        }
        lastTapTime = now;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        const currentDistance = getDistance(e.touches);
        const scaleMultiplier = currentDistance / initialDistance;
        const newScale = Math.min(5, Math.max(0.5, startScale * scaleMultiplier));
        
        setScale(newScale);
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      isPinching = false;
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, setScale, isMobile]);

  // Prevent right-click and text selection
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    const preventContextMenu = (e: Event) => e.preventDefault();
    const preventSelection = (e: Event) => e.preventDefault();
    
    container.addEventListener('contextmenu', preventContextMenu);
    container.addEventListener('selectstart', preventSelection);
    container.addEventListener('dragstart', preventSelection);

    return () => {
      container.removeEventListener('contextmenu', preventContextMenu);
      container.removeEventListener('selectstart', preventSelection);
      container.removeEventListener('dragstart', preventSelection);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="pdf-pages-container"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none'
      }}
    />
  );
};

export default PDFViewerModal;