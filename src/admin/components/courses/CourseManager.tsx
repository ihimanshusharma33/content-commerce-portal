import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { fetchCourses, createCourse, updateCourse, deleteCourse } from "../../../services/apiService";
import { Course } from "../../../../types/index";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState<number | string>(1);
  const [courseImage, setCourseImage] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch courses on component mount
  useEffect(() => {
    setLoading(true);
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error("Failed to fetch courses:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleAddOrUpdateCourse = () => {
    if (!courseName || !description || !semester) {
      alert("Please fill all required fields");
      return;
    }

    setSaving(true);
    
    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append("course_name", courseName);
    formData.append("description", description);
    formData.append("semester", semester.toString());
    
    // Add image if selected
    if (courseImage) {
      formData.append("image", courseImage);
    }

    if (selectedCourse) {
      // Update course
      updateCourse(selectedCourse.id, formData)
        .then((updatedCourse) => {
          setCourses((prev) =>
            prev.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
          );
          closeForm();
        })
        .catch((error) => console.error("Failed to update course:", error))
        .finally(() => setSaving(false));
    } else {
      // Add new course
      createCourse(formData)
        .then((newCourse) => {
          setCourses((prev) => [...prev, newCourse]);
          closeForm();
        })
        .catch((error) => console.error("Failed to create course:", error))
        .finally(() => setSaving(false));
    }
  };

  const handleDeleteCourse = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setSaving(true);
      deleteCourse(id)
        .then(() => {
          setCourses((prev) => prev.filter((course) => course.id !== id));
        })
        .catch((error) => console.error("Failed to delete course:", error))
        .finally(() => setSaving(false));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCourseImage(e.target.files[0]);
    }
  };

  const openForm = (course?: Course) => {
    if (course) {
      setSelectedCourse(course);
      setCourseName(course.name);
      setDescription(course.description || "");
      setSemester(course.semester || 1);
      setCourseImage(null); // Reset image when editing
    } else {
      setSelectedCourse(null);
      setCourseName("");
      setDescription("");
      setSemester(1);
      setCourseImage(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedCourse(null);
    setCourseName("");
    setDescription("");
    setSemester(1);
    setCourseImage(null);
    setIsFormOpen(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Courses</h3>
        <Button onClick={() => openForm()}>Add New Course</Button>
      </div>

      {/* Loader for fetching courses */}
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4 mt-4">
          {courses.length === 0 ? (
            <p className="text-center text-gray-500">No courses available.</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="border p-4 rounded-md shadow-sm bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {course.image && (
                      <img 
                        src={course.image} 
                        alt={course.name}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Semesters: {course.semester}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openForm(course)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteCourse(course.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h4 className="text-lg font-semibold mb-4">
              {selectedCourse ? "Edit Course" : "Add New Course"}
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  type="text"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter course description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="semester">Semesters</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  placeholder="Enter number of semesters"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="courseImage">Course Image</Label>
                <Input
                  id="courseImage"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
                {courseImage && (
                  <p className="text-sm text-green-600 mt-1">
                    Image selected: {courseImage.name}
                  </p>
                )}
                {selectedCourse?.image && !courseImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Current image:</p>
                    <img 
                      src={selectedCourse.image} 
                      alt={selectedCourse.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={handleAddOrUpdateCourse} 
                  disabled={saving || !courseName || !description || !semester}
                  className="flex-1"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : selectedCourse ? (
                    "Update Course"
                  ) : (
                    "Add Course"
                  )}
                </Button>
                <Button variant="outline" onClick={closeForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;