import React, { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchCourses, createSubject, updateSubject, deleteSubject } from "../../../services/apiService";
import { Card, CardContent } from "@/components/ui/card";
import apiClient from "../../../utils/apiClient";
import { Loader2, Image as ImageIcon } from "lucide-react";

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

  // Fetch course details and subjects when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      setLoading(true);
      apiClient.get(`/courses/${selectedCourseId}`)
        .then(response => {
          if (response.data && response.data.status) {
            const courseData = response.data.data;
            setCourseDetails(courseData);
            setSubjects(courseData.subjects || []);
          } else {
            console.error("Unexpected API response:", response.data);
            setSubjects([]);
          }
        })
        .catch(error => {
          console.error("Failed to fetch course details:", error);
          setSubjects([]);
        })
        .finally(() => setLoading(false));
    } else {
      setCourseDetails(null);
      setSubjects([]);
    }
  }, [selectedCourseId]);

  const handleAddSubject = async () => {
    if (!selectedCourseId || !subjectName.trim()) {
      return;
    }

    try {
      // Create FormData for multipart/form-data request (for image upload)
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
      }
    } catch (error) {
      console.error("Failed to create subject:", error);
    }
  };

  const handleUpdateSubject = async () => {
    if (!selectedSubject || !subjectName.trim()) {
      return;
    }

    try {
      // Create FormData for multipart/form-data request (for image upload)
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
      }
    } catch (error) {
      console.error("Failed to update subject:", error);
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
      }
    } catch (error) {
      console.error("Failed to delete subject:", error);
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
      setSubjectImage(null); // Reset image when editing
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
    // Reset file input
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

  return (
    <div className="space-y-6">
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

      {/* Course Information Card */}
      {selectedCourseId && courseDetails && (
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{courseDetails.course_name} - Semester {courseDetails.semester}</h4>
                <p className="text-sm text-gray-600">{courseDetails.course_description || "No description available"}</p>
                <p className="text-sm mt-1">Total Subjects: {courseDetails.total_subjects}</p>
              </div>
              {courseDetails.image && (
                <img 
                  src={courseDetails.image} 
                  alt={courseDetails.course_name}
                  className="h-16 w-16 object-cover rounded-md"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects List and Management */}
      {selectedCourseId && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Subjects</h4>
            <Button onClick={() => openForm()} size="sm">
              Add New Subject
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading subjects...</span>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">No subjects found for this course.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject.subject_id} className="border p-4 rounded-lg shadow-sm bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {subject.image ? (
                        <img 
                          src={subject.image} 
                          alt={subject.subject_name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-md">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-medium">{subject.subject_name}</h5>
                        {subject.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{subject.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">ID: {subject.subject_id}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openForm(subject)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteSubject(subject.subject_id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h4 className="text-lg font-semibold mb-4">
              {selectedSubject ? "Edit Subject" : "Add New Subject"}
            </h4>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input
                  id="subject-name"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                />
              </div>
              
              <div>
                <Label htmlFor="subject-description">Description</Label>
                <Textarea
                  id="subject-description"
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  placeholder="Enter subject description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="subject-image">Subject Image</Label>
                <Input
                  id="subject-image"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
                {subjectImage && (
                  <p className="text-sm text-green-600 mt-1">
                    Image selected: {subjectImage.name}
                  </p>
                )}
                {selectedSubject?.image && !subjectImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Current image:</p>
                    <img 
                      src={selectedSubject.image} 
                      alt={selectedSubject.subject_name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddOrUpdateSubject}
                  disabled={!subjectName.trim()}
                >
                  {selectedSubject ? "Update Subject" : "Add Subject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManager;