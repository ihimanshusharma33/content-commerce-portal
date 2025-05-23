import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  fetchCourses,
  fetchSubjectsByCourse,
  fetchChaptersBySubject,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../../../services/apiService";
import { Course, Subject, Chapter } from "../../../../types/index";

const ChapterManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error("Failed to fetch courses:", error));
  }, []);

  // Fetch subjects when course and semester are selected
  useEffect(() => {
    if (selectedCourseId && selectedSemester !== null) {
      fetchSubjectsByCourse(selectedCourseId)
        .then((data) => setSubjects(data.filter((subject) => subject.semester === selectedSemester)))
        .catch((error) => console.error("Failed to fetch subjects:", error));
    } else {
      setSubjects([]); // Reset subjects if course or semester is not selected
    }
  }, [selectedCourseId, selectedSemester]);

  // Fetch chapters when subject is selected
  useEffect(() => {
    if (selectedSubjectId) {
      fetchChaptersBySubject(selectedSubjectId)
        .then((data) => {
          console.log("Fetched chapters:", data);
          setChapters(data);
        })
        .catch((error) => {
          console.error("Failed to fetch chapters:", error);
          setChapters([]); // Reset chapters on error
        });
    } else {
      setChapters([]); // Reset chapters if subject is not selected
    }
  }, [selectedSubjectId]);

  const handleAddOrUpdateChapter = () => {
    if (selectedChapter) {
      // Update chapter
      updateChapter(Number(selectedChapter.id), {
        name: chapterName,
        content: chapterContent,
        subjectId: selectedSubjectId!,
      })
        .then((updatedChapter) => {
          setChapters((prev) =>
            prev.map((chapter) =>
              chapter.id === updatedChapter.id
                ? { ...updatedChapter, title: updatedChapter.name } // Ensure 'title' is included
                : chapter
            )
          );
          closeForm();
        })
        .catch((error) => console.error("Failed to update chapter:", error));
    } else {
      // Add new chapter
      createChapter({
        name: chapterName,
        subjectId: selectedSubjectId!,
        content: chapterContent,
      })
        .then((newChapter) => {
          setChapters((prev) => [...prev, newChapter]);
          closeForm();
        })
        .catch((error) => console.error("Failed to create chapter:", error));
    }
  };

  const handleDeleteChapter = (id: number) => {
    deleteChapter(id)
      .then(() => {
        setChapters((prev) => prev.filter((chapter) => chapter.id !== id));
      })
      .catch((error) => console.error("Failed to delete chapter:", error));
  };

  const openForm = (chapter?: Chapter) => {
    setSelectedChapter(chapter || null);
    setChapterName(chapter?.name || "");
    setChapterContent(chapter?.content || "");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedChapter(null);
    setChapterName("");
    setChapterContent("");
    setIsFormOpen(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Chapters</h3>

      {/* Course Dropdown */}
      <div className="flex gap-4 mt-4">
        <Select
          value={selectedCourseId?.toString() || ""}
          onValueChange={(courseId) => {
            setSelectedCourseId(Number(courseId));
            setSelectedSemester(null); // Reset semester
            setSelectedSubjectId(null); // Reset subject
            setSubjects([]); // Reset subjects
            setChapters([]); // Reset chapters
          }}
        >
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder="Select a Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Semester Dropdown */}
        {selectedCourseId && (
          <Select
            value={selectedSemester?.toString() || ""}
            onValueChange={(semester) => {
              setSelectedSemester(Number(semester));
              setSelectedSubjectId(null); // Reset subject
              setChapters([]); // Reset chapters
            }}
          >
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="Select a Semester" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: courses.find((c) => c.id === selectedCourseId)?.totalSemesters || 0 }, (_, i) => i + 1).map(
                (semester) => (
                  <SelectItem key={semester} value={semester.toString()}>
                    Semester {semester}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        )}

        {/* Subject Dropdown */}
        {selectedCourseId && selectedSemester && (
          <Select
            value={selectedSubjectId?.toString() || ""}
            onValueChange={(subjectId) => setSelectedSubjectId(Number(subjectId))}
          >
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="Select a Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Chapter List */}
      {selectedSubjectId && (
        <div>
          <Button className="mt-4" onClick={() => openForm()}>
            Add New Chapter
          </Button>
          <ul className="space-y-2 mt-4">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="border p-2 rounded-md flex justify-between items-center">
                <span>{chapter.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openForm(chapter)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteChapter(chapter.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      )}

      {/* Add/Edit Chapter Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h4 className="text-md font-semibold">
              {selectedChapter ? "Edit Chapter" : "Add New Chapter"}
            </h4>
            <input
              type="text"
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Chapter Name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
            />
            <textarea
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Chapter Content"
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddOrUpdateChapter}>
                {selectedChapter ? "Update Chapter" : "Add Chapter"}
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

export default ChapterManager;