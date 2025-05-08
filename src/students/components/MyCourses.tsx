import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  name: string;
  progress: number;
  lastAccessed: string;
  instructor: string;
}

interface MyCoursesProps {
  courses: Course[];
}

export const MyCourses: React.FC<MyCoursesProps> = ({ courses }) => {
  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Courses</CardTitle>
            <CardDescription>Courses you are currently enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Average Progress</CardTitle>
            <CardDescription>Across all your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.round(
                courses.reduce((acc, course) => acc + course.progress, 0) /
                courses.length
              )}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Investment</CardTitle>
            <CardDescription>Amount spent on courses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ₹{/* This would typically come from purchase history */}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.name}</CardTitle>
              <CardDescription>{course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Last accessed: {formatDateTime(course.lastAccessed)}
              </p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md">
                Continue Learning
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default MyCourses;