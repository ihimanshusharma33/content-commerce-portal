import React, { useState } from 'react';
import { 
  ChevronDown, 
  RefreshCw,
  Users,
  UserPlus,
  ChevronRight,
  DollarSign,
  CalendarDays,
  GraduationCap,
  BookCopy,
  FileText,
  BookOpen,
  Star,
  CheckCircle,
  Timer,
  BadgeAlert,
  ShoppingCart,
  UserCheck,
  BarChart4,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  LucideProps
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Stats } from '../AdminDashoboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface DashboardSectionProps {
  stats: Stats | null;
  isLoading: boolean;
  onSetActiveSection: (section: string) => void;
  onApproveReview: (reviewId: number) => void;
  onRejectReview: (reviewId: number) => void;
  onViewAllCourses: () => void;
  onViewAllReviews: () => void;
  onViewAllTransactions: () => void;
  onViewAllStudents: () => void;
}

interface TrendIndicatorProps extends LucideProps {
  value: number;
  className?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ value, className, ...props }) => {
  if (value === 0) return null;
  
  if (value > 0) {
    return (
      <div className={cn("flex items-center text-emerald-600", className)}>
        <ArrowUpRight className="h-3 w-3 mr-1" {...props} />
        <span>{value}%</span>
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center text-rose-600", className)}>
      <ArrowDownRight className="h-3 w-3 mr-1" {...props} />
      <span>{Math.abs(value)}%</span>
    </div>
  );
};

const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats,
  isLoading,
  onSetActiveSection,
  onApproveReview,
  onRejectReview,
  onViewAllCourses,
  onViewAllReviews,
  onViewAllTransactions,
  onViewAllStudents
}) => {
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsPeriodSelectorOpen(false);
  };
  
  const handleRefresh = () => {
    // Refresh dashboard data
    window.location.reload();
  };
  
  // Format currency values for display
  const formatCurrency = (value: string | undefined): string => {
    if (!value) return '$0.00';
    return `$${parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Calculate growth percentages - this is a placeholder
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate total pending reviews
  const totalPendingReviews = stats ? 
    (stats.pending_course_reviews || 0) + (stats.pending_subject_reviews || 0) : 0;
  
  // Get percentage of purchasing users
  const purchasingPercentage = stats && stats.total_users > 0 
    ? Math.round((stats.total_purchasing_users / stats.total_users) * 100)
    : 0;
    
  // Mock growth rates (in a real app, these would come from comparing current/previous periods)
  const mockStudentGrowth = 8;
  const mockRevenueGrowth = 12;
  const mockContentGrowth = 5;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of your learning management system</p>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="relative" onClick={() => setIsPeriodSelectorOpen(!isPeriodSelectorOpen)}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{selectedPeriod === 'week' ? 'This Week' : selectedPeriod === 'month' ? 'This Month' : 'This Year'}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                  
                  {isPeriodSelectorOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-36">
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter dashboard data by time period</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="default" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh dashboard data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center p-12 bg-white rounded-lg border shadow-sm">
          <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
          <span className="text-gray-600 font-medium">Loading dashboard data...</span>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest statistics</p>
        </div>
      ) : (
        <>
          {/* Key Stats Overview */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Students */}
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                  <TrendIndicator value={mockStudentGrowth} className="text-xs" />
                </div>
                <div className="mt-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <UserPlus className="mr-1 h-3 w-3 text-emerald-500" />
                      <span>{stats?.new_users_today || 0} new today</span>
                    </div>
                    <span className="text-xs">
                      {stats?.total_users_this_month || 0} this month
                    </span>
                  </div>
                  <div className="relative h-1.5 mt-2 w-full overflow-hidden bg-gray-200 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                      style={{ width: `${purchasingPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Active users</span>
                    <span className="font-medium">{purchasingPercentage}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-2 border-t bg-gray-50">
                <Button variant="ghost" size="sm" className="w-full" onClick={onViewAllStudents}>
                  <span>View all students</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Total Revenue */}
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="rounded-full bg-green-100 p-2 text-green-700">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue)}</div>
                  <TrendIndicator value={mockRevenueGrowth} className="text-xs" />
                </div>
                <div className="mt-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 mb-2">
                    <span>Today: {formatCurrency(stats?.total_revenue_today)}</span>
                    <span>Month: {formatCurrency(stats?.total_revenue_this_month)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div className="flex flex-col items-center justify-center rounded bg-green-50 px-2 py-1 text-center">
                      <span className="text-xs text-gray-500">Success</span>
                      <span className="text-sm font-medium text-green-700">{stats?.total_purchases || 0}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded bg-orange-50 px-2 py-1 text-center">
                      <span className="text-xs text-gray-500">Pending</span>
                      <span className="text-sm font-medium text-orange-700">{stats?.total_pending_transactions || 0}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded bg-red-50 px-2 py-1 text-center">
                      <span className="text-xs text-gray-500">Failed</span>
                      <span className="text-sm font-medium text-red-700">{stats?.total_failed_transactions || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-2 border-t bg-gray-50">
                <Button variant="ghost" size="sm" className="w-full" onClick={onViewAllTransactions}>
                  <span>View transactions</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Total Courses & Content */}
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Content</CardTitle>
                <div className="rounded-full bg-purple-100 p-2 text-purple-700">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{stats?.total_courses || 0} Courses</div>
                  <TrendIndicator value={mockContentGrowth} className="text-xs" />
                </div>
                <div className="mt-2 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookCopy className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-sm">Subjects</span>
                    </div>
                    <span className="font-medium text-sm">{stats?.total_subjects || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-1.5 h-3.5 w-3.5 text-violet-600" />
                      <span className="text-sm">Chapters</span>
                    </div>
                    <span className="font-medium text-sm">{stats?.total_chapters || 0}</span>
                  </div>
                  <div className="mt-1 pt-1 border-t">
                    <div className="text-xs text-gray-500">Average content per course</div>
                    <div className="flex items-center text-sm mt-1">
                      <Progress 
                        value={stats && stats.total_courses > 0 ? 
                          (stats.total_subjects / stats.total_courses) * 20 : 0} 
                        className="h-1.5 flex-1 mr-2" 
                      />
                      <span className="text-xs font-medium">
                        {stats && stats.total_courses > 0 ? 
                          (stats.total_subjects / stats.total_courses).toFixed(1) : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-2 border-t bg-gray-50">
                <Button variant="ghost" size="sm" className="w-full" onClick={onViewAllCourses}>
                  <span>Manage content</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Pending Reviews */}
            <Card className={cn(
              "overflow-hidden transition-all duration-200 hover:shadow-md",
              totalPendingReviews > 0 ? "border-amber-300 bg-gradient-to-br from-white to-amber-50" : ""
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <div className={cn(
                  "rounded-full p-2",
                  totalPendingReviews > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                )}>
                  <Star className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className={cn(
                    "text-2xl font-bold",
                    totalPendingReviews > 0 ? "text-amber-700" : ""
                  )}>
                    {totalPendingReviews}
                  </div>
                  {totalPendingReviews > 0 && (
                    <div className="flex items-center bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                      <span>Action needed</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="mr-1.5 h-3.5 w-3.5 text-amber-700" />
                      <span className="text-sm">Course reviews</span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium px-2 py-0.5 rounded-full",
                      stats?.pending_course_reviews ? "bg-amber-100 text-amber-800" : "bg-gray-100"
                    )}>
                      {stats?.pending_course_reviews || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookCopy className="mr-1.5 h-3.5 w-3.5 text-amber-700" />
                      <span className="text-sm">Subject reviews</span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium px-2 py-0.5 rounded-full",
                      stats?.pending_subject_reviews ? "bg-amber-100 text-amber-800" : "bg-gray-100"
                    )}>
                      {stats?.pending_subject_reviews || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className={cn(
                "p-2 border-t",
                totalPendingReviews > 0 ? "bg-amber-50" : "bg-gray-50"
              )}>
                <Button 
                  variant={totalPendingReviews > 0 ? "default" : "ghost"} 
                  size="sm" 
                  className={cn(
                    "w-full",
                    totalPendingReviews > 0 ? "bg-amber-600 hover:bg-amber-700" : ""
                  )} 
                  onClick={onViewAllReviews}
                >
                  <span>Manage reviews</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Transactions Summary */}
            <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Transactions Summary</CardTitle>
                    <CardDescription>Overview of all purchases</CardDescription>
                  </div>
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-green-100 p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Successful</div>
                      <div className="text-xs text-muted-foreground">Total completed transactions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{stats?.total_purchases || 0}</div>
                    <div className="text-xs text-green-600">{stats?.total_success_purchase_today || 0} today</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-amber-100 p-2">
                      <Timer className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Pending</div>
                      <div className="text-xs text-muted-foreground">Transactions awaiting completion</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{stats?.total_pending_transactions || 0}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-red-100 p-2">
                      <BadgeAlert className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Failed</div>
                      <div className="text-xs text-muted-foreground">Transactions that were not completed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{stats?.total_failed_transactions || 0}</div>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-dashed">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Success Rate</div>
                    <div className="text-sm font-medium">
                      {stats && (stats.total_purchases + stats.total_failed_transactions) > 0 
                        ? Math.round((stats.total_purchases / (stats.total_purchases + stats.total_failed_transactions)) * 100)
                        : 0}%
                    </div>
                  </div>
                  <Progress 
                    value={stats && (stats.total_purchases + stats.total_failed_transactions) > 0 
                      ? (stats.total_purchases / (stats.total_purchases + stats.total_failed_transactions)) * 100
                      : 0} 
                    className="h-2 mt-2" 
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" className="w-full" onClick={onViewAllTransactions}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>

            {/* Student Engagement */}
            <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Student Engagement</CardTitle>
                    <CardDescription>User activity statistics</CardDescription>
                  </div>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-blue-100 p-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Active Students</div>
                      <div className="text-xs text-muted-foreground">Students who purchased courses</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{stats?.total_purchasing_users || 0}</div>
                    <div className="text-xs text-blue-600">
                      {stats && stats.total_users > 0 ? 
                        `${Math.round((stats.total_purchasing_users / stats.total_users) * 100)}% of total` : 
                        '0% of total'
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-indigo-100 p-2">
                      <Users className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">New Students</div>
                      <div className="text-xs text-muted-foreground">Recently registered users</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{stats?.new_users_today || 0} today</div>
                    <div className="text-xs text-indigo-600">{stats?.total_users_this_week || 0} this week</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-purple-100 p-2">
                      <BarChart4 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Student Growth</div>
                      <div className="text-xs text-muted-foreground">Monthly user increase rate</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{stats?.total_users_this_month || 0}</div>
                    <div className="text-xs text-purple-600">this month</div>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-dashed">
                  <div className="text-sm font-medium mb-2">Student Acquisition</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 rounded-md p-2 text-center">
                      <div className="text-xs text-gray-500">Today</div>
                      <div className="text-sm font-medium text-blue-700">{stats?.new_users_today || 0}</div>
                    </div>
                    <div className="bg-blue-50 rounded-md p-2 text-center">
                      <div className="text-xs text-gray-500">Week</div>
                      <div className="text-sm font-medium text-blue-700">{stats?.total_users_this_week || 0}</div>
                    </div>
                    <div className="bg-blue-50 rounded-md p-2 text-center">
                      <div className="text-xs text-gray-500">Month</div>
                      <div className="text-sm font-medium text-blue-700">{stats?.total_users_this_month || 0}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" className="w-full" onClick={onViewAllStudents}>
                  <Users className="mr-2 h-4 w-4" />
                  View All Students
                </Button>
              </CardFooter>
            </Card>

            {/* Revenue Overview */}
            <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Revenue Overview</CardTitle>
                    <CardDescription>Financial performance statistics</CardDescription>
                  </div>
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-green-100 p-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Total Revenue</div>
                      <div className="text-xs text-muted-foreground">All-time earnings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(stats?.total_revenue)}</div>
                    <div className="text-xs text-green-600">
                      {stats?.total_purchases || 0} purchases
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-blue-100 p-2">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Monthly Revenue</div>
                      <div className="text-xs text-muted-foreground">This month's earnings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(stats?.total_revenue_this_month)}</div>
                    <TrendIndicator value={12} className="text-xs justify-end" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-indigo-100 p-2">
                      <CreditCard className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Average Purchase</div>
                      <div className="text-xs text-muted-foreground">Revenue per transaction</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {stats && stats.total_purchases > 0 
                        ? formatCurrency((parseFloat(stats.total_revenue) / stats.total_purchases).toFixed(2))
                        : formatCurrency('0')
                      }
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-dashed">
                  <div className="text-sm font-medium mb-2">Revenue Distribution</div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-100">
                          Weekly
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-emerald-600">
                          {formatCurrency(stats?.total_revenue_this_week)}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-100">
                      <div 
                        style={{ 
                          width: `${stats && parseFloat(stats.total_revenue) > 0 ? 
                            (parseFloat(stats.total_revenue_this_week) / parseFloat(stats.total_revenue)) * 100 : 0}%` 
                        }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                      ></div>
                    </div>
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-100">
                          Monthly
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-emerald-600">
                          {formatCurrency(stats?.total_revenue_this_month)}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-emerald-100">
                      <div 
                        style={{ 
                          width: `${stats && parseFloat(stats.total_revenue) > 0 ? 
                            (parseFloat(stats.total_revenue_this_month) / parseFloat(stats.total_revenue)) * 100 : 0}%` 
                        }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" className="w-full" onClick={onViewAllTransactions}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Financial Reports
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardSection;