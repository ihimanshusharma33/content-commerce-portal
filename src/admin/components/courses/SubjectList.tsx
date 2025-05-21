import React from "react";
import { Button } from "@/components/ui/button";
import { Subject } from "../../types";

interface SubjectListProps {
  subjects: Subject[];
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
  onAddNewSubject: () => void;
}

const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  onEditSubject,
  onDeleteSubject,
  onAddNewSubject,
}) => {
  return (
    <div className="space-y-4">
      {subjects.length === 0 ? (
        <p className="text-muted-foreground">No subjects available. Add a new subject.</p>
      ) : (
        subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex justify-between items-center border p-4 rounded-md"
          >
            <div>
              <h4 className="font-medium">{subject.name}</h4>
              <p className="text-sm text-muted-foreground">{subject.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditSubject(subject)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteSubject(subject)}>
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SubjectList;