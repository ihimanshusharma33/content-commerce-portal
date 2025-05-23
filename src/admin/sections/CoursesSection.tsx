import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CourseManager from "../components/courses/CourseManager";
import SubjectManager from "../components/courses/SubjectManager";
import ChapterManager from "../components/courses/ChapterManager";

const CoursesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "subjects" | "chapters">("courses");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Management</h2>

      {/* Buttons for Courses, Subjects, and Chapters */}
      <div className="flex gap-4">
        <Button variant={activeTab === "courses" ? "default" : "outline"} onClick={() => setActiveTab("courses")}>
          Courses
        </Button>
        <Button variant={activeTab === "subjects" ? "default" : "outline"} onClick={() => setActiveTab("subjects")}>
          Subjects
        </Button>
        <Button variant={activeTab === "chapters" ? "default" : "outline"} onClick={() => setActiveTab("chapters")}>
          Chapters
        </Button>
      </div>

      {/* Render Components Based on Active Tab */}
      {activeTab === "courses" && <CourseManager />}
      {activeTab === "subjects" && <SubjectManager />}
      {activeTab === "chapters" && <ChapterManager />}
    </div>
  );
};

export default CoursesSection;