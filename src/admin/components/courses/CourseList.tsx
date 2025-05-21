import React from "react";
import { Button } from "@/components/ui/button";
import { Course } from "../../types";

interface CourseListProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onEditCourse, onDeleteCourse }) => {
  return (
    <div className="space-y-4">
      {courses.length === 0 ? (
        <p className="text-muted-foreground">No courses available. Add a new course.</p>
      ) : (
        courses.map((course) => (
          <div
            key={course.id}
            className="flex justify-between items-center border p-4 rounded-md"
          >
            <div>
              <h4 className="font-medium">{course.name}</h4>
              <p className="text-sm text-muted-foreground">Total Semesters: {course.totalSemesters}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditCourse(course)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteCourse(course)}>
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseList;