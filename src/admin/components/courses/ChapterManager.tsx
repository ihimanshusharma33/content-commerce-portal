import React, { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import apiClient from "../../../utils/apiClient";
import {
  Loader2,
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  FileText,
  File,
  Calendar,
  Clock,
  ImageIcon,
  X,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Define interfaces based on the API response
interface ChapterData {
  chapter_id: number;
  chapter_name: string;
  description?: string | null;
  image?: string | null;
  subject_id?: number;
  file_path?: string | null;
  resource_link?: string | null;
  created_at: string;
  updated_at: string;
}

interface SubjectOption {
  subject_id: number;
  subject_name: string;
}

interface CourseOption {
  id: number;
  displayName: string;
  semester: number;
}

const ChapterManager: React.FC = () => {
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");
  const [chapterImage, setChapterImage] = useState<File | null>(null);
  const [chapterFile, setChapterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch courses on component mount
  useEffect(() => {
    setLoadingCourses(true);
    apiClient.get('/courses')
      .then(response => {
        if (response.data && response.data.status) {
          const coursesData = response.data.data;
          const options = coursesData.map((course: any) => ({
            id: course.course_id,
            displayName: `${course.course_name} - Semester ${course.semester}`,
            semester: course.semester
          }));
          setCourseOptions(options);
        }
      })
      .catch(error => {
        console.error("Failed to fetch courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive"
        });
      })
      .finally(() => setLoadingCourses(false));
  }, []);

  // Fetch subjects when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      setLoadingSubjects(true);
      setSelectedSubjectId(null);
      setChapters([]);

      apiClient.get(`/subjects/course/${selectedCourseId}`)
        .then(response => {
          if (response.data && response.data.status) {
            const subjectsData = response.data.data;
            setSubjectOptions(subjectsData);
          } else {
            setSubjectOptions([]);
          }
        })
        .catch(error => {
          console.error("Failed to fetch subjects:", error);
          setSubjectOptions([]);
          toast({
            title: "Error",
            description: "Failed to load subjects",
            variant: "destructive"
          });
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
      setSearchTerm("");

      apiClient.get(`/chapters/subject/${selectedSubjectId}`)
        .then(response => {
          // Initialize chapters as an empty array
          let chaptersData: ChapterData[] = [];
          
          if (response.data && response.data.status) {
            // Check for nested structure with subject_details and chapters
            if (response.data.data && response.data.data.chapters && Array.isArray(response.data.data.chapters)) {
              chaptersData = response.data.data.chapters;
            } 
            // Check for flat structure (direct array)
            else if (Array.isArray(response.data.data)) {
              chaptersData = response.data.data;
            }
            // Check if data itself is an array (some APIs might return this way)
            else if (Array.isArray(response.data)) {
              chaptersData = response.data;
            }
            // If we got here and chaptersData is still empty, log the issue
            if (chaptersData.length === 0) {
              console.error("Unexpected API response format:", response.data);
              toast({
                title: "Warning",
                description: "No chapters found or unexpected data format",
                variant: "default"
              });
            }
          } else {
            console.error("Unexpected API response:", response.data);
            toast({
              title: "Error",
              description: "Unexpected data format from server",
              variant: "destructive"
            });
          }
          
          // Always set chapters to a valid array, even if empty
          setChapters(chaptersData);
        })
        .catch(error => {
          console.error("Failed to fetch chapters:", error);
          setChapters([]);
          toast({
            title: "Error",
            description: "Failed to load chapters",
            variant: "destructive"
          });
        })
        .finally(() => setLoadingChapters(false));
    } else {
      setChapters([]);
    }
  }, [selectedSubjectId]);

  const handleAddChapter = async () => {
    if (!selectedSubjectId || !chapterName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a chapter name",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('chapter_name', chapterName);
      formData.append('subject_id', selectedSubjectId.toString());
      
      if (chapterDescription) {
        formData.append('description', chapterDescription);
      }

      if (chapterFile) {
        formData.append('pdf_file', chapterFile);
      }
      
      if (chapterImage) {
        formData.append('image', chapterImage);
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
        toast({
          title: "Success",
          description: "Chapter added successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to create chapter:", error);
      toast({
        title: "Error",
        description: "Failed to add chapter",
        variant: "destructive"
      });
    }
  };

  const handleUpdateChapter = async () => {
    if (!selectedChapter || !chapterName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a chapter name",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('chapter_name', chapterName);
      formData.append('subject_id', selectedSubjectId!.toString());
      
      if (chapterDescription) {
        formData.append('description', chapterDescription);
      }

      if (chapterFile) {
        formData.append('pdf_file', chapterFile);
      }
      
      if (chapterImage) {
        formData.append('image', chapterImage);
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
        toast({
          title: "Success",
          description: "Chapter updated successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to update chapter:", error);
      toast({
        title: "Error",
        description: "Failed to update chapter",
        variant: "destructive"
      });
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
        toast({
          title: "Success",
          description: "Chapter deleted successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setChapterFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setChapterImage(e.target.files[0]);
    }
  };

  const openForm = (chapter?: ChapterData) => {
    if (chapter) {
      setSelectedChapter(chapter);
      setChapterName(chapter.chapter_name);
      setChapterDescription(chapter.description || "");
      setChapterFile(null);
      setChapterImage(null);
    } else {
      setSelectedChapter(null);
      setChapterName("");
      setChapterDescription("");
      setChapterFile(null);
      setChapterImage(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedChapter(null);
    setChapterName("");
    setChapterDescription("");
    setChapterFile(null);
    setChapterImage(null);
    setIsFormOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddOrUpdateChapter = () => {
    // Validate file size
    if (chapterFile && chapterFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "PDF file must be less than 10MB.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedChapter) {
      handleUpdateChapter();
    } else {
      handleAddChapter();
    }
  };

  // Generate a placeholder image when no chapter image is available
  const getPlaceholderImage = (chapterName: string) => {
    const colors = [
      'bg-gray-200', 'bg-blue-100', 'bg-green-100',
      'bg-yellow-100', 'bg-purple-100', 'bg-pink-100'
    ];
    const colorIndex = chapterName.length % colors.length;
    const initials = chapterName.substring(0, 2).toUpperCase();

    return (
      <div className={`h-32 w-full ${colors[colorIndex]} flex items-center justify-center rounded-t-md`}>
        <span className="text-xl font-semibold text-gray-600">{initials}</span>
      </div>
    );
  };

  // Helper function to get subject name by ID
  const getSubjectName = (subjectId: number): string => {
    const subject = subjectOptions.find(subject => subject.subject_id === subjectId);
    return subject ? subject.subject_name : `Subject #${subjectId}`;
  };

  // Filter chapters based on search term
  const filteredChapters = chapters.filter(chapter =>
    chapter.chapter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chapter.description && chapter.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="">
      {/* Course and Subject Selection */}
      <div className="">
        <div className="w-1/3 mb-4">
          <Label htmlFor="course-select" className="text-sm mb-1 block">Select Course</Label>
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
          {loadingCourses && (
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Loading courses...
            </div>
          )}
        </div>

        {selectedCourseId && (
          <div className="w-1/3 mb-4">
            <Label htmlFor="subject-select" className="text-sm mb-1 block">Select Subject</Label>
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
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Loading subjects...
              </div>
            )}
          </div>
        )}

        {selectedSubjectId && (
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-1/3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
                {searchTerm && (
                  <button
                    className="absolute right-2.5 top-2.5"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <Button
                onClick={() => openForm()}
                size="default"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chapters List */}
      {selectedSubjectId && (
        <div>
          {loadingChapters ? (
            <div className="flex justify-center items-center py-12 bg-gray-50 rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading chapters...</span>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50 border-dashed">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-base font-medium text-gray-900 mb-1">No chapters found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                This subject doesn't have any chapters yet.
              </p>
              <Button
                onClick={() => openForm()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChapters.map((chapter) => (
                <Card
                  key={chapter.chapter_id}
                  className="overflow-hidden hover:shadow-sm transition-shadow"
                >
                  {chapter.image ? (
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={chapter.image}
                        alt={chapter.chapter_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    getPlaceholderImage(chapter.chapter_name)
                  )}

                  <CardContent className="p-4">
                    <h3 className="font-medium text-base">{chapter.chapter_name}</h3>
                    <p className="text-sm text-gray-500 mt-1 h-10 line-clamp-2">
                      {chapter.description || "No description available"}
                    </p>

                    {/* Resource/PDF link */}
                    {(chapter.resource_link || chapter.file_path) && (
                      <div className="mt-2 flex items-center text-sm text-blue-600">
                        <File className="h-4 w-4 mr-2" />
                        <a
                          href={chapter.resource_link || chapter.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View attachment
                        </a>
                      </div>
                    )}
                    
                    {/* Date info */}
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(chapter.created_at)}
                      
                      {chapter.created_at !== chapter.updated_at && (
                        <span className="ml-3 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Updated: {formatDate(chapter.updated_at)}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openForm(chapter)}
                      className="h-8 px-2"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChapter(chapter.chapter_id)}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Chapter Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedChapter ? "Edit Chapter" : "Add New Chapter"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="chapter-name">Chapter Name <span className="text-red-500">*</span></Label>
              <Input
                id="chapter-name"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                placeholder="Enter chapter name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="chapter-description">Description</Label>
              <Textarea
                id="chapter-description"
                value={chapterDescription}
                onChange={(e) => setChapterDescription(e.target.value)}
                placeholder="Enter chapter description"
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="chapter-image">Image</Label>
              <Input
                id="chapter-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {chapterImage && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {chapterImage.name}
                </div>
              )}

              {selectedChapter?.image && !chapterImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Current image:</p>
                  <div className="h-24 w-auto rounded border overflow-hidden">
                    <img
                      src={selectedChapter.image}
                      alt={selectedChapter.chapter_name}
                      className="h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="chapter-file">PDF Attachment (Max 10MB)</Label>
              <Input
                id="chapter-file"
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={handleFileChange}
              />
              {chapterFile && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {chapterFile.name} ({(chapterFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
              {chapterFile && chapterFile.size > 10 * 1024 * 1024 && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>File exceeds 10MB limit. Please select a smaller file.</span>
                </div>
              )}
              {(selectedChapter?.file_path || selectedChapter?.resource_link) && !chapterFile && (
                <div className="mt-2 flex items-center">
                  <p className="text-sm text-gray-500 mr-2">Current file:</p>
                  <a
                    href={selectedChapter.file_path || selectedChapter.resource_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    <File className="h-4 w-4 mr-1" />
                    View attachment
                  </a>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Only PDF files are supported. Maximum file size: 10MB.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button
              onClick={handleAddOrUpdateChapter}
              disabled={!chapterName.trim() || (chapterFile && chapterFile.size > 10 * 1024 * 1024)}
            >
              {selectedChapter ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChapterManager;