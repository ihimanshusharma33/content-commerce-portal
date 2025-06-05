import React from 'react';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  UserCheck, 
  MessageSquare,
  TrendingUp,
  TrendingDown,
  BarChart
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  activeStudents: number;
  reviewsPending: number;
}

interface StatsCardsProps {
  stats: DashboardStats | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg shadow animate-pulse h-36"></div>
        ))}
      </div>
    );
  }

  // Format the numbers with commas for better readability
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Format currency 
  const formatCurrency = (num: number): string => {
    return `$${num.toLocaleString()}`;
  };

  // Mock percentage changes - in a real app, these would come from comparing periods
  const mockChanges = {
    totalCourses: 12,
    totalStudents: 8,
    totalRevenue: 15,
    activeStudents: -3,
    reviewsPending: 25,
    conversionRate: 5
  };

  // Calculate conversion rate (active students / total students)
  const conversionRate = stats.totalStudents > 0 
    ? ((stats.activeStudents / stats.totalStudents) * 100).toFixed(1) 
    : "0";

  const statCards = [
    {
      title: "Total Courses",
      value: formatNumber(stats.totalCourses),
      icon: BookOpen,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      change: mockChanges.totalCourses,
      tooltip: "Total number of courses available on the platform"
    },
    {
      title: "Total Students",
      value: formatNumber(stats.totalStudents),
      icon: Users,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      change: mockChanges.totalStudents,
      tooltip: "Total number of registered students"
    },
    {
      title: "Active Students",
      value: formatNumber(stats.activeStudents),
      icon: UserCheck,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      change: mockChanges.activeStudents,
      tooltip: "Students who have purchased at least one course"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: mockChanges.totalRevenue,
      tooltip: "Total revenue from all course purchases"
    },
    {
      title: "Reviews Pending",
      value: formatNumber(stats.reviewsPending),
      icon: MessageSquare,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      change: mockChanges.reviewsPending,
      tooltip: "Reviews waiting for approval"
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: BarChart,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-100",
      change: mockChanges.conversionRate,
      tooltip: "Percentage of students who purchased courses"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6"
          title={card.tooltip}
        >
          <div className="flex justify-between items-start">
            <div className={cn("p-3 rounded-full", card.bgColor)}>
              <card.icon className={cn("h-6 w-6", card.iconColor)} />
            </div>
            <div className="flex items-center">
              {card.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={cn(
                "text-xs font-medium",
                card.change > 0 ? "text-green-500" : "text-red-500"
              )}>
                {Math.abs(card.change)}%
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
          
          <div className="mt-3">
            <span className="text-xs text-gray-500">
              Compared to last period
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;