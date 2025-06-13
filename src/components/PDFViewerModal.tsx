import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/pdf-modal.css';

// Fix PDF worker setup - Use CDN worker as fallback
const setupPDFWorker = () => {
  try {
    // Try to use local worker first
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/src/webWorker/pdfWorker.js';
  } catch (error) {
    console.warn('Local worker failed, using CDN worker:', error);
    // Fallback to CDN worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
};

// Setup worker immediately
setupPDFWorker();

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

  // Simplified zoom handlers that definitely work
  const handleZoomIn = () => {
    console.log('Zoom IN clicked - current scale:', scale);
    setScale(prev => {
      const newScale = Math.min(5, prev + 0.25);
      console.log('Setting new scale:', newScale);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    console.log('Zoom OUT clicked - current scale:', scale);
    setScale(prev => {
      const newScale = Math.max(0.5, prev - 0.25);
      console.log('Setting new scale:', newScale);
      return newScale;
    });
  };

  const handleClose = () => {
    console.log('Close clicked');
    onClose();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        console.log('Escape key pressed');
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

  // Debug log to check scale changes
  useEffect(() => {
    console.log('Scale changed to:', scale);
  }, [scale]);

  if (!isOpen) return null;

  // Test function for debugging
  const testButtonClick = () => {
    console.log('TEST BUTTON CLICKED - This proves onClick works');
    alert('Button click detected!');
  };

  return (
    <div className="pdf-modal">
      <div className="pdf-modal-backdrop" onClick={onClose}></div>
      
      <div className="pdf-modal-container">
        {/* Header with improved button handling */}
        <div className="pdf-modal-header">
          <h2 className="text-xl font-semibold truncate">{title}</h2>

          <div className="pdf-controls">
            {/* Test button - remove after confirming clicks work */}
            <button 
              onClick={testButtonClick} 
              style={{
                background: 'red', 
                color: 'white', 
                padding: '8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              TEST
            </button>
            
            {!isMobile && (
              <>
                <button 
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  title="Zoom out"
                  type="button"
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: scale <= 0.5 ? '#f5f5f5' : 'white',
                    cursor: scale <= 0.5 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '36px',
                    minHeight: '36px'
                  }}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                
                <span 
                  className="pdf-zoom-level" 
                  style={{ 
                    margin: '0 8px', 
                    minWidth: '50px', 
                    textAlign: 'center',
                    padding: '8px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px'
                  }}
                >
                  {Math.round(scale * 100)}%
                </span>
                
                <button 
                  onClick={handleZoomIn}
                  disabled={scale >= 5}
                  title="Zoom in"
                  type="button"
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: scale >= 5 ? '#f5f5f5' : 'white',
                    cursor: scale >= 5 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '36px',
                    minHeight: '36px'
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </>
            )}
            
            <button 
              onClick={handleClose}
              title="Close"
              type="button"
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px',
                minWidth: '36px',
                minHeight: '36px'
              }}
            >
              <X className="h-5 w-5" />
            </button>
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
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
              }}
              style={{
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated SimplePDFViewer with proper worker handling
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

  // Load PDF document with improved worker handling
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

        // Ensure worker is properly set up
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          setupPDFWorker();
        }

        // Simplified loading strategy - just use the most reliable method
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          useWorkerFetch: false,
          isEvalSupported: false,
          maxImageSize: 1024 * 1024,
          disableFontFace: false,
          useSystemFonts: true,
          cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);
        
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        
        // Start rendering pages
        await renderAllPages(pdf);
        
      } catch (err: any) {
        console.error('Failed to load PDF:', err);
        onError(`Failed to load PDF: ${err.message || 'Unknown error'}`);
        onLoadingChange(false);
      }
    };

    loadPdf();

    // Cleanup function
    return () => {
      if