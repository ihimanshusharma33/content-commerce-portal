import { useEffect, useState } from 'react';
import apiClient from '@/utils/apiClient';

export interface Subject {
  id: number;
  name: string;
  price: number;
  image: string;
  resource_link?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  total_subjects: number;
  semester: string;
  rating: string;
  total_users: number;
  reviewCount: number;
}

type EntityType = 'course' | 'subject';

export const useCourseDetails = (id?: string, type: EntityType = 'course') => {
  const [course, setCourse] = useState<Course | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const endpoint = type === 'course' ? `/courses/${id}` : `/subjects/${id}`;

    apiClient.get(endpoint)
      .then((res) => {
        const data = res.data.data;

        if (type === 'course') {
          setCourse({
            id,
            name: data.course_name,
            description: data.course_description || '',
            image: data.image,
            price: data.price,
            total_subjects: data.total_subjects,
            semester: data.semester,
            rating: Number(data.overall_rating || 0).toFixed(1),
            total_users: data.total_users,
            reviewCount: data.total_review_count,
          });

          const subjectList = data.subjects.map((subject: any) => ({
            id: subject.subject_id,
            name: subject.subject_name,
            price: subject.price || 0,
            image: subject.image || '',
          }));

          setSubjects(subjectList);
        } else {
          setCourse({
            id,
            name: data.subject_name,
            description: data.subject_description || '',
            image: data.image,
            price: data.price,
            total_subjects: data.total_chapter, 
            semester: data.semester || '',
            rating: Number(data.overall_rating || 0).toFixed(1),
            total_users: data.total_users || 0,
            reviewCount: data.total_review_count || 0,
          });

          const chapterList = data.chapters.map((chapter: any) => ({
            id: chapter.chapter_id,
            name: chapter.chapter_name,
            price: chapter.price || 0,
            image: chapter.image || '',
            resource_link: chapter.resource_link,
          }));

          setSubjects(chapterList);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, type]);

  return { course, subjects, loading };
};
