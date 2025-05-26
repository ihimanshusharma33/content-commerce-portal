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
import { Filter, X } from "lucide-react"; // Import icons
import { Course, Subject } from 'types';
import { fetchCourses, fetchSubjectsByCourse } from '@/services/apiService';

const CourseList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categories, setcategories] = useState<Course[]>([]);
  const [courses, setcourses] = useState<Subject[]>([]);
  const [filteredCourses, setFilteredCourses] = useState(courses);

  
  const user = getCurrentUser();
  const purchasedCourses = user?.purchasedCourses || [];
  

  useEffect(() => {
    fetchCourses()
      .then((data) => setcategories(data))
      .catch((error) => console.error('Failed to fetch courses:', error))
  }, []);

 useEffect(() => {
  if (categories.length > 0) {
    const firstCourseId = categories[0].id;
    fetchSubjectsByCourse(firstCourseId)
      .then((data) => {
        setcourses(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}, [categories]);

  console.log(categories);
console.log(courses);
  // Apply filters
  useEffect(() => {
    // Existing filter logic...
    let result = [...courses];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term)
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(course => selectedCategories.includes(course.category));
    }
    
    // Filter by level
    if (selectedLevels.length > 0) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }
    
    // Filter by price
    if (priceRange === 'free') {
      result = result.filter(course => course.price === 0);
    } else if (priceRange === 'paid') {
      result = result.filter(course => course.price > 0);
    } else if (priceRange === 'under50') {
      result = result.filter(course => course.discountPrice ? course.discountPrice < 50 : course.price < 50);
    }
    
    // Sort courses
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      // In a real app, we would sort by date added
      result = [...result].reverse();
    }
    
    setFilteredCourses(result);
  }, [searchTerm, selectedCategories, selectedLevels, priceRange, sortBy]);
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };
  
  // Existing handler functions...
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceRange('all');
    setSortBy('featured');
    setSearchParams({});
    setFilteredCourses(courses);
    setShowMobileFilters(false); // Close mobile filters when resetting
  };
  
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
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label 
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name} <span className="text-muted-foreground">({category.totalSemesters})</span>
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
      
      <div className="bg-secondary/20 py-8">
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
                Filters {(selectedCategories.length > 0 || selectedLevels.length > 0 || priceRange !== 'all') && (
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {selectedCategories.length + selectedLevels.length + (priceRange !== 'all' ? 1 : 0)}
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
                  Showing <span className="font-medium text-foreground">{filteredCourses.length}</span> results
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
                  Showing <span className="font-medium text-foreground">{filteredCourses.length}</span> results
                </p>
              </div>
              
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isPurchased={purchasedCourses.includes(course.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
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
