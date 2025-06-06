import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { fetchCourses, createCourse, updateCourse, deleteCourse } from "../../../services/apiService";
import { Course } from "../../../services/apiService"; // Import directly from apiService
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, BookOpen, Loader2, Search, DollarSign, PercentIcon, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form fields
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState<number | string>(1);
  const [courseImage, setCourseImage] = useState<File | null>(null);
  // Fields for price and discount
  const [price, setPrice] = useState<number | string>("");
  const [discount, setDiscount] = useState<number | string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch courses on component mount
  useEffect(() => {
    setLoading(true);
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error("Failed to fetch courses:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleAddOrUpdateCourse = () => {
    if (!courseName || !description || !semester) {
      alert("Please fill all required fields");
      return;
    }

    setSaving(true);

    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append("course_name", courseName);
    formData.append("description", description);
    formData.append("semester", semester.toString());
    
    // Add price and discount if provided
    if (price !== "") {
      formData.append("price", price.toString());
    }
    
    if (discount !== "") {
      formData.append("discount", discount.toString());
    }

    // Add image if selected
    if (courseImage) {
      formData.append("image", courseImage);
    }

    if (selectedCourse) {
      // Update course
      updateCourse(selectedCourse.id, formData)
        .then((updatedCourse) => {
          setCourses((prev) =>
            prev.map((course) => (course.id === updatedCourse.id ? {
              ...updatedCourse,
              averageRating: course.averageRating,
              totalReviews: course.totalReviews
            } : course))
          );
          closeForm();
        })
        .catch((error) => console.error("Failed to update course:", error))
        .finally(() => setSaving(false));
    } else {
      // Add new course
      createCourse(formData)
        .then((newCourse) => {
          setCourses((prev) => [...prev, {...newCourse, averageRating: "0", totalReviews: 0}]);
          closeForm();
        })
        .catch((error) => console.error("Failed to create course:", error))
        .finally(() => setSaving(false));
    }
  };

  const handleDeleteCourse = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setSaving(true);
      deleteCourse(id)
        .then(() => {
          setCourses((prev) => prev.filter((course) => course.id !== id));
        })
        .catch((error) => console.error("Failed to delete course:", error))
        .finally(() => setSaving(false));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCourseImage(e.target.files[0]);
    }
  };

  const openForm = (course?: Course) => {
    if (course) {
      setSelectedCourse(course);
      setCourseName(course.name);
      setDescription(course.description || "");
      setSemester(course.semester || 1);
      setCourseImage(null); // Reset image when editing
      setPrice(course.price || "");
      setDiscount(course.discount || "");
    } else {
      setSelectedCourse(null);
      setCourseName("");
      setDescription("");
      setSemester(1);
      setCourseImage(null);
      setPrice("");
      setDiscount("");
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedCourse(null);
    setCourseName("");
    setDescription("");
    setSemester(1);
    setCourseImage(null);
    setPrice("");
    setDiscount("");
    setIsFormOpen(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format price display
  const formatPrice = (price: number | string | undefined): string => {
    if (!price) return "Free";
    return `₹${Number(price).toFixed(2)}`;
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number | string | undefined, discount: number | string | undefined): number | null => {
    if (!price) return null;
    if (!discount) return Number(price);
    
    const priceNum = Number(price);
    const discountNum = Number(discount);
    
    return priceNum - (priceNum * (discountNum / 100));
  };

  // Render star rating
  const renderStarRating = (rating: string | undefined) => {
    if (!rating) return null;
    
    const ratingValue = parseFloat(rating);
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue - fullStars >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            // Full star
            return (
              <Star 
                key={i} 
                className="h-4 w-4 fill-yellow-400 text-yellow-400" 
              />
            );
          } else if (i === fullStars && hasHalfStar) {
            // Half star (using CSS for half fill)
            return (
              <div key={i} className="relative">
                <Star className="h-4 w-4 text-gray-300" />
                <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            );
          } else {
            // Empty star
            return (
              <Star 
                key={i} 
                className="h-4 w-4 text-gray-300" 
              />
            );
          }
        })}
      </div>
    );
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Generate a placeholder image when no course image is available
  const getPlaceholderImage = (courseName: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const colorIndex = courseName.length % colors.length;
    const initials = courseName.substring(0, 2).toUpperCase();

    return (
      <div className={`w-full h-40 ${colors[colorIndex]} flex items-center justify-center rounded-t-lg`}>
        <span className="text-white text-4xl font-bold">{initials}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex mt-2 justify-between gap-2 w-full md:w-full">
          <div className="relative  w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div>
            <Button onClick={() => openForm()} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>
      </div>

      {/* Loader for fetching courses */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      ) : (
        <>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                {searchTerm
                  ? "No courses match your search criteria. Try a different search term."
                  : "You haven't created any courses yet. Get started by adding your first course."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => openForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Course
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Course image or placeholder with price badge */}
                  <div className="relative">
                    {course.image ? (
                      <div className="h-auto mt-2  w-full overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="h-full w-full object-fit transition-transform hover:scale-105 duration-300"
                        />
                      </div>
                    ) : (
                      getPlaceholderImage(course.name)
                    )}
                    
                    {/* Price tag in top right corner */}
                    {course.price && (
                      <div className="absolute top-3 right-3 bg-white rounded-md shadow-sm px-2 py-1 text-sm font-semibold">
                        {formatPrice(course.price)}
                      </div>
                    )}
                    
                    {/* Discount tag in top left if applicable */}
                    {course.discount && Number(course.discount) > 0 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white rounded-md px-2 py-1 text-sm font-medium">
                        {course.discount}% OFF
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg line-clamp-1">{course.name}</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {course.semester} {Number(course.semester) === 1 ? 'Semester' : 'Semesters'}
                      </Badge>
                    </div>
                    
                    {/* Rating information */}
                    <div className="mt-1.5 flex items-center gap-2">
                      {renderStarRating(course.averageRating)}
                      <span className="text-sm text-gray-600">
                        {course.averageRating ? parseFloat(course.averageRating).toFixed(1) : '0'} 
                        {course.totalReviews ? ` (${course.totalReviews} ${course.totalReviews === 1 ? 'review' : 'reviews'})` : ''}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-2 text-sm line-clamp-3 h-14">
                      {course.description || "No description available"}
                    </p>
                    
                    {/* Price and discount display */}
                    {course.price ? (
                      <div className="mt-3 flex items-center">
                        {course.discount && Number(course.discount) > 0 ? (
                          <>
                            <span className="text-lg font-bold text-blue-700">
                              {formatPrice(calculateDiscountedPrice(course.price, course.discount))}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(course.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-blue-700">
                            {formatPrice(course.price)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <span className="text-lg font-bold text-green-600">Free</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openForm(course)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Course Modal - Form content remains the same */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold mb-4">
              {selectedCourse ? "Edit Course" : "Add New Course"}
            </h4>
            <Separator className="mb-5" />
            <div className="space-y-4">
              <div>
                <Label htmlFor="courseName">Course Name <span className="text-red-500">*</span></Label>
                <Input
                  id="courseName"
                  type="text"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Enter course description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="semester">Semesters <span className="text-red-500">*</span></Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  placeholder="Enter number of semesters"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              {/* Price field */}
              <div>
                <Label htmlFor="price" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-600" /> 
                  Price
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter course price (0 for free)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty or set to 0 for free courses</p>
              </div>
              
              {/* Discount field */}
              <div>
                <Label htmlFor="discount" className="flex items-center">
                  <PercentIcon className="h-4 w-4 mr-1 text-gray-600" />
                  Discount Percentage
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter discount percentage"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="pr-7"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty for no discount</p>
              </div>

              <div>
                <Label htmlFor="courseImage">Course Image</Label>
                <Input
                  id="courseImage"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
                {courseImage && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-md">
                    <p className="text-sm text-green-700 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Image selected: {courseImage.name}
                    </p>
                  </div>
                )}
                {selectedCourse?.image && !courseImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Current image:</p>
                    <div className="relative group">
                      <img
                        src={selectedCourse.image}
                        alt={selectedCourse.name}
                        className="h-24 w-auto object-cover rounded-md border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-md">
                        <p className="text-white text-xs">Current image will be kept if no new image is selected</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price preview */}
              {price && (
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Price Preview</p>
                  <div className="flex items-center mt-2">
                    {discount && Number(discount) > 0 ? (
                      <>
                        <span className="text-lg font-bold text-blue-700">
                          {formatPrice(calculateDiscountedPrice(price, discount))}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(price)}
                        </span>
                        <Badge className="ml-3 bg-red-100 text-red-800 hover:bg-red-200">
                          {discount}% OFF
                        </Badge>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-blue-700">
                        {formatPrice(price)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleAddOrUpdateCourse}
                  disabled={saving || !courseName || !description || !semester}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {selectedCourse ? "Updating..." : "Adding..."}
                    </>
                  ) : selectedCourse ? (
                    "Update Course"
                  ) : (
                    "Add Course"
                  )}
                </Button>
                <Button variant="outline" onClick={closeForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;