import React from 'react';
import { ChevronRight } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow 
} from "@/components/ui/table";
import { Course } from '../../types';

interface RecentCoursesProps {
  courses: Course[];
  onViewAllClick: () => void;
}

const RecentCourses: React.FC<RecentCoursesProps> = ({ courses, onViewAllClick }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Courses</CardTitle>
        <CardDescription>Latest courses added to the platform</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {courses.slice(0, 3).map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="ml-auto" onClick={onViewAllClick}>
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentCourses;