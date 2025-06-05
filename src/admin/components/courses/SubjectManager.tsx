import React, { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchCourses } from "../../../services/apiService";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import apiClient from "../../../utils/apiClient";
import {
  Loader2,
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  ImageIcon,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Define interfaces based on the API response
interface CourseDetails {
  course_name: string;
  course_description: string | null;
  semester: number;
  image: string;
  total_subjects: number;
  subjects: SubjectData[];
  total_users: number;
  overall_rating: string;
}

interface SubjectData {
  subject_id: number;
  subject_name: string;
  course_id: number;
  image: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface CourseOption {
  id: number;
  displayName: string;
  semester: number;
}

const SubjectManager: React.FC = () => {
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [subjectImage, setSubjectImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch courses on component mount
  useEffect(() => {
    setLoadingCourses(true);
    fetchCourses()
      .then((data) => {
        const options = data.map(course => ({
          id: course.id,
          displayName: `${course.name} - Semester ${course.semester}`,
          semester: course.semester
        }));
        setCourseOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive"
        });
      })
      .finally(() => setLoadingCourses(false));
  }, []);

  // Fetch course details and subjects when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      setLoading(true);
      setSearchTerm("");

      apiClient.get(`/courses/${selectedCourseId}`)
        .then(response => {
          if (response.data && response.data.status) {
            const courseData = response.data.data;
            setCourseDetails(courseData);
            setSubjects(courseData.subjects || []);
          } else {
            setSubjects([]);
            toast({
              title: "Error",
              description: "Unexpected data format",
              variant: "destructive"
            });
          }
        })
        .catch(error => {
          console.error("Failed to fetch course details:", error);
          setSubjects([]);
          toast({
            title: "Error",
            description: "Failed to load course details",
            variant: "destructive"
          });
        })
        .finally(() => setLoading(false));
    } else {
      setCourseDetails(null);
      setSubjects([]);
    }
  }, [selectedCourseId]);

  const handleAddSubject = async () => {
    if (!selectedCourseId || !subjectName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a subject name",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('subject_name', subjectName);
      formData.append('course_id', selectedCourseId.toString());

      if (subjectDescription) {
        formData.append('description', subjectDescription);
      }

      if (subjectImage) {
        formData.append('image', subjectImage);
      }

      const response = await apiClient.post('/subjects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        const newSubject = response.data.data;
        setSubjects(prev => [...prev, newSubject]);
        closeForm();
        toast({
          title: "Success",
          description: "Subject added successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to create subject:", error);
      toast({
        title: "Error",
        description: "Failed to add subject",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSubject = async () => {
    if (!selectedSubject || !subjectName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a subject name",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('subject_name', subjectName);
      formData.append('course_id', selectedCourseId!.toString());

      if (subjectDescription) {
        formData.append('description', subjectDescription);
      }

      if (subjectImage) {
        formData.append('image', subjectImage);
      }

      const response = await apiClient.post(`/subjects/${selectedSubject.subject_id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        const updatedSubject = response.data.data;
        setSubjects(prev =>
          prev.map(subject =>
            subject.subject_id === selectedSubject.subject_id ? updatedSubject : subject
          )
        );
        closeForm();
        toast({
          title: "Success",
          description: "Subject updated successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to update subject:", error);
      toast({
        title: "Error",
        description: "Failed to update subject",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    try {
      const response = await apiClient.delete(`/subjects/${subjectId}`);

      if (response.data.status) {
        setSubjects(prev => prev.filter(subject => subject.subject_id !== subjectId));
        toast({
          title: "Success",
          description: "Subject deleted successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to delete subject:", error);
      toast({
        title: "Error",
        description: "Failed to delete subject",
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubjectImage(e.target.files[0]);
    }
  };

  const openForm = (subject?: SubjectData) => {
    if (subject) {
      setSelectedSubject(subject);
      setSubjectName(subject.subject_name);
      setSubjectDescription(subject.description || "");
      setSubjectImage(null);
    } else {
      setSelectedSubject(null);
      setSubjectName("");
      setSubjectDescription("");
      setSubjectImage(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedSubject(null);
    setSubjectName("");
    setSubjectDescription("");
    setSubjectImage(null);
    setIsFormOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddOrUpdateSubject = () => {
    if (selectedSubject) {
      handleUpdateSubject();
    } else {
      handleAddSubject();
    }
  };

  // Generate a placeholder image when no subject image is available
  const getPlaceholderImage = (subjectName: string) => {
    const colors = [
      'bg-gray-200', 'bg-blue-100', 'bg-green-100',
      'bg-yellow-100', 'bg-purple-100', 'bg-pink-100'
    ];
    const colorIndex = subjectName.length % colors.length;
    const initials = subjectName.substring(0, 2).toUpperCase();

    return (
      <div className={`h-32 w-full ${colors[colorIndex]} flex items-center justify-center rounded-t-md`}>
        <span className="text-xl font-semibold text-gray-600">{initials}</span>
      </div>
    );
  };

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject =>
    subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="">

      {/* Course Selection and Search */}
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
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-1/3">
              <div className="relative ">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search subjects..."
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
                Add Subject
              </Button>
            </div>

          </div>
        )}
      </div>

      {/* Subjects List */}
      {selectedCourseId && (
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12 bg-gray-50 rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading subjects...</span>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50 border-dashed">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-base font-medium text-gray-900 mb-1">No subjects found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                This course doesn't have any subjects yet.
              </p>
              <Button
                onClick={() => openForm()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((subject) => (
                <Card
                  key={subject.subject_id}
                  className="overflow-hidden hover:shadow-sm transition-shadow"
                >
                  {subject.image ? (
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={subject.image}
                        alt={subject.subject_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    getPlaceholderImage(subject.subject_name)
                  )}

                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm">{subject.subject_name}</h3>
                    <p className="text-sm text-gray-500 mt-1 h-10">
                      {subject.description || "No description available"}
                    </p>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openForm(subject)}
                      className="h-8 px-2"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubject(subject.subject_id)}
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

      {/* Add/Edit Subject Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSubject ? "Edit Subject" : "Add New Subject"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="subject-name">Subject Name <span className="text-red-500">*</span></Label>
              <Input
                id="subject-name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Enter subject name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="subject-description">Description</Label>
              <Textarea
                id="subject-description"
                value={subjectDescription}
                onChange={(e) => setSubjectDescription(e.target.value)}
                placeholder="Enter subject description"
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="subject-image">Image</Label>
              <Input
                id="subject-image"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />

              {subjectImage && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {subjectImage.name}
                </div>
              )}

              {selectedSubject?.image && !subjectImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Current image:</p>
                  <div className="h-24 w-auto rounded border overflow-hidden">
                    <img
                      src={selectedSubject.image}
                      alt={selectedSubject.subject_name}
                      className="h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button
              onClick={handleAddOrUpdateSubject}
              disabled={!subjectName.trim()}
            >
              {selectedSubject ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectManager;