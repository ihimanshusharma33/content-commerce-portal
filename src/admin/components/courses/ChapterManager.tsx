import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchCourses, createCourse, updateCourse, deleteCourse } from "../../../services/apiService";
import { Course } from "../../types";
import CourseList from "./CourseList";
import CourseForm from "./CourseForm";
import DeleteDialog from "../common/DeleteDialog";

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch courses on component mount
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error("Failed to fetch courses:", error));
  }, []);

  const handleCreateCourse = (course: Partial<Course>) => {
    createCourse(course)
      .then((newCourse) => setCourses((prev) => [...prev, newCourse]))
      .catch((error) => console.error("Failed to create course:", error));
  };

  const handleUpdateCourse = (id: number, course: Partial<Course>) => {
    updateCourse(id, course)
      .then((updatedCourse) =>
        setCourses((prev) =>
          prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
        )
      )
      .catch((error) => console.error("Failed to update course:", error));
  };

  const handleDeleteCourse = (id: number) => {
    deleteCourse(id)
      .then(() => setCourses((prev) => prev.filter((c) => c.id !== id)))
      .catch((error) => console.error("Failed to delete course:", error));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Courses</h3>
        <Button onClick={() => setIsCourseFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Course
        </Button>
      </div>

      <CourseList
        courses={courses}
        onEditCourse={(course) => {
          setSelectedCourse(course);
          setIsCourseFormOpen(true);
        }}
        onDeleteCourse={(course) => {
          setSelectedCourse(course);
          setIsDeleteDialogOpen(true);
        }}
        onAddNewCourse={() => setIsCourseFormOpen(true)}
      />

      {/* Create/Edit Course Dialog */}
      {isCourseFormOpen && (
        <CourseForm
          isOpen={isCourseFormOpen}
          onClose={() => setIsCourseFormOpen(false)}
          onSubmit={(course) => {
            if (selectedCourse) {
              handleUpdateCourse(selectedCourse.id, course);
            } else {
              handleCreateCourse(course);
            }
          }}
          course={selectedCourse}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedCourse) {
            handleDeleteCourse(selectedCourse.id);
          }
        }}
        title="Delete Course"
        description={`Are you sure you want to delete the course "${selectedCourse?.name}"?`}
      />
    </div>
  );
};

export default CourseManager;