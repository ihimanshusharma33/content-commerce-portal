import React from 'react';
import { X } from 'lucide-react';

interface GooglePDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const GooglePDFModal: React.FC<GooglePDFModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title = 'Document'
}) => {
  if (!isOpen) return null;

  // Use Google Docs viewer for better compatibility
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full h-full max-w-6xl max-h-[90vh] m-4 rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold truncate">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 p-4">
          <iframe
            src={googleViewerUrl}
            className="w-full h-full border-0 rounded"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default GooglePDFModal;