import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import * as pdfjsLib from 'pdfjs-dist';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Reset state when modal opens/closes
    if (!isOpen) {
      setIsLoading(false);
      setError(null);
    } else if (pdfUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, pdfUrl]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Set initial scale based on device
  useEffect(() => {
    setScale(isMobile ? 0.9 : 1.2);
  }, [isMobile]);
  
  // Safety timeout for loading state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isLoading) {
      timeout = setTimeout(() => setIsLoading(false), 10000);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Listen for scale update events from PDF viewer
  useEffect(() => {
    const handleScaleUpdate = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.scale === 'number') {
        setScale(e.detail.scale);
      }
    };
    
    document.addEventListener('pdfUpdateScale', handleScaleUpdate as EventListener);
    
    return () => {
      document.removeEventListener('pdfUpdateScale', handleScaleUpdate as EventListener);
    };
  }, []);
  
  const handleZoomIn = () => setScale(prev => Math.min(5.0, prev + 0.25));
  const handleZoomOut = () => setScale(prev => Math.max(0.5, prev - 0.25));

  if (!isOpen) return null;

  return (
    <div className="pdf-modal">
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
        <SimplePDFViewer 
          pdfUrl={pdfUrl} 
          scale={scale}
          onLoadingChange={setIsLoading}
          onError={setError}
          isMobile={isMobile}
        />
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="pdf-loading">
          <div className="pdf-spinner"></div>
        </div>
      )}
      
      {/* Error display */}
      {error && !isLoading && (
        <div className="pdf-error">
          <h3 className="font-bold mb-2">Error Loading PDF</h3>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
};

interface SimplePDFViewerProps {
  pdfUrl: string;
  scale: number;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string) => void;
  isMobile: boolean;
}

const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({ 
  pdfUrl, 
  scale,
  onLoadingChange,
  onError,
  isMobile  // Make sure isMobile is passed as a prop
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const isMounted = useRef<boolean>(true);
  
  // Load PDF document only once
  useEffect(() => {
    isMounted.current = true;
    
    const loadPdf = async () => {
      try {
        onLoadingChange(true);
        
        // Load PDF document
        const pdf = await pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: true
        }).promise;
        
        if (isMounted.current) {
          pdfDocRef.current = pdf;
          renderPages(pdf);
        }
      } catch (err) {
        console.error('Failed to load PDF:', err);
        if (isMounted.current) {
          onError('Failed to load PDF document');
          onLoadingChange(false);
        }
      }
    };
    
    if (pdfUrl) loadPdf();
    
    return () => {
      isMounted.current = false;
    };
  }, [pdfUrl, onError]);
  
  // Re-render when scale changes
  useEffect(() => {
    if (pdfDocRef.current) {
      renderPages(pdfDocRef.current);
    }
  }, [scale]);
  
  // Main rendering function
  const renderPages = async (pdfDoc: any) => {
    if (!containerRef.current || !pdfDoc) return;
    
    try {
      // Clear container
      containerRef.current.innerHTML = '';
      let allPagesRendered = true;
      
      // Render each page
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        if (!isMounted.current) return;
        
        // Create wrapper
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'pdf-page-wrapper';
        pageWrapper.dataset.pageNumber = i.toString();
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-canvas';
        pageWrapper.appendChild(canvas);
        
        // Add watermark
        const watermark = document.createElement('div');
        watermark.className = 'pdf-watermark';
        watermark.textContent = 'Confidential';
        pageWrapper.appendChild(watermark);
        
        containerRef.current.appendChild(pageWrapper);
        
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
      if (isMounted.current) {
        onLoadingChange(false);
      }
      
    } catch (err) {
      console.error('Error rendering PDF:', err);
      if (isMounted.current) {
        onError('Failed to render PDF');
        onLoadingChange(false);
      }
    }
  };
  
  useEffect(() => {
    if (!containerRef.current || !isMobile) return;
    
    const container = containerRef.current;
    const initialDistance = { current: null as number | null };
    const initialScale = { current: scale };
    let zoomDebounceTimeout: NodeJS.Timeout;
    let lastZoomTime = 0;
    let lastScale = scale;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance.current = Math.sqrt(dx * dx + dy * dy);
        initialScale.current = scale;
        lastScale = scale;
        
        // Clear any pending scale updates
        if (zoomDebounceTimeout) {
          clearTimeout(zoomDebounceTimeout);
        }
        
        e.preventDefault();
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDistance = Math.sqrt(dx * dx + dy * dy);
        
        const scaleFactor = newDistance / initialDistance.current;
        const newScale = Math.min(5.0, Math.max(0.5, initialScale.current * scaleFactor));
        
        // Only update the UI during touch move, without triggering renders
        const scalePercentage = Math.round(newScale * 100);
        const scaleDisplay = document.querySelector('.pdf-zoom-level');
        if (scaleDisplay) {
          scaleDisplay.textContent = `${scalePercentage}%`;
        }
        
        // Store the latest calculated scale for use when touch ends
        lastScale = newScale;
        lastZoomTime = Date.now();
        
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      if (initialDistance.current !== null) {
        // Only apply the scale change after the user finishes pinching
        if (Math.abs(lastScale - scale) > 0.05) {
          // Set a short delay to prevent multiple rapid updates
          zoomDebounceTimeout = setTimeout(() => {
            // Only show loading indicator if significant time has passed since last zoom
            if (Date.now() - lastZoomTime < 200) {
              onLoadingChange(true);
            }
            
            // This is the correct event to emit to update the scale in the parent
            const event = new CustomEvent('pdfUpdateScale', {
              detail: { scale: lastScale }
            });
            document.dispatchEvent(event);
          }, 100);
        }
        
        initialDistance.current = null;
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (zoomDebounceTimeout) {
        clearTimeout(zoomDebounceTimeout);
      }
    };
  }, [isMobile, scale, onLoadingChange]);

  return <div ref={containerRef} className="pdf-pages-container" />;
};

export default PDFViewerModal;