import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SubjectList from "./SubjectList";
import SubjectForm from "./SubjectForm";
import DeleteDialog from "../common/DeleteDialog";
import { Subject } from "../../types";

interface SubjectManagerProps {
  courseId: number;
  onSelectSubject: (subjectId: number) => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ courseId, onSelectSubject }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateSubject = (subject: Subject) => {
    setSubjects([...subjects, { ...subject, id: Date.now() }]);
    setIsSubjectFormOpen(false);
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === updatedSubject.id ? updatedSubject : subject
      )
    );
    setIsSubjectFormOpen(false);
  };

  const handleDeleteSubject = () => {
    setSubjects(subjects.filter((subject) => subject.id !== selectedSubject?.id));
    setSelectedSubject(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Subjects</h3>
        <Button onClick={() => setIsSubjectFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Subject
        </Button>
      </div>

      <SubjectList
        subjects={subjects}
        onEditSubject={(subject) => {
          setSelectedSubject(subject);
          setIsSubjectFormOpen(true);
        }}
        onDeleteSubject={(subject) => {
          setSelectedSubject(subject);
          setIsDeleteDialogOpen(true);
        }}
        onAddNewSubject={() => setIsSubjectFormOpen(true)}
      />

      {/* Create/Edit Subject Dialog */}
      <SubjectForm
        isOpen={isSubjectFormOpen}
        onClose={() => setIsSubjectFormOpen(false)}
        onSubmit={(subject) => {
          if (selectedSubject) {
            handleUpdateSubject(subject);
          } else {
            handleCreateSubject(subject);
          }
        }}
        subject={selectedSubject}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteSubject}
        title="Delete Subject"
        description={`Are you sure you want to delete the subject "${selectedSubject?.name}"?`}
      />
    </div>
  );
};

export default SubjectManager;