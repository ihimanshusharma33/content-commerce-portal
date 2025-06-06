import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCourses } from "@/services/apiService";
import { Loader2 } from "lucide-react";

const CourseCategories = () => {
  const [groupedCourses, setGroupedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((data) => {
        const grouped = {};

        data.forEach((course) => {
          if (!grouped[course.name]) {
            grouped[course.name] = {
              id: course.id,
              name: course.name,
              allIds: [course.id],
              image: course.image,
              minSemester: course.semester,
            };
          } else {
            grouped[course.name].allIds.push(course.id);

            if (course.semester < grouped[course.name].minSemester) {
              grouped[course.name].image = course.image;
              grouped[course.name].minSemester = course.semester;
            }
          }
        });

        setGroupedCourses(Object.values(grouped));
      })
      .catch((error) => console.error("Failed to fetch courses:", error))
      .finally(() => setLoading(false));
  }, []);

  if(loading)
     return <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
    </div>

  return (
  <section className="py-10 bg-secondary/30">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>

      {loading ? (
        <p className="text-center"><Loader2/></p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {groupedCourses.map((course) => (
            <Link
              to={`/courses?category=${course.id}`}
              key={course.name}
              className="w-40 sm:w-44 md:w-48 flex flex-col items-center p-5 bg-white rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-3">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="font-medium text-center">{course.name}</h3>
              <p className="text-sm text-gray-500">
                {course.allIds.length} Semesters
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  </section>
);
};

export default CourseCategories;
