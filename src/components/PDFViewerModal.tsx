import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Fixed zoom handlers - Remove useCallback and scale dependency
  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Zoom in clicked');
    setScale(prev => {
      const newScale = Math.min(5, prev + 0.25);
      console.log('New scale:', newScale);
      return newScale;
    });
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Zoom out clicked');
    setScale(prev => {
      const newScale = Math.max(0.5, prev - 0.25);
      console.log('New scale:', newScale);
      return newScale;
    });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked');
    onClose();
  };

  // Alternative approach using refs if the above doesn't work
  const handleZoomInAlt = () => {
    setScale(currentScale => {
      const newScale = Math.min(5, currentScale + 0.25);
      console.log('Zoom in - current:', currentScale, 'new:', newScale);
      return newScale;
    });
  };

  const handleZoomOutAlt = () => {
    setScale(currentScale => {
      const newScale = Math.max(0.5, currentScale - 0.25);
      console.log('Zoom out - current:', currentScale, 'new:', newScale);
      return newScale;
    });
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

  // Add this test function right before the return statement
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
            {/* Temporary test button */}
            <button onClick={testButtonClick} style={{background: 'red', color: 'white', padding: '8px'}}>
              TEST
            </button>
            
            {!isMobile && (
              <>
                {/* Try regular buttons first */}
                <button 
                  onClick={handleZoomOutAlt}
                  disabled={scale <= 0.5}
                  title="Zoom out"
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: scale <= 0.5 ? '#f5f5f5' : 'white',
                    cursor: scale <= 0.5 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                
                <span className="pdf-zoom-level" style={{ margin: '0 8px', minWidth: '50px', textAlign: 'center' }}>
                  {Math.round(scale * 100)}%
                </span>
                
                <button 
                  onClick={handleZoomInAlt}
                  disabled={scale >= 5}
                  title="Zoom in"
                  style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: scale >= 5 ? '#f5f5f5' : 'white',
                    cursor: scale >= 5 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </>
            )}
            
            <button 
              onClick={() => onClose()}
              title="Close"
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px'
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

        // Try multiple loading strategies
        await tryLoadingStrategies();
        
      } catch (err) {
        console.error('All loading strategies failed:', err);
        onError(`Failed to load PDF: ${err.message || 'Unknown error'}`);
        onLoadingChange(false);
      }
    };

    const tryLoadingStrategies = async () => {
      const strategies = [
        // Strategy 1: Use no-cors mode with PDF.js direct loading
        async () => {
          console.log('Trying no-cors direct PDF.js load...');
          const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            isEvalSupported: false,
            maxImageSize: 1024 * 1024,
            disableFontFace: false,
            useSystemFonts: true,
            // Configure PDF.js to handle CORS issues
            httpHeaders: {},
            withCredentials: false,
            // Use built-in fetch with no-cors equivalent
            fetchOptions: {
              mode: 'no-cors'
            }
          });
          return await loadingTask.promise;
        },

        // Strategy 2: Create a proxy request through your backend
        async () => {
          console.log('Trying backend proxy method...');
          
          // Check if you have a proxy endpoint available
          const proxyUrl = `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;
          
          const loadingTask = pdfjsLib.getDocument({
            url: proxyUrl,
            isEvalSupported: false,
            maxImageSize: 1024 * 1024,
            disableFontFace: false,
            useSystemFonts: true
          });
          return await loadingTask.promise;
        },

        // Strategy 3: XMLHttpRequest with CORS handling
        async () => {
          console.log('Trying XMLHttpRequest method...');
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', pdfUrl, true);
            xhr.responseType = 'arraybuffer';
            
            // Handle CORS by not setting custom headers
            xhr.onload = async () => {
              if (xhr.status === 200 || xhr.status === 0) {
                try {
                  console.log('XHR response received, size:', xhr.response?.byteLength);
                  
                  if (!xhr.response || xhr.response.byteLength === 0) {
                    throw new Error('Empty response received');
                  }
                  
                  const loadingTask = pdfjsLib.getDocument({
                    data: xhr.response,
                    isEvalSupported: false,
                    maxImageSize: 1024 * 1024,
                    disableFontFace: false,
                    useSystemFonts: true
                  });
                  const pdf = await loadingTask.promise;
                  resolve(pdf);
                } catch (error) {
                  console.error('Error processing XHR response:', error);
                  reject(error);
                }
              } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText || 'Request failed'}`));
              }
            };
            
            xhr.onerror = (e) => {
              console.error('XHR error:', e);
              reject(new Error('Network error - CORS may be blocking the request'));
            };
            
            xhr.ontimeout = () => reject(new Error('Request timeout'));
            xhr.timeout = 30000;
            
            try {
              xhr.send();
            } catch (sendError) {
              reject(new Error('Failed to send request - CORS policy may be blocking'));
            }
          });
        },

        // Strategy 4: Use a public CORS proxy (for testing only)
        async () => {
          console.log('Trying CORS proxy method...');
          
          // Using a public CORS proxy (not recommended for production)
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pdfUrl)}`;
          
          const loadingTask = pdfjsLib.getDocument({
            url: proxyUrl,
            isEvalSupported: false,
            maxImageSize: 1024 * 1024,
            disableFontFace: false,
            useSystemFonts: true
          });
          return await loadingTask.promise;
        }
      ];

      let lastError;
      
      for (let i = 0; i < strategies.length; i++) {
        try {
          console.log(`Trying loading strategy ${i + 1}/${strategies.length}`);
          const pdf = await strategies[i]();
          console.log('PDF loaded successfully, pages:', pdf.numPages);
          
          pdfDocRef.current = pdf;
          setTotalPages(pdf.numPages);
          
          // Start rendering pages
          await renderAllPages(pdf);
          return; // Success, exit the function
          
        } catch (error: any) {
          console.warn(`Strategy ${i + 1} failed:`, error.message);
          lastError = error;
          
          // If it's a CORS error, continue to next strategy
          if (error.message?.includes('CORS') || 
              error.message?.includes('Network') ||
              error.message?.includes('fetch')) {
            continue;
          }
          
          // For other errors, still try remaining strategies
          continue;
        }
      }
      
      // If all strategies failed, throw a more descriptive error
      const corsError = lastError?.message?.includes('CORS') || 
                       lastError?.message?.includes('Network');
      
      if (corsError) {
        throw new Error('CORS policy is blocking PDF access. Please contact the administrator to enable CORS headers on the server.');
      }
      
      throw lastError || new Error('All PDF loading strategies failed');
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