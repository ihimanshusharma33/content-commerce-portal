import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CourseManager from "../courses/CourseManager";
import SubjectManager from "../courses/SubjectManager";
import ChapterManager from "../courses/ChapterManager";

const CoursesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "subjects" | "chapters">("courses");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

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

      {/* Dynamic Content Based on Active Tab */}
      {activeTab === "courses" && (
        <CourseManager
          onSelectCourse={(courseId) => setSelectedCourseId(courseId)}
        />
      )}

      {activeTab === "subjects" && (
        <div className="space-y-4">
          {/* Course Dropdown */}
          <Select
            value={selectedCourseId?.toString() || ""}
            onValueChange={(courseId) => setSelectedCourseId(Number(courseId))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Course" />
            </SelectTrigger>
            <SelectContent>
              {/* Replace with dynamic course list */}
              <SelectItem value="1">Course 1</SelectItem>
              <SelectItem value="2">Course 2</SelectItem>
            </SelectContent>
          </Select>

          {/* Semester Dropdown */}
          {selectedCourseId && (
            <Select
              value={selectedSemester?.toString() || ""}
              onValueChange={(semester) => setSelectedSemester(Number(semester))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Semester" />
              </SelectTrigger>
              <SelectContent>
                {/* Replace with dynamic semester list */}
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Subject Manager */}
          {selectedCourseId && selectedSemester && (
            <SubjectManager
              courseId={selectedCourseId}
              semester={selectedSemester}
              onSelectSubject={(subjectId) => setSelectedSubjectId(subjectId)}
            />
          )}
        </div>
      )}

      {activeTab === "chapters" && (
        <div className="space-y-4">
          {/* Course Dropdown */}
          <Select
            value={selectedCourseId?.toString() || ""}
            onValueChange={(courseId) => setSelectedCourseId(Number(courseId))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Course" />
            </SelectTrigger>
            <SelectContent>
              {/* Replace with dynamic course list */}
              <SelectItem value="1">Course 1</SelectItem>
              <SelectItem value="2">Course 2</SelectItem>
            </SelectContent>
          </Select>

          {/* Semester Dropdown */}
          {selectedCourseId && (
            <Select
              value={selectedSemester?.toString() || ""}
              onValueChange={(semester) => setSelectedSemester(Number(semester))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Semester" />
              </SelectTrigger>
              <SelectContent>
                {/* Replace with dynamic semester list */}
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Subject Dropdown */}
          {selectedCourseId && selectedSemester && (
            <Select
              value={selectedSubjectId?.toString() || ""}
              onValueChange={(subjectId) => setSelectedSubjectId(Number(subjectId))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Subject" />
              </SelectTrigger>
              <SelectContent>
                {/* Replace with dynamic subject list */}
                <SelectItem value="1">Subject 1</SelectItem>
                <SelectItem value="2">Subject 2</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Chapter Manager */}
          {selectedCourseId && selectedSemester && selectedSubjectId && (
            <ChapterManager subjectId={selectedSubjectId} />
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesSection;