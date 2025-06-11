import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courses, getCurrentUser } from '@/lib/data';
import { Lesson } from '@/lib/data';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import PDFViewerModal from '@/components/PDFViewerModal';
import { useAuth } from '@/contexts/AuthContext';
import { isAuthenticated } from '@/services/authService';

const CourseContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(!isMobile);
  
  // PDF state
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  // This path should point to your actual PDF file
  const pdfUrl = "/assests/pdf/Chapter.pdf";

  const user = useAuth();
  const course = courses.find(c => c.id === id);
  const isPurchased =true;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      navigate('/signin', { state: { redirectTo: `/chapter/${id}/content` } });
      return;
    }

    // Redirect to course page if course doesn't exist
    if (!course) {
      navigate('/courses');
      return;
    }

    // Redirect to course page if not purchased and not free
    if (!isPurchased) {
      navigate(`/course/${id}`);
      return;
    }

    // Set first lesson as current by default
    if (course && course.lessons.length > 0 && !currentLesson) {
      setCurrentLesson(course.lessons[0]);
    }

    // Listen for auth state changes
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [course, currentLesson, id, isPurchased, navigate]);

  // Update UI state when mobile/desktop status changes
  useEffect(() => {
    setIsMenuOpen(!isMobile);
  }, [isMobile]);

  if (!isLoggedIn || !course || !isPurchased) {
    return null; // Will redirect
  }

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // Note: PDF doesn't open automatically now
    
    // Only close the menu automatically on mobile view
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenPdf = () => {
    setIsPdfOpen(true);
  };
  
  const handleClosePdf = () => {
    setIsPdfOpen(false);
  };

  const currentLessonIndex = currentLesson ? course.lessons.findIndex(lesson => lesson.id === currentLesson.id) : 0;
  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col h-screen">
      {/* Course Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/course/${id}`)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </button>
              <h1 className="text-lg font-semibold truncate">{course.title}</h1>
            </div>
            <div className='block md:hidden lg:hidden'>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label={isMenuOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isMenuOpen && isMobile ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
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
        {/* Sidebar - Course Curriculum */}
        <aside
          className={`bg-white border-r flex-shrink-0 overflow-y-auto transition-all duration-300 h-full ${isMenuOpen
              ? "fixed inset-0 z-40 w-full md:relative md:w-80 lg:w-96"
              : "w-0 md:w-0 hidden"
            }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Course Content</h2>
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
            <div className="space-y-1">
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`w-full text-left p-3 rounded-md flex items-start hover:bg-secondary/50 transition-colors ${currentLesson?.id === lesson.id ? 'bg-secondary' : ''
                    }`}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${currentLesson?.id === lesson.id ? 'text-primary' : ''}`}>
                      {lesson.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {currentLesson ? (
            <>
              {/* Lesson content */}
              <div className="flex-1 flex items-center justify-center bg-muted">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                  <p className="text-gray-600 mb-8 max-w-md">
                    Click the button below to view the lesson materials.
                  </p>
                  
                  <Button 
                    onClick={handleOpenPdf} 
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    Open Lesson PDF
                  </Button>
                </div>
              </div>
              
              {/* PDF Viewer Modal */}
              <PDFViewerModal
                isOpen={isPdfOpen}
                onClose={handleClosePdf}
                pdfUrl={pdfUrl}
                title={currentLesson.title}
              />
              
              {/* Lesson Navigation */}
              <div className="flex justify-between p-4 border-t bg-white mt-auto">
                {prevLesson ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentLesson(prevLesson)}
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
                
                {nextLesson && (
                  <Button 
                    onClick={() => setCurrentLesson(nextLesson)}
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
                <p className="text-lg text-gray-600">Select a lesson from the sidebar to start learning</p>
                {isMobile && !isMenuOpen && (
                  <button
                    onClick={toggleSidebar}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Open Course Menu
                  </button>
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
