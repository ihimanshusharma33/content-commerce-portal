import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Subject } from "../../types";

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: Subject) => void;
  subject?: Subject | null;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ isOpen, onClose, onSubmit, subject }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setDescription(subject.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [subject]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ id: subject?.id || Date.now(), name, description });
  };

  if (!isOpen) return null;

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">{subject ? "Edit Subject" : "New Subject"}</h3>
      <div className="space-y-4">
        <Input
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Subject Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{subject ? "Update" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
};

export default SubjectForm;