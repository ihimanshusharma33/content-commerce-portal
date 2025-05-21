import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Course, Subject, Chapter } from "../types/index";

interface UseCoursesManagementProps {
  initialCourses?: Course[];
  onCreateCourse?: (course: Course) => void;
  onUpdateCourse?: (course: Course) => void;
  onDeleteCourse?: (course: Course) => void;
  loadCourses?: () => Promise<Course[]>;
}

export function useCoursesManagement({
  initialCourses = [],
  onCreateCourse,
  onUpdateCourse,
  onDeleteCourse,
  loadCourses
}: UseCoursesManagementProps = {}) {
  // State for courses and UI
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'subjects' | 'chapters'>('courses');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>([]);
  
  // Dialog states
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
  const [isChapterFormOpen, setIsChapterFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load courses if provided
  useEffect(() => {
    if (initialCourses?.length) {
      setCourses(initialCourses);
    } else if (loadCourses) {
      fetchCourses();
    }
  }, [initialCourses]);

  // Load courses from API
  const fetchCourses = async () => {
    if (!loadCourses) return;
    
    try {
      setIsLoading(true);
      const data = await loadCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const titleOrName = course.title || course.name || "";
    const matchesSearch = titleOrName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Toggle course expansion
  const toggleCourseExpansion = (courseId: string | number) => {
    setExpandedCourseIds(prev => 
      prev.includes(String(courseId)) 
        ? prev.filter(id => id !== String(courseId)) 
        : [...prev, String(courseId)]
    );
  };

  // Course selection
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setActiveTab('subjects');
  };

  // Subject selection
  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setActiveTab('chapters');
  };

  // Create course
  const handleCreateCourse = (courseData: Partial<Course>) => {
    const newCourse = {
      id: Date.now(),
      title: courseData.title || courseData.name || 'Untitled Course',
      name: courseData.name || courseData.title || 'Untitled Course',
      description: courseData.description || '',
      status: courseData.status || 'draft',
      total_semesters: courseData.total_semesters || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subjects: []
    } as Course;
    
    setCourses(prev => [...prev, newCourse]);
    
    if (onCreateCourse) {
      onCreateCourse(newCourse);
    }
    
    toast({
      title: "Course created",
      description: `${newCourse.title || newCourse.name} has been created successfully.`
    });
    
    setIsCourseFormOpen(false);
  };

  // Update course
  const handleUpdateCourse = (courseData: Partial<Course>) => {
    if (!selectedCourse) return;
    
    const updatedCourse = {
      ...selectedCourse,
      ...courseData,
      updated_at: new Date().toISOString()
    };
    
    setCourses(prev => 
      prev.map(course => course.id === selectedCourse.id ? updatedCourse : course)
    );
    
    setSelectedCourse(updatedCourse);
    
    if (onUpdateCourse) {
      onUpdateCourse(updatedCourse);
    }
    
    toast({
      title: "Course updated",
      description: `${updatedCourse.title || updatedCourse.name} has been updated successfully.`
    });
    
    setIsCourseFormOpen(false);
  };

  // Delete course
  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    
    setCourses(prev => prev.filter(course => course.id !== selectedCourse.id));
    
    if (onDeleteCourse) {
      onDeleteCourse(selectedCourse);
    }
    
    toast({
      title: "Course deleted",
      description: `${selectedCourse.title || selectedCourse.name} has been deleted.`,
      variant: "destructive"
    });
    
    setSelectedCourse(null);
    setIsDeleteDialogOpen(false);
    setActiveTab('courses');
  };

  // Course updated (from child components)
  const handleCourseUpdated = (updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => course.id === updatedCourse.id ? updatedCourse : course)
    );
    
    if (selectedCourse?.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
    
    if (onUpdateCourse) {
      onUpdateCourse(updatedCourse);
    }
  };

  // Subject Handlers
  const handleAddSubject = (subject: Subject) => {
    if (!selectedCourse) return;
    const updatedCourse = {
      ...selectedCourse,
      subjects: [...(selectedCourse.subjects || []), subject],
    };
    handleUpdateCourse(updatedCourse);
    setIsSubjectFormOpen(false);
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    if (!selectedCourse) return;
    const updatedCourse = {
      ...selectedCourse,
      subjects: selectedCourse.subjects.map((subject) =>
        subject.id === updatedSubject.id ? updatedSubject : subject
      ),
    };
    handleUpdateCourse(updatedCourse);
    setIsSubjectFormOpen(false);
  };

  const handleDeleteSubject = () => {
    if (!selectedCourse) return;
    const updatedCourse = {
      ...selectedCourse,
      subjects: selectedCourse.subjects.filter(
        (subject) => subject.id !== selectedSubject?.id
      ),
    };
    handleUpdateCourse(updatedCourse);
    setSelectedSubject(null);
    setIsDeleteDialogOpen(false);
  };

  // Chapter Handlers
  const handleAddChapter = (chapter: Chapter) => {
    if (!selectedSubject || !selectedCourse) return;
    const updatedSubject = {
      ...selectedSubject,
      chapters: [...(selectedSubject.chapters || []), chapter],
    };
    handleUpdateSubject(updatedSubject);
    setIsChapterFormOpen(false);
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    if (!selectedSubject || !selectedCourse) return;
    const updatedSubject = {
      ...selectedSubject,
      chapters: selectedSubject.chapters.map((chapter) =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      ),
    };
    handleUpdateSubject(updatedSubject);
    setIsChapterFormOpen(false);
  };

  const handleDeleteChapter = () => {
    if (!selectedSubject || !selectedCourse) return;
    const updatedSubject = {
      ...selectedSubject,
      chapters: selectedSubject.chapters.filter(
        (chapter) => chapter.id !== selectedChapter?.id
      ),
    };
    handleUpdateSubject(updatedSubject);
    setSelectedChapter(null);
    setIsDeleteDialogOpen(false);
  };

  return {
    // State
    courses,
    filteredCourses,
    selectedCourse,
    selectedSubject,
    selectedChapter,
    activeTab,
    isLoading,
    searchTerm,
    filterStatus,
    expandedCourseIds,
    isCourseFormOpen,
    isSubjectFormOpen,
    isChapterFormOpen,
    isDeleteDialogOpen,
    isEditMode,
    
    // Setters
    setSearchTerm,
    setFilterStatus,
    setActiveTab,
    setIsCourseFormOpen,
    setIsSubjectFormOpen,
    setIsChapterFormOpen,
    setIsDeleteDialogOpen,
    setIsEditMode,
    
    // Handlers
    handleCourseSelect,
    handleSubjectSelect,
    toggleCourseExpansion,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    handleCourseUpdated,
    formatDate,
    
    // Additional actions
    openNewCourseForm: () => {
      setIsEditMode(false);
      setIsCourseFormOpen(true);
    },
    openEditCourseForm: (course: Course) => {
      setSelectedCourse(course);
      setIsEditMode(true);
      setIsCourseFormOpen(true);
    },
    openDeleteCourseDialog: (course: Course) => {
      setSelectedCourse(course);
      setIsDeleteDialogOpen(true);
    }
  };
}