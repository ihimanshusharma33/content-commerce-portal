import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, FileText, ArrowLeft, BookOpen, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import PDFViewerModal from '@/components/PDFViewerModal';
import { useAuth } from '@/contexts/AuthContext';
import { isAuthenticated } from '@/services/authService';
import { getSubjectChapters } from '@/services/apiService';
import PDf from '../../public/assests/pdf/Chapter.pdf'
interface Chapter {
  chapter_id: number;
  chapter_name: string;
  description?: string;
  image?: string;
  resource_link?: string;
  created_at: string;
  updated_at: string;
}

interface Subject {
  subject_id: number;
  subject_name?: string;
  course_id?: number;
  semester?: number;
  resource_link?: string;
}

const CourseContent: React.FC = () => {
  // Debug all possible parameter names
  const params = useParams();
  const { subjectId, id } = useParams<{ subjectId?: string; id?: string }>();
  

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(!isMobile);
  
  // PDF state
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Add this state
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const user = useAuth();

  // Detect DevTools
  useEffect(() => {
    let threshold = 160;
    let check = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      if (
        widthThreshold ||
        heightThreshold ||
        (window as any).firebug ||
        (window as any).devtools
      ) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };
    window.addEventListener('resize', check);
    const interval = setInterval(check, 1000);
    check();
    return () => {
      window.removeEventListener('resize', check);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log('CourseContent mounted with params:', { subjectId, id, allParams: params });
    
    // Use whichever parameter is available
    const actualSubjectId = subjectId || id;
    
    console.log('Using subjectId:', actualSubjectId);
    
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      navigate('/signin', { state: { redirectTo: `/subject/${actualSubjectId}/content` } });
      return;
    }

    // Check if we have any subject ID
    if (!actualSubjectId) {
      setError('No subject ID provided');
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading chapters for subject ID:', actualSubjectId);

        try {
          console.log('Calling getSubjectChapters API...');
          const responseData = await getSubjectChapters(parseInt(actualSubjectId));
          console.log('API response data:', responseData);

          // Set subject details
          if (responseData && responseData.subject) {
            console.log('Setting subject data:', responseData.subject);
            setSubject(responseData.subject);
          } else {
            console.log('No subject data in response');
          }
          
          // Set chapters
          if (responseData && responseData.chapters && Array.isArray(responseData.chapters)) {
            console.log('Setting chapters data:', responseData.chapters);
            setChapters(responseData.chapters);
            
            // Set first chapter as current by default
            if (responseData.chapters.length > 0) {
              console.log('Setting first chapter as current:', responseData.chapters[0]);
              setCurrentChapter(responseData.chapters[0]);
            }
          } else {
            console.log('No chapters found in response');
            setChapters([]);
          }

        } catch (err) {
          console.error('Error fetching chapters:', err);
          setError(`Failed to load chapters: ${err.message || err}`);
        }
      } catch (error) {
        console.error('Error in fetchContent:', error);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [subjectId, id, params, navigate]); // Add all params to dependency array

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Update UI state when mobile/desktop status changes
  useEffect(() => {
    setIsMenuOpen(!isMobile);
  }, [isMobile]);

  const handleChapterClick = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    
    // Only close the menu automatically on mobile view
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenPdf = () => {
    if (currentChapter?.resource_link) {
      setIsPdfOpen(true);
    }
  };
  
  const handleClosePdf = () => {
    setIsPdfOpen(false);
 };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.key === 'U') || // Ctrl+U
        (e.key === 'F12')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (devToolsOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">DevTools Detected</h2>
          <p className="text-gray-700">Please close your browser's developer tools to view this content.</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentChapterIndex = currentChapter ? chapters.findIndex(chapter => chapter.chapter_id === currentChapter.chapter_id) : 0;
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold truncate">
                {subject?.subject_name || 'Subject Chapters'}
              </h1>
            </div>
            <div className='block md:hidden lg:hidden'>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label={isMenuOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isMenuOpen && isMobile ? (
                  <X className="w-6 h-6" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar - Chapters List */}
        <aside
          className={`bg-white border-r flex-shrink-0 overflow-y-auto transition-all duration-300 h-full ${
            isMenuOpen
              ? "fixed inset-0 z-40 w-full md:relative md:w-80 lg:w-96"
              : "w-0 md:w-0 hidden"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Chapters</h2>
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-1 text-gray-600 hover:text-gray-900"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Subject Info */}
            {subject && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm text-gray-900 mb-1">
                  {subject.subject_name || 'Subject'}
                </h3>
                {subject.semester && (
                  <p className="text-xs text-gray-600">Semester: {subject.semester}</p>
                )}
              </div>
            )}

            <div className="space-y-1">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.chapter_id}
                  onClick={() => handleChapterClick(chapter)}
                  className={`w-full text-left p-3 rounded-md flex items-start hover:bg-secondary/50 transition-colors ${
                    currentChapter?.chapter_id === chapter.chapter_id ? 'bg-secondary' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      currentChapter?.chapter_id === chapter.chapter_id ? 'text-primary' : ''
                    }`}>
                      {chapter.chapter_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      {chapter.resource_link && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>Resource</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated {new Date(chapter.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {currentChapter ? (
            <>
              {/* Chapter content */}
              <div className="flex-1 flex items-center justify-center bg-muted">
                <div className="flex flex-col items-center justify-center p-6 text-center max-w-2xl">
                  <h2 className="text-2xl font-bold mb-4">{currentChapter.chapter_name}</h2>
                  
                  {currentChapter.description && (
                    <p className="text-gray-600 mb-6 max-w-md">
                      {currentChapter.description}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {currentChapter.resource_link && (
                      <Button 
                        onClick={handleOpenPdf} 
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-5 w-5" />
                        Open Resource
                      </Button>
                    )}
                  </div>
                  
                  {!currentChapter.resource_link && (
                    <p className="text-gray-500 mt-4">
                      Content for this chapter will be available soon.
                    </p>
                  )}
                </div>
              </div>
              
              {/* PDF Viewer Modal */}
              {currentChapter.resource_link && (
                <PDFViewerModal
                  isOpen={isPdfOpen}
                  onClose={handleClosePdf}
                  pdfUrl={currentChapter.resource_link} // Use local test PDF 
                  title={currentChapter.chapter_name}
                />
              )}
              
              {/* Chapter Navigation */}
              <div className="flex justify-between p-4 border-t bg-white mt-auto">
                {prevChapter ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentChapter(prevChapter)}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {nextChapter && (
                  <Button 
                    onClick={() => setCurrentChapter(nextChapter)}
                    className="flex items-center gap-2"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div>
                {chapters.length > 0 ? (
                  <>
                    <p className="text-lg text-gray-600 mb-4">Select a chapter from the sidebar to start learning</p>
                    {isMobile && !isMenuOpen && (
                      <Button onClick={toggleSidebar} variant="outline">
                        Open Chapters Menu
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No chapters available
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This subject doesn't have any chapters yet.
                    </p>
                    <Button onClick={() => navigate(-1)} variant="outline">
                      Go Back
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseContent;
