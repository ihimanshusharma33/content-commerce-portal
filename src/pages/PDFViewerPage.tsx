import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PDFViewer from '../components/PdfPreview';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const PDFViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const { pdfId } = useParams();
  const location = useLocation();
  const { pdfUrl, title } = location.state || { 
    pdfUrl: `/assets/pdf/${pdfId || 'Chapter'}.pdf`, 
    title: 'Document' 
  };

  // Prevent body scrolling when viewing PDF full screen
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      {/* Header with back button */}
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-xl font-semibold ml-4 flex-1 truncate">{title}</h1>
      </div>
      
      {/* PDF viewer container - takes up the rest of the space */}
      <div className="flex-1 w-full">
        {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />}
      </div>
    </div>
  );
};

export default PDFViewerPage;