import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import * as pdfjsLib from 'pdfjs-dist';
import '../styles/pdf-modal.css';

// Use PDF.js from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

// Or fallback to CDN if local doesn't work
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  // Zoom handlers
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

  return (
    <div className="pdf-modal">
      <div className="pdf-modal-backdrop" onClick={onClose}></div>
      
      <div className="pdf-modal-container">
        <div className="pdf-modal-header">
          <h2 className="text-xl font-semibold truncate">{title}</h2>

          <div className="pdf-controls">
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
                    padding: '4px 8px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
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

        {isLoading && (
          <div className="pdf-loading" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#666'
          }}>
            <div className="pdf-spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Loading PDF...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="pdf-error" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#dc2626',
            maxWidth: '80%'
          }}>
            <p style={{ marginBottom: '1rem' }}>Failed to load PDF: {error}</p>
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
                cursor: 'pointer'
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

// SimplePDFViewer with improved error handling and fallback worker
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
  const isLoadingRef = useRef(false);

  // Load PDF document with fallback worker setup
  useEffect(() => {
    if (!pdfUrl || isLoadingRef.current) {
      if (!pdfUrl) {
        onError('No PDF URL provided');
        onLoadingChange(false);
      }
      return;
    }

    const loadPdf = async () => {
      try {
        isLoadingRef.current = true;
        onLoadingChange(true);
        onError(null);

        console.log('Loading PDF from:', pdfUrl);
        console.log('Using worker:', pdfjsLib.GlobalWorkerOptions.workerSrc);

        // Fallback to CDN worker if local worker fails
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc || 
            pdfjsLib.GlobalWorkerOptions.workerSrc.includes('pdf.worker.min.js')) {
          console.log('Setting fallback CDN worker...');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }

        // Simplified PDF loading
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          useWorkerFetch: false,
          isEvalSupported: false,
          maxImageSize: 1024 * 1024,
        });

        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);
        
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        
        await renderAllPages(pdf, scale);
        
        onLoadingChange(false);
        isLoadingRef.current = false;
        
      } catch (err: any) {
        console.error('Failed to load PDF:', err);
        
        // If worker failed, try CDN fallback
        if (err.message?.includes('worker') || err.message?.includes('script')) {
          console.log('Worker failed, trying CDN fallback...');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          
          // Retry once with CDN worker
          try {
            const loadingTask = pdfjsLib.getDocument({
              url: pdfUrl,
              useWorkerFetch: false,
              isEvalSupported: false,
              maxImageSize: 1024 * 1024,
            });

            const pdf = await loadingTask.promise;
            console.log('PDF loaded with CDN worker, pages:', pdf.numPages);
            
            pdfDocRef.current = pdf;
            setTotalPages(pdf.numPages);
            
            await renderAllPages(pdf, scale);
            
            onLoadingChange(false);
            isLoadingRef.current = false;
            return;
            
          } catch (retryErr: any) {
            console.error('CDN worker retry also failed:', retryErr);
          }
        }
        
        let errorMessage = 'Unknown error';
        if (err.message?.includes('CORS')) {
          errorMessage = 'PDF blocked by CORS policy';
        } else if (err.message?.includes('404')) {
          errorMessage = 'PDF file not found';  
        } else if (err.message?.includes('fetch')) {
          errorMessage = 'Network error loading PDF';
        } else if (err.message?.includes('worker')) {
          errorMessage = 'PDF worker setup failed';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        onError(`Failed to load PDF: ${errorMessage}`);
        onLoadingChange(false);
        isLoadingRef.current = false;
      }
    };

    loadPdf();

    return () => {
      if (pdfDocRef.current) {
        try {
          pdfDocRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying PDF:', e);
        }
        pdfDocRef.current = null;
      }
      isLoadingRef.current = false;
    };
  }, [pdfUrl, onError, onLoadingChange]);

  // Re-render when scale changes
  useEffect(() => {
    if (pdfDocRef.current && totalPages > 0 && !isLoadingRef.current) {
      console.log('Scale changed, re-rendering at scale:', scale);
      renderAllPages(pdfDocRef.current, scale);
    }
  }, [scale, totalPages]);

  const renderAllPages = async (pdfDoc: any, currentScale: number) => {
    if (!containerRef.current || !pdfDoc) return;

    try {
      console.log('Rendering all pages at scale:', currentScale);
      
      containerRef.current.innerHTML = '';

      const pagesWrapper = document.createElement('div');
      pagesWrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        gap: 20px;
        min-height: 100%;
        width: 100%;
      `;
      containerRef.current.appendChild(pagesWrapper);

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: currentScale });

          const pageContainer = document.createElement('div');
          pageContainer.style.cssText = `
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
          `;

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error('Could not get canvas context');
          }

          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.cssText = `
            display: block;
            max-width: 100%;
            height: auto;
          `;

          pageContainer.appendChild(canvas);
          pagesWrapper.appendChild(pageContainer);

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          await page.render(renderContext).promise;
          console.log(`Page ${pageNum} rendered successfully`);

        } catch (pageError) {
          console.error(`Error rendering page ${pageNum}:`, pageError);
          
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            width: 600px;
            height: 400px;
            background: #f5f5f5;
            border: 2px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            margin: 10px 0;
          `;
          errorDiv.textContent = `Error loading page ${pageNum}`;
          pagesWrapper.appendChild(errorDiv);
        }
      }

      console.log('All pages rendered successfully');

    } catch (err) {
      console.error('Error rendering pages:', err);
      onError('Failed to render PDF pages');
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="pdf-pages-container"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: '#f5f5f5'
      }}
    />
  );
};

export default PDFViewerModal;