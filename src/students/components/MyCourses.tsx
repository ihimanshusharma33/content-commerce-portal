import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Clock, Calendar, Star, IndianRupee } from 'lucide-react';
import { getStudentPurchasedCourses } from '@/services/studentService';

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await getStudentPurchasedCourses();
        console.log('Purchased courses response:', response);
        
        // Handle the response structure properly
        if (response.data) {
          setCourses(response.data || []);
        } else {
          setCourses(response || []);
        }
      } catch (error) {
        console.error('Failed to fetch purchased courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  const CourseCard = ({ purchase }: { purchase: any }) => {
    const details = purchase.course_or_subject_details;
    const isSubject = purchase.payment_type === 'subject';
    const isExpired = purchase.is_expired;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
        <div className="flex items-start gap-2 mb-2">
          <div className={`p-1.5 rounded ${isSubject ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {isSubject ? <GraduationCap className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                isSubject 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isSubject ? 'Subject' : 'Course'}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                isExpired 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isExpired ? 'Expired' : `${purchase.days_left} days left`}
              </span>
            </div>
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {isSubject ? details.subject_name : details.course_name}
            </h3>
            {details.average_rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-gray-600">
                  {parseFloat(details.average_rating).toFixed(1)} ({details.total_reviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-green-600">
              <IndianRupee className="h-3 w-3" />
              <span>{purchase.amount}</span>
            </div>
          </div>
          {details.price && (
            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <span>Original Price: ₹{details.price}</span>
              {details.discount && parseFloat(details.discount) > 0 && (
                <span className="text-red-600">Save ₹{details.discount}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatsCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <h3 className="text-xs font-medium text-gray-600 mb-1">{title}</h3>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600">Loading your courses...</span>
        </div>
      </div>
    );
  }

  const activeItems = courses.filter((item: any) => !item.is_expired).length;
  const expiredItems = courses.filter((item: any) => item.is_expired).length;

  return (
    <div className="h-full flex flex-col">
      {/* Minimal Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-gray-600">{courses.length} Total Purchases</span>
          <span className="text-xs text-green-600">{activeItems} Active</span>
          <span className="text-xs text-red-600">{expiredItems} Expired</span>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      {courses.length > 0 && (
        <div className="flex-shrink-0 p-3 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            <StatsCard title="Total" value={courses.length} color="text-blue-600" />
            <StatsCard title="Active" value={activeItems} color="text-green-600" />
            <StatsCard title="Expired" value={expiredItems} color="text-red-600" />
          </div>
        </div>
      )}

      {/* Scrollable Courses Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {courses.length > 0 ? (
          <div>
            {courses.map((purchase: any) => (
              <CourseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No courses yet</h3>
            <p className="text-xs text-gray-600 mb-3">Start your learning journey today</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>

      {/* Minimal Footer */}
      <div className="flex-shrink-0 px-3 py-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          Access your purchased courses and track your learning progress.
        </p>
      </div>
    </div>
  );
};

export default MyCourses;