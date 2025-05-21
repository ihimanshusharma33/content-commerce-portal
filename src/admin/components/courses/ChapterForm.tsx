import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chapter } from "../../types";

interface ChapterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (chapter: Chapter) => void;
  chapter?: Chapter | null;
  subjectId: number;
}

const ChapterForm: React.FC<ChapterFormProps> = ({ isOpen, onClose, onSubmit, chapter, subjectId }) => {
  const [name, setName] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    if (chapter) {
      setName(chapter.name);
      setPdfFile(null); // Reset file input when editing
    } else {
      setName("");
      setPdfFile(null);
    }
  }, [chapter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !pdfFile) return;
    onSubmit({ id: chapter?.id || Date.now(), name, pdfFile, subjectId });
  };

  if (!isOpen) return null;

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">{chapter ? "Edit Chapter" : "New Chapter"}</h3>
      <div className="space-y-4">
        <Input
          placeholder="Chapter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input type="file" accept="application/pdf" onChange={handleFileChange} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{chapter ? "Update" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterForm;