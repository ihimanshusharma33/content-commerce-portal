import React, { useState } from 'react';
import { ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCards from '../dashboard/StatsCards';
import RecentCourses from '../dashboard/RecentCourses';
import PendingReviews from '../dashboard/PendingReviews';
import { Course, Review, DashboardStats } from '../../types';

interface DashboardSectionProps {
  stats: DashboardStats;
  courses: Course[];
  reviews: Review[];
  onApproveReview: (id: number) => void;
  onRejectReview: (id: number) => void;
  onViewAllCourses: () => void;
  onViewAllReviews: () => void;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats,
  courses,
  reviews,
  onApproveReview,
  onRejectReview,
  onViewAllCourses,
  onViewAllReviews
}) => {
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsPeriodSelectorOpen(false);
    // In a real app, you would fetch new data for the selected period
  };
  
  const getPendingReviewsCount = () => {
    return reviews.filter(review => review.status === "pending").length;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => setIsPeriodSelectorOpen(!isPeriodSelectorOpen)}
            className="relative"
          >
            <span className="mr-1">{selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Year'}</span>
            <ChevronDown className="h-4 w-4" />
            
            {isPeriodSelectorOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" 
                    onClick={() => handlePeriodChange('week')}
                  >
                    This Week
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" 
                    onClick={() => handlePeriodChange('month')}
                  >
                    This Month
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" 
                    onClick={() => handlePeriodChange('year')}
                  >
                    This Year
                  </button>
                </div>
              </div>
            )}
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCourses 
          courses={courses} 
          onViewAllClick={onViewAllCourses} 
        />
        
        <PendingReviews 
          reviews={reviews}
          pendingCount={getPendingReviewsCount()}
          onApprove={onApproveReview}
          onReject={onRejectReview}
          onViewAllClick={onViewAllReviews}
        />
      </div>
    </div>
  );
};

export default DashboardSection;