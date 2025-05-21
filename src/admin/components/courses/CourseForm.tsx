import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course } from "../../types";

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Partial<Course>) => void;
  course?: Course | null;
}

const CourseForm: React.FC<CourseFormProps> = ({ isOpen, onClose, onSubmit, course }) => {
  const [name, setName] = useState("");
  const [totalSemesters, setTotalSemesters] = useState<number>(1);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setTotalSemesters(course.totalSemesters || 1);
    } else {
      setName("");
      setTotalSemesters(1);
    }
  }, [course]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name, totalSemesters });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <h3 className="text-lg font-medium mb-4">{course ? "Edit Course" : "New Course"}</h3>
      <div className="space-y-4">
        <Input
          placeholder="Course Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Total Semesters"
          value={totalSemesters}
          onChange={(e) => setTotalSemesters(Number(e.target.value))}
          min={1}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{course ? "Update" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;