import React from "react";
import { Button } from "@/components/ui/button";
import { Chapter } from "../../types";

interface ChapterListProps {
  chapters: Chapter[];
  onEditChapter: (chapter: Chapter) => void;
  onDeleteChapter: (chapter: Chapter) => void;
  onAddNewChapter: () => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  onEditChapter,
  onDeleteChapter,
  onAddNewChapter,
}) => {
  return (
    <div className="space-y-4">
      {chapters.length === 0 ? (
        <p className="text-muted-foreground">No chapters available. Add a new chapter.</p>
      ) : (
        chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="flex justify-between items-center border p-4 rounded-md"
          >
            <div>
              <h4 className="font-medium">{chapter.name}</h4>
              <p className="text-sm text-muted-foreground">{chapter.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditChapter(chapter)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteChapter(chapter)}>
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChapterList;