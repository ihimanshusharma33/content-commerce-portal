import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { courses, getCurrentUser } from '@/lib/data';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, Loader2, X } from "lucide-react"; // Import icons
import { Course, Subject } from 'types';
import { fetchCourses, fetchSubjectsByCourse } from '@/services/apiService';
import apiClient from '@/utils/apiClient';

const CourseList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categories, setcategories] = useState<Course[]>([]);
  const [courses, setcourses] = useState<Subject[]>([]);
  const [detailedCourses, setdetailedCourses] = useState<Subject[]>([]);
  const [filteredDetailedCourses, setFilteredDetailedCourses] = useState<Subject[]>([]);

  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [visibleSubjectCount, setVisibleSubjectCount] = useState(6);
  const [visibleCourseCount, setVisibleCourseCount] = useState(3);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingDetailedCourses, setLoadingDetailedCourses] = useState(true);

  const user = getCurrentUser();
  const purchasedCourses = user?.purchasedCourses || [];

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
              semester: course.semester,
            };
          } else {
            grouped[course.name].allIds.push(course.id);

            if (course.semester < grouped[course.name].minSemester) {
              grouped[course.name].image = course.image;
              grouped[course.name].minSemester = course.semester;
            }
          }
        });

        setcategories(Object.values(grouped));
      })
      .catch((error) => console.error("Failed to fetch courses:", error))
  }, []);


  useEffect(() => {
    setLoadingCourses(true);

    apiClient.get('/courses')
      .then((res) => {
        const detailcourse = res.data.data;

        const mappedCourses = detailcourse.map((courseDetail: any) => ({
          id: courseDetail.course_id,
          title: courseDetail.course_name,
          description: courseDetail.description || '',
          price: courseDetail.price || 0,
          semester: courseDetail.semester,
          discountPrice: courseDetail.discount || 0,
          rating: courseDetail.average_rating || 0,
          image: courseDetail.image,
          reviewCount: courseDetail.total_reviews,
          isExpired:courseDetail.is_expired,
          expiryDaysLeft:courseDetail.expiry_days_left,
          isPurchased:courseDetail.is_purchased
        }));

        setdetailedCourses(mappedCourses);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects:", err);
      })
       .finally(() => setLoadingCourses(false));
      
  }, []);

 

  // console.log(detailedCourses);
  useEffect(() => {
     setLoadingDetailedCourses(true);

    apiClient.get('/subjects')
      .then((res) => {
        const subjects = res.data.data;

        const mappedCourses = subjects.map((sub: any) => ({
          id: sub.subject_id,
          title: sub.subject_name,
          description: sub.description || '',
          category: sub.course_id,
          price: sub.price || 0,
          discountPrice: sub.discount,
          rating: sub.average_rating || 0,
          image: sub.image,
          reviewCount: sub.total_reviews,
          isExpired:sub.is_expired,
          expiryDaysLeft:sub.expiry_days_left,
          isPurchased:sub.is_purchased

        }));

        setcourses(mappedCourses);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects:", err);
      })
      .finally(() => setLoadingDetailedCourses(false));

  }, []);


  useEffect(() => {
    setVisibleSubjectCount(6);
  }, [filteredCourses]);

  useEffect(() => {
    setVisibleCourseCount(3);
  }, [filteredDetailedCourses]);

  // Apply filters
  useEffect(() => {
    // Existing filter logic...
    let result = [...courses];
    let resultCourse = [...detailedCourses];


    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term)
      );
      resultCourse = resultCourse.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term)
      );
    }

    // Filter by categories
    const selectedCatIds = selectedCategories.map(id => Number(id));
    if (selectedCatIds.length > 0) {
      result = result.filter(course => selectedCatIds.includes(course.category));
      resultCourse = resultCourse.filter(course => selectedCatIds.includes(course.id));
    }

    // Filter by price
    if (priceRange === 'free') {
      result = result.filter(course => course.price === 0);
      resultCourse = resultCourse.filter(course => course.price === 0);

    } else if (priceRange === 'paid') {
      result = result.filter(course => course.price > 0);
      resultCourse = resultCourse.filter(course => course.price > 0);

    } else if (priceRange === 'under50') {
      result = result.filter(course => course.discountPrice ? course.discountPrice < 50 : course.price < 50);
      resultCourse = resultCourse.filter(course => course.discountPrice ? course.discountPrice < 50 : course.price < 50);

    }

    // Sort courses
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      resultCourse.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));

    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      resultCourse.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));

    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
      resultCourse.sort((a, b) => b.rating - a.rating);

    } else if (sortBy === 'newest') {
      result = [...result].reverse();
      resultCourse = [...resultCourse].reverse();

    }

    setFilteredCourses(result);
    setFilteredDetailedCourses(resultCourse);

  }, [searchTerm, selectedCategories, priceRange, sortBy, courses, categories, detailedCourses]);

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Existing handler functions...
  const toggleCategory = (ids: number[]) => {
    const alreadySelected = ids.every(id => selectedCategories.includes(id));
    if (alreadySelected) {
      setSelectedCategories(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedCategories(prev => Array.from(new Set([...prev, ...ids])));
    }
  };


  // console.log(courses);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange('all');
    setSortBy('featured');
    setSearchParams({});
    setFilteredCourses(courses);
    setShowMobileFilters(false); // Close mobile filters when resetting
  };

  const isCategorySelected = (ids: number[]) => {
    return ids.every(id => selectedCategories.includes(id));
  };

   if (loadingCourses || loadingDetailedCourses) 
    return <div className="flex justify-center items-center min-h-screen">
  <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
</div>;
  // Render filters content (shared between mobile and desktop)
  const renderFiltersContent = () => (
    <>
      <div className="mb-6">
        <h3 className="font-medium text-lg mb-3">Search</h3>
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">Categories</h3>
          {selectedCategories.length > 0 && (
            <Button
              variant="link"
              className="text-xs p-0 h-auto"
              onClick={() => setSelectedCategories([])}
            >
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={isCategorySelected(category.allIds)}
                onCheckedChange={() => toggleCategory(category.allIds)}

              />

              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name} <span className="text-muted-foreground">({category.allIds.length} Semesters)</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-lg mb-3">Price</h3>
        <RadioGroup value={priceRange} onValueChange={setPriceRange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="price-all" />
            <Label htmlFor="price-all">All Prices</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="price-free" />
            <Label htmlFor="price-free">Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paid" id="price-paid" />
            <Label htmlFor="price-paid">Paid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="under50" id="price-under50" />
            <Label htmlFor="price-under50">Under $50</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={resetFilters}
        variant="outline"
        className="w-full"
      >
        Reset All Filters
      </Button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className=" py-8">
        <div className="container-custom">
          <h1 className="text-xl font-bold mb-2">All Courses</h1>
          <p className="text-muted-foreground">Browse our collection of courses to advance your skills</p>
        </div>
      </div>

      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/4">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {renderFiltersContent()}
                </CardContent>
              </Card>
            </div>

            {/* Mobile Filter Toggle + Sort Controls */}
            <div className="lg:hidden flex justify-between items-center mb-4 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMobileFilters}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters {(selectedCategories.length > 0 || priceRange !== 'all') && (
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {selectedCategories.length + (priceRange !== 'all' ? 1 : 0)}
                  </span>
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <label className="text-sm">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md py-1 px-2 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters Drawer */}
            {showMobileFilters && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={toggleMobileFilters}
                />

                {/* Slide-in panel */}
                <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-50 lg:hidden overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-lg">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={toggleMobileFilters}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-6">
                    {renderFiltersContent()}
                  </div>
                </div>
              </>
            )}

            {/* Course Grid + Desktop Sort Controls */}
            <div className="lg:w-3/4 w-full">
              <div className="hidden lg:flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing Total <span className="font-medium text-foreground"> {filteredCourses.length + filteredDetailedCourses.length} </span> results
                </p>

                <div className="flex items-center space-x-2">
                  <label className="text-sm">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-md py-1 px-2 text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Mobile Results Count */}
              <div className="lg:hidden mb-4">
                
                <p className="text-muted-foreground text-sm">
                  Showing Courses <span className="font-medium text-foreground">{filteredDetailedCourses.length}</span> results
                </p>
              </div>
               <h2 className="text-3xl font-bold text-center mb-8 text-primary">
      Explore Our Courses
    </h2>
              {filteredDetailedCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDetailedCourses.slice(0, visibleCourseCount).map((course) => (
                      <CourseCard
                       isExpired={course.isExpired} 
                       expiryDaysLeft={course.expiryDaysLeft} 
                       key={course.id} 
                       course={course}  
                       isPurchased={course.isPurchased}
                       course_or_subject={"course"}/>
                    ))}
                  </div>

                  {visibleCourseCount < filteredDetailedCourses.length && (
                    <div className="text-center m-6">
                      <Button onClick={() => setVisibleCourseCount(prev => prev + 3)}>
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search term</p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </div>
              )}


              <div className="lg:hidden mb-4">
                <p className="text-muted-foreground text-sm">
                  Showing Subject <span className="font-medium text-foreground">{filteredCourses.length}</span> results
                </p>
              </div>
              <hr/><br/><br/>
               <h2 className="text-3xl font-bold text-center mb-8 text-primary">
      Explore Our Subjects
    </h2>

              {filteredCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.slice(0, visibleSubjectCount).map((course) => (
                      <CourseCard
                        key={course.id}
                        isExpired={course.isExpired} 
                        expiryDaysLeft={course.expiryDaysLeft}
                        course={course}
                        isPurchased={course.isPurchased}
                        course_or_subject={"subject"}
                      />
                    ))}
                  </div>
                  {visibleSubjectCount < filteredCourses.length && (
                    <div className="text-center mt-6">
                      <Button onClick={() => setVisibleSubjectCount(prev => prev + 6)}>
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No Subjects found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search term</p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </div>
              )}
            </div>

          </div>


        </div>

      </main>

      <Footer />
    </div>
  );
};

export default CourseList;
