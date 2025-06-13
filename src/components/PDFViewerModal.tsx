import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/pdf-modal.css';

// Set PDF worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

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
  const initialPinchDistance = useRef<number>(0);
  const startScale = useRef<number>(1);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for custom scale update events (from pinch gesture)
  useEffect(() => {
    const handleScaleUpdate = (e: CustomEvent) => {
      setScale(e.detail.scale);
    };

    document.addEventListener('pdfUpdateScale', handleScaleUpdate as EventListener);
    return () => {
      document.removeEventListener('pdfUpdateScale', handleScaleUpdate as EventListener);
    };
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  };

  if (!isOpen) return null;

  return (
    <div className="pdf-modal">
      {/* Header - Desktop only */}
      <div className="hidden lg:block pdf-modal-header">
        <h2 className="text-xl font-semibold truncate">{title}</h2>

        <div className="pdf-controls">
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

     

      {/* PDF Content */}
      <div className="pdf-modal-content">
        <SimplePDFViewer
          pdfUrl={pdfUrl}
          scale={scale}
          onLoadingChange={setIsLoading}
          onError={setError}
          isMobile={isMobile}
          setScale={setScale}
        />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="pdf-loading">
          <div className="pdf-spinner"></div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="pdf-error">
          <p>Failed to load PDF: {error}</p>
        </div>
      )}
      
      {/* Always visible close button for mobile */}
      {isMobile && (
        <button
          onClick={onClose}
          className="pdf-close-button"
          aria-label="Close PDF viewer"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>
      )}
    </div>
  );
};

// Update the SimplePDFViewer component props interface
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
  const initialPinchDistance = useRef<number>(0);
  const initialScale = useRef<number>(scale);
  let lastTapTime = 0;

  // Load PDF document only once
  useEffect(() => {
    const loadPdf = async () => {
      try {
        onLoadingChange(true);

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: true
        }).promise;

        pdfDocRef.current = pdf;
        renderPages(pdf);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        onError('Failed to load PDF document');
        onLoadingChange(false);
      }
    };

    if (pdfUrl) loadPdf();
  }, [pdfUrl, onError, onLoadingChange]);

  // Re-render when scale changes
  useEffect(() => {
    if (pdfDocRef.current) {
      renderPages(pdfDocRef.current);
    }
  }, [scale]);

  // Main rendering function - IMPROVED FOR CONSISTENT ZOOM
  const renderPages = async (pdfDoc: any) => {
    if (!containerRef.current || !pdfDoc) return;

    try {
      // Clear container
      containerRef.current.innerHTML = '';
      let allPagesRendered = true;

      // Create a single wrapper for all pages to maintain consistent zoom
      const pagesContainer = document.createElement('div');
      pagesContainer.className = 'pdf-pages-wrapper';
      containerRef.current.appendChild(pagesContainer);

      // Render each page
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        // Create wrapper
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'pdf-page-wrapper';
        pageWrapper.dataset.pageNumber = i.toString();

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-canvas';
        canvas.setAttribute('data-page', i.toString());
        pageWrapper.appendChild(canvas);

        // Add watermark
        const watermark = document.createElement('div');
        watermark.className = 'pdf-watermark';
        watermark.textContent = 'Confidential';
        pageWrapper.appendChild(watermark);

        pagesContainer.appendChild(pageWrapper);

        try {
          // Get page and set viewport
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale });

          // Set canvas size
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render to canvas
          await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport
          }).promise;

        } catch (err) {
          console.log(`Error rendering page ${i}:`, err);
          allPagesRendered = false;
        }
      }

      // Set loading to false when complete
      onLoadingChange(false);

    } catch (err) {
      console.error('Error rendering PDF:', err);
      onError('Failed to render PDF');
      onLoadingChange(false);
    }
  };

  // REMOVE THE DUPLICATE TOUCH HANDLER - Keep only one improved version
  useEffect(() => {
    if (!containerRef.current || !isMobile) return;
    
    const container = containerRef.current;
    let isPinching = false;
    let initialDistance = 0;
    let startScale = scale;
    let lastScale = scale;
    let throttleTimer: number | null = null;
    
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
        lastScale = scale;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        // Handle double tap to zoom
        const now = new Date().getTime();
        const timeSince = now - lastTapTime;

        if (timeSince < 300) {
          // Double tap detected
          if (scale > 1) {
            setScale(1); // Reset zoom
          } else {
            setScale(2); // Zoom in
          }
          e.preventDefault();
        }
        lastTapTime = now;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        const currentDistance = getDistance(e.touches);
        const scaleFactor = currentDistance / initialDistance;
        
        // Improved calculation for zoom out to make it more responsive
        let newScale;
        if (scaleFactor < 1) {
          // More gradual zoom out (feels more natural)
          newScale = Math.max(0.5, startScale - (1 - scaleFactor) * startScale * 0.8);
        } else {
          // Regular zoom in calculation
          newScale = Math.min(5, startScale * scaleFactor);
        }
        
        // Update zoom percentage display immediately for feedback
        const zoomElement = document.querySelector('.pdf-zoom-level');
        if (zoomElement) {
          zoomElement.textContent = `${Math.round(newScale * 100)}%`;
        }
        
        // Throttle actual scale updates to prevent performance issues
        if (!throttleTimer && Math.abs(newScale - lastScale) > 0.05) {
          throttleTimer = window.setTimeout(() => {
            setScale(newScale);
            lastScale = newScale;
            throttleTimer = null;
          }, 16); // ~60fps
        }
        
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      isPinching = false;
      if (throttleTimer) {
        clearTimeout(throttleTimer);
        throttleTimer = null;
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      if (throttleTimer) clearTimeout(throttleTimer);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, setScale, isMobile]);

  return <div ref={containerRef} className="pdf-pages-container" />;
};

export default PDFViewerModal;