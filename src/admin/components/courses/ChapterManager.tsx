import React, { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchCourses } from "../../../services/apiService";
import { Card, CardContent } from "@/components/ui/card";
import apiClient from "../../../utils/apiClient";
import { Loader2, FileText, File } from "lucide-react";

// Define interfaces based on the API response
interface CourseOption {
  id: number;
  displayName: string;
  semester: number;
}

interface SubjectOption {
  subject_id: number;
  subject_name: string;
  image: string | null;
}

interface ChapterData {
  chapter_id: number;
  chapter_name: string;
  subject_id: number;
  content: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

const ChapterManager: React.FC = () => {
  // Course selection state
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  
  // Subject selection state
  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  
  // Chapter state
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [chapterFile, setChapterFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch courses on component mount
  useEffect(() => {
    setLoadingCourses(true);
    fetchCourses()
      .then((data) => {
        // Transform courses into options with concatenated name and semester
        const options = data.map(course => ({
          id: course.id,
          displayName: `${course.name} - Semester ${course.semester}`,
          semester: course.semester
        }));
        setCourseOptions(options);
      })
      .catch((error) => console.error("Failed to fetch courses:", error))
      .finally(() => setLoadingCourses(false));
  }, []);

  // Fetch subjects when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      setLoadingSubjects(true);
      setSelectedSubjectId(null); // Reset subject selection
      setChapters([]); // Reset chapters
      
      apiClient.get(`/courses/${selectedCourseId}`)
        .then(response => {
          if (response.data && response.data.status && response.data.data.subjects) {
            setSubjectOptions(response.data.data.subjects);
          } else {
            console.error("Unexpected API response:", response.data);
            setSubjectOptions([]);
          }
        })
        .catch(error => {
          console.error("Failed to fetch subjects:", error);
          setSubjectOptions([]);
        })
        .finally(() => setLoadingSubjects(false));
    } else {
      setSubjectOptions([]);
      setSelectedSubjectId(null);
    }
  }, [selectedCourseId]);

  // Fetch chapters when a subject is selected
  useEffect(() => {
    if (selectedSubjectId) {
      setLoadingChapters(true);
      
      apiClient.get(`/chapters/subject/${selectedSubjectId}`)
        .then(response => {
          if (response.data && response.data.status) {
            setChapters(response.data.data || []);
          } else {
            console.error("Unexpected API response:", response.data);
            setChapters([]);
          }
        })
        .catch(error => {
          console.error("Failed to fetch chapters:", error);
          setChapters([]);
        })
        .finally(() => setLoadingChapters(false));
    } else {
      setChapters([]);
    }
  }, [selectedSubjectId]);

  const handleAddChapter = async () => {
    if (!selectedSubjectId || !chapterName.trim()) {
      return;
    }

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('chapter_name', chapterName);
      formData.append('subject_id', selectedSubjectId.toString());
      formData.append('content', chapterContent);
      
      if (chapterFile) {
        formData.append('file', chapterFile);
      }

      const response = await apiClient.post('/chapters', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        const newChapter = response.data.data;
        setChapters(prev => [...prev, newChapter]);
        closeForm();
      }
    } catch (error) {
      console.error("Failed to create chapter:", error);
    }
  };

  const handleUpdateChapter = async () => {
    if (!selectedChapter || !chapterName.trim()) {
      return;
    }

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('chapter_name', chapterName);
      formData.append('subject_id', selectedSubjectId!.toString());
      formData.append('content', chapterContent);
      
      if (chapterFile) {
        formData.append('file', chapterFile);
      }

      const response = await apiClient.post(`/chapters/${selectedChapter.chapter_id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        const updatedChapter = response.data.data;
        setChapters(prev => 
          prev.map(chapter => 
            chapter.chapter_id === selectedChapter.chapter_id ? updatedChapter : chapter
          )
        );
        closeForm();
      }
    } catch (error) {
      console.error("Failed to update chapter:", error);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) {
      return;
    }

    try {
      const response = await apiClient.delete(`/chapters/${chapterId}`);
      
      if (response.data.status) {
        setChapters(prev => prev.filter(chapter => chapter.chapter_id !== chapterId));
      }
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setChapterFile(e.target.files[0]);
    }
  };

  const openForm = (chapter?: ChapterData) => {
    if (chapter) {
      setSelectedChapter(chapter);
      setChapterName(chapter.chapter_name);
      setChapterContent(chapter.content || "");
      setChapterFile(null); // Reset file when editing
    } else {
      setSelectedChapter(null);
      setChapterName("");
      setChapterContent("");
      setChapterFile(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedChapter(null);
    setChapterName("");
    setChapterContent("");
    setChapterFile(null);
    setIsFormOpen(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddOrUpdateChapter = () => {
    if (selectedChapter) {
      handleUpdateChapter();
    } else {
      handleAddChapter();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-xl font-semibold">Chapter Management</h3>
        <p className="text-sm text-gray-500">Manage chapters for subjects across different courses</p>
      </div>

      {/* Course Selection */}
      <div className="w-full">
        <Label htmlFor="course-select">Select Course</Label>
        <Select
          value={selectedCourseId?.toString() || ""}
          onValueChange={(value) => setSelectedCourseId(Number(value))}
          disabled={loadingCourses}
        >
          <SelectTrigger id="course-select" className="w-full">
            <SelectValue placeholder={loadingCourses ? "Loading courses..." : "Select a course"} />
          </SelectTrigger>
          <SelectContent>
            {courseOptions.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {option.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Selection */}
      {selectedCourseId && (
        <div className="w-full">
          <Label htmlFor="subject-select">Select Subject</Label>
          <Select
            value={selectedSubjectId?.toString() || ""}
            onValueChange={(value) => setSelectedSubjectId(Number(value))}
            disabled={loadingSubjects}
          >
            <SelectTrigger id="subject-select" className="w-full">
              <SelectValue placeholder={loadingSubjects ? "Loading subjects..." : "Select a subject"} />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((subject) => (
                <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                  {subject.subject_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {loadingSubjects && (
            <div className="flex items-center justify-center mt-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading subjects...</span>
            </div>
          )}
          
          {!loadingSubjects && subjectOptions.length === 0 && selectedCourseId && (
            <div className="mt-4 p-4 border rounded-md bg-amber-50 text-amber-800">
              <p>No subjects found for this course. Please add subjects first.</p>
            </div>
          )}
        </div>
      )}

      {/* Chapters List and Management */}
      {selectedSubjectId && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Chapters</h4>
            <Button onClick={() => openForm()} size="sm">
              Add New Chapter
            </Button>
          </div>

          {loadingChapters ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading chapters...</span>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">No chapters found for this subject.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chapters.map((chapter) => (
                <Card key={chapter.chapter_id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-md">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-medium">{chapter.chapter_name}</h5>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {chapter.content ? (
                              <span>{chapter.content.substring(0, 100)}...</span>
                            ) : (
                              <span className="text-gray-400 italic">No content</span>
                            )}
                          </p>
                          
                          {chapter.file_path && (
                            <div className="mt-2 flex items-center text-sm text-blue-600">
                              <File className="h-4 w-4 mr-1" />
                              <a 
                                href={chapter.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                View attachment
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openForm(chapter)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteChapter(chapter.chapter_id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Chapter Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">
              {selectedChapter ? "Edit Chapter" : "Add New Chapter"}
            </h4>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="chapter-name">Chapter Name</Label>
                <Input
                  id="chapter-name"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  placeholder="Enter chapter name"
                />
              </div>
              
              <div>
                <Label htmlFor="chapter-content">Content</Label>
                <Textarea
                  id="chapter-content"
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  placeholder="Enter chapter content"
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use simple formatting for content.
                </p>
              </div>
              
              <div>
                <Label htmlFor="chapter-file">Attachment (PDF, DOCX, etc.)</Label>
                <Input
                  id="chapter-file"
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {chapterFile && (
                  <p className="text-sm text-green-600 mt-1">
                    File selected: {chapterFile.name}
                  </p>
                )}
                {selectedChapter?.file_path && !chapterFile && (
                  <div className="mt-2 flex items-center">
                    <p className="text-sm text-gray-500 mr-2">Current file:</p>
                    <a 
                      href={selectedChapter.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <File className="h-4 w-4 mr-1" />
                      View file
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddOrUpdateChapter}
                  disabled={!chapterName.trim()}
                >
                  {selectedChapter ? "Update Chapter" : "Add Chapter"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterManager;