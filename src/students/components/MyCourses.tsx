import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import { getStudentPurchasedCourses } from '@/services/studentService';

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const data = await getStudentPurchasedCourses();
        console.log('Purchased courses data:', data); // Debug log
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch purchased courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading your courses...</div>;
  }

  return (
    <>
      {courses.length > 0 ? (
        <div className="space-y-6">
          {/* Course Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Purchases</h3>
              <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Items</h3>
              <p className="text-2xl font-bold text-green-600">
                {courses.filter((item: any) => !item.is_expired).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800">Expired Items</h3>
              <p className="text-2xl font-bold text-red-600">
                {courses.filter((item: any) => item.is_expired).length}
              </p>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((purchaseData: any) => {
              const details = purchaseData.course_or_subject_details;
              const isSubject = purchaseData.payment_type === 'subject';
              
              // Create a unified course object for CourseCard
              const courseForCard = {
                id: isSubject ? details.subject_id : details.course_id,
                name: isSubject ? details.subject_name : details.course_name,
                description: details.description,
                semester: details.semester,
                image: details.image,
                price: parseFloat(details.price),
                discount: parseFloat(details.discount || 0),
                averageRating: parseFloat(details.average_rating || 0),
                totalReviews: details.total_reviews || 0,
              };

              return (
                <div key={`${purchaseData.payment_type}-${purchaseData.id}`} className="relative">
                  {/* Expiry Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    {purchaseData.is_expired ? (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Expired
                      </span>
                    ) : (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {purchaseData.days_left} days left
                      </span>
                    )}
                  </div>

                  {/* Payment Type Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isSubject 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isSubject ? 'Subject' : 'Course'}
                    </span>
                  </div>

                  <CourseCard
                    course={courseForCard}
                    isPurchased={true}
                  />

                  {/* Additional Purchase Info */}
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Purchased:</span>
                      <span>{new Date(purchaseData.purchased_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span className="font-medium text-green-600">₹{purchaseData.amount}</span>
                    </div>
                    {details.average_rating && (
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="flex items-center">
                          ⭐ {parseFloat(details.average_rating).toFixed(1)} 
                          <span className="ml-1 text-xs">({details.total_reviews} reviews)</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-lg sm:text-xl font-medium mb-2">You haven't purchased any courses yet</h3>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Browse our catalog and find the perfect course to start your learning journey
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="btn-primary text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2"
          >
            Browse Courses
          </button>
        </div>
      )}
    </>
  );
};

export default MyCourses;