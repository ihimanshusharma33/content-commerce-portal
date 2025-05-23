import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchCourses, fetchSubjectsByCourse, createSubject, updateSubject, deleteSubject } from "../../../services/apiService";
import { Course, Subject } from "../../../../types/index";

const SubjectManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [resourceLink, setResourceLink] = useState<string | null>("");

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error("Failed to fetch courses:", error));
  }, []);

  useEffect(() => {
    if (selectedCourseId && selectedSemester !== null) {
      fetchSubjectsByCourse(selectedCourseId)
        .then((data) => setSubjects(data.filter((subject) => subject.semester === selectedSemester)))
        .catch((error) => console.error("Failed to fetch subjects:", error));
    }
  }, [selectedCourseId, selectedSemester]);

  const handleAddOrUpdateSubject = () => {
    if (selectedSubject) {
      // Update subject
      updateSubject(selectedSubject.id, {
        name: subjectName,
        courseId: selectedCourseId!,
        semester: selectedSemester!,
        resourceLink,
      })
        .then((updatedSubject) => {
          setSubjects((prev) =>
            prev.map((subject) => (subject.id === updatedSubject.id ? updatedSubject : subject))
          );
          closeForm();
        })
        .catch((error) => console.error("Failed to update subject:", error));
    } else {
      // Add new subject
      createSubject({
        name: subjectName,
        courseId: selectedCourseId!,
        semester: selectedSemester!,
        resourceLink,
      })
        .then((newSubject) => {
          setSubjects((prev) => [...prev, newSubject]);
          closeForm();
        })
        .catch((error) => console.error("Failed to create subject:", error));
    }
  };

  const handleDeleteSubject = (id: number) => {
    deleteSubject(id)
      .then(() => {
        setSubjects((prev) => prev.filter((subject) => subject.id !== id));
      })
      .catch((error) => console.error("Failed to delete subject:", error));
  };

  const openForm = (subject?: Subject) => {
    setSelectedSubject(subject || null);
    setSubjectName(subject?.name || "");
    setResourceLink(subject?.resourceLink || "");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedSubject(null);
    setSubjectName("");
    setResourceLink("");
    setIsFormOpen(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Subjects</h3>
      <div className="flex justify-start  gap-4 items-center mt-4">

        {/* Course Dropdown */}
        <Select
          value={selectedCourseId?.toString() || ""}
          onValueChange={(courseId) => {
            setSelectedCourseId(Number(courseId));
            setSelectedSemester(null); // Reset semester
            setSubjects([]); // Reset subjects
          }}
        >
          <SelectTrigger className="w-1/3 mt-4">
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
            onValueChange={(semester) => setSelectedSemester(Number(semester))}
          >
            <SelectTrigger className="w-1/3 mt-4">
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


      </div>
      {/* Subject List */}
      {selectedCourseId && selectedSemester && (

        <div>
          <Button className="mt-4" onClick={() => openForm()}>
            Add New Subject
          </Button>
          <ul className="space-y-2 mt-4">
            {subjects.map((subject, index) => (
              <li key={index} className="border p-2 rounded-md flex justify-between items-center">
                <span>{subject.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openForm(subject)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteSubject(subject.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h4 className="text-md font-semibold">
              {selectedSubject ? "Edit Subject" : "Add New Subject"}
            </h4>
            <input
              type="text"
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
            <input
              type="text"
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Resource Link (Optional)"
              value={resourceLink || ""}
              onChange={(e) => setResourceLink(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddOrUpdateSubject}>
                {selectedSubject ? "Update Subject" : "Add Subject"}
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

export default SubjectManager;