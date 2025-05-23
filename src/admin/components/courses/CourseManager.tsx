import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchCourses, createCourse, updateCourse, deleteCourse } from "../../../services/apiService";
import { Course } from "../../../../types/index";

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [totalSemesters, setTotalSemesters] = useState<number | string>(""); // New field for total semesters
  const [loading, setLoading] = useState(true); // Loading state for fetching courses
  const [saving, setSaving] = useState(false); // Loading state for saving courses

  // Fetch courses on component mount
  useEffect(() => {
    setLoading(true);
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error("Failed to fetch courses:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleAddOrUpdateCourse = () => {
    setSaving(true);
    if (selectedCourse) {
      // Update course
      updateCourse(selectedCourse.id, { name: newCourseName, totalSemesters: Number(totalSemesters) })
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
      createCourse({ name: newCourseName, totalSemesters: Number(totalSemesters) })
        .then((newCourse) => {
          setCourses((prev) => [...prev, newCourse]);
          closeForm();
        })
        .catch((error) => console.error("Failed to create course:", error))
        .finally(() => setSaving(false));
    }
  };

  const handleDeleteCourse = (id: number) => {
    setSaving(true);
    deleteCourse(id)
      .then(() => {
        setCourses((prev) => prev.filter((course) => course.id !== id));
      })
      .catch((error) => console.error("Failed to delete course:", error))
      .finally(() => setSaving(false));
  };

  const openForm = (course?: Course) => {
    setSelectedCourse(course || null);
    setNewCourseName(course?.name || "");
    setTotalSemesters(course?.totalSemesters || ""); // Pre-fill total semesters if editing
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedCourse(null);
    setNewCourseName("");
    setTotalSemesters("");
    setIsFormOpen(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Courses</h3>

      {/* Add New Course Button */}
      <Button onClick={() => openForm()}>Add New Course</Button>

      {/* Loader for fetching courses */}
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <ul className="space-y-2 mt-4">
          {courses.map((course) => (
            <li key={course.id} className="border p-2 rounded-md flex justify-between items-center">
              <span>
                {course.name} (Semesters: {course.totalSemesters})
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openForm(course)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteCourse(course.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add/Edit Course Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h4 className="text-md font-semibold">
              {selectedCourse ? "Edit Course" : "Add New Course"}
            </h4>
            <input
              type="text"
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Course Name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
            />
            <input
              type="number"
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Total Semesters"
              value={totalSemesters}
              onChange={(e) => setTotalSemesters(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddOrUpdateCourse} disabled={saving}>
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : selectedCourse ? (
                  "Update Course"
                ) : (
                  "Add Course"
                )}
              </Button>
              <Button variant="outline" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;