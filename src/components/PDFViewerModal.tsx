import React, { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Use CDN worker for reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.2);

  useEffect(() => {
    if (!isOpen || !pdfUrl) return;

    let pdfDoc: any = null;
    setLoading(true);

    pdfjsLib.getDocument(pdfUrl).promise.then((pdf: any) => {
      pdfDoc = pdf;
      return pdf.getPage(1);
    }).then((page: any) => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      page.render({ canvasContext: context, viewport });
      setLoading(false);
    });

    return () => {
      if (pdfDoc) pdfDoc.destroy();
    };
  }, [isOpen, pdfUrl, scale]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center select-none"
      style={{ userSelect: 'none' }}
      onContextMenu={e => e.preventDefault()}
    >
      <div className="bg-white w-full h-full max-w-4xl max-h-[90vh] m-4 rounded-lg shadow-xl flex flex-col relative">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold truncate">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
              disabled={scale <= 0.5}
              className="p-2 rounded hover:bg-gray-100"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="px-2">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(3, s + 0.2))}
              disabled={scale >= 3}
              className="p-2 rounded hover:bg-gray-100"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          {loading ? (
            <span>Loading PDF...</span>
          ) : (
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
              tabIndex={-1}
              aria-label="PDF Preview"
            />
          )}
        </div>
        {/* Overlay to block right-click and selection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'auto'
          }}
          onContextMenu={e => e.preventDefault()}
        />
      </div>
    </div>
  );
};

export default PDFViewerModal;