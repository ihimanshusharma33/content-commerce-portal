import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchSubjectsByCourse, createSubject, updateSubject, deleteSubject, Subject, getCourseDetails, CourseDetails } from "../../../services/apiService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, Pencil, Trash2, BookOpen, Loader2, Search, 
  ArrowLeft, DollarSign, PercentIcon, FileText 
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SubjectManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form fields
  const [subjectName, setSubjectName] = useState("");
  const [semester, setSemester] = useState<number | string>(1);
  const [resourceLink, setResourceLink] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [discount, setDiscount] = useState<number | string>("");
  const [subjectImage, setSubjectImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch subjects for the selected course
  useEffect(() => {
    if (!courseId) {
      navigate("/admin/courses");
      return;
    }

    setLoading(true);

    // Fetch both course details and subjects
    Promise.all([
      getCourseDetails(parseInt(courseId)),
      fetchSubjectsByCourse(parseInt(courseId))
    ])
      .then(([courseData, subjectsData]) => {
        setCourseDetails(courseData);
        setSubjects(subjectsData);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        // Show error notification
      })
      .finally(() => setLoading(false));
  }, [courseId, navigate]);

  const handleAddOrUpdateSubject = () => {
    if (!subjectName || !courseId) {
      alert("Please fill all required fields");
      return;
    }

    setSaving(true);

    const subjectData: Partial<Subject> = {
      name: subjectName,
      courseId: parseInt(courseId),
      semester: typeof semester === 'string' ? parseInt(semester) : semester,
      resourceLink: resourceLink || null,
      price: price || null,
      discount: discount || null,
      image: subjectImage || undefined
    };

    if (selectedSubject) {
      // Update subject
      updateSubject(selectedSubject.id, subjectData)
        .then((updatedSubject) => {
          setSubjects((prev) => prev.map((subject) => 
            subject.id === updatedSubject.id ? updatedSubject : subject
          ));
          closeForm();
        })
        .catch((error) => console.error("Failed to update subject:", error))
        .finally(() => setSaving(false));
    } else {
      // Add new subject
      createSubject(subjectData)
        .then((newSubject) => {
          setSubjects((prev) => [...prev, newSubject]);
          closeForm();
        })
        .catch((error) => console.error("Failed to create subject:", error))
        .finally(() => setSaving(false));
    }
  };

  const handleDeleteSubject = (id: number) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setSaving(true);
      deleteSubject(id)
        .then(() => {
          setSubjects((prev) => prev.filter((subject) => subject.id !== id));
        })
        .catch((error) => console.error("Failed to delete subject:", error))
        .finally(() => setSaving(false));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubjectImage(e.target.files[0]);
    }
  };

  const openForm = (subject?: Subject) => {
    if (subject) {
      setSelectedSubject(subject);
      setSubjectName(subject.name);
      setSemester(subject.semester || 1);
      setResourceLink(subject.resourceLink || "");
      setPrice(subject.price || "");
      setDiscount(subject.discount || "");
      setSubjectImage(null); // Reset image when editing
    } else {
      setSelectedSubject(null);
      setSubjectName("");
      setSemester(1);
      setResourceLink("");
      setPrice("");
      setDiscount("");
      setSubjectImage(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedSubject(null);
    setSubjectName("");
    setSemester(1);
    setResourceLink("");
    setPrice("");
    setDiscount("");
    setSubjectImage(null);
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

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a placeholder image when no subject image is available
  const getPlaceholderImage = (subjectName: string) => {
    const colors = [
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500'
    ];
    const colorIndex = subjectName.length % colors.length;
    const initials = subjectName.substring(0, 2).toUpperCase();

    return (
      <div className={`w-full h-32 ${colors[colorIndex]} flex items-center justify-center rounded-t-lg`}>
        <span className="text-white text-3xl font-bold">{initials}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate("/admin/courses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{courseDetails?.name || "Course Subjects"}</h1>
            <p className="text-gray-500">
              {courseDetails?.totalSubjects || subjects.length} subject(s) • {courseDetails?.semester} semester
            </p>
          </div>
        </div>
        <div className="flex mt-2 justify-between gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-60"
            />
          </div>
          <Button onClick={() => openForm()} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Loader for fetching subjects */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading subjects...</span>
        </div>
      ) : (
        <>
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No subjects found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                {searchTerm
                  ? "No subjects match your search criteria. Try a different search term."
                  : "This course doesn't have any subjects yet. Get started by adding your first subject."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => openForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Subject
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <Card key={subject.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Subject image or placeholder with price badge */}
                  <div className="relative">
                    {subject.image ? (
                      <div className="h-32 w-full overflow-hidden">
                        <img
                          src={subject.image}
                          alt={subject.name}
                          className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </div>
                    ) : (
                      getPlaceholderImage(subject.name)
                    )}
                    
                    {/* Price tag in top right corner */}
                    {subject.price && (
                      <div className="absolute top-3 right-3 bg-white rounded-md shadow-sm px-2 py-1 text-sm font-semibold">
                        {formatPrice(subject.price)}
                      </div>
                    )}
                    
                    {/* Discount tag in top left if applicable */}
                    {subject.discount && Number(subject.discount) > 0 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white rounded-md px-2 py-1 text-sm font-medium">
                        {subject.discount}% OFF
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg line-clamp-1">{subject.name}</h3>
                      {subject.resourceLink && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                          <FileText className="h-3 w-3 mr-1" />
                          Resource
                        </Badge>
                      )}
                    </div>
                    
                    {/* Price and discount display */}
                    {subject.price ? (
                      <div className="mt-3 flex items-center">
                        {subject.discount && Number(subject.discount) > 0 ? (
                          <>
                            <span className="text-lg font-bold text-blue-700">
                              {formatPrice(calculateDiscountedPrice(subject.price, subject.discount))}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(subject.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-blue-700">
                            {formatPrice(subject.price)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <span className="text-lg font-bold text-green-600">Free</span>
                      </div>
                    )}
                    
                    {/* Created/Updated date info */}
                    <p className="text-xs text-gray-500 mt-2">
                      {subject.createdAt && `Added ${new Date(subject.createdAt).toLocaleDateString()}`}
                    </p>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openForm(subject)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={() => handleDeleteSubject(subject.id)}
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

      {/* Add/Edit Subject Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold mb-4">
              {selectedSubject ? "Edit Subject" : "Add New Subject"}
            </h4>
            <Separator className="mb-5" />
            <div className="space-y-4">
              <div>
                <Label htmlFor="subjectName">Subject Name <span className="text-red-500">*</span></Label>
                <Input
                  id="subjectName"
                  type="text"
                  placeholder="Enter subject name"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  placeholder="Enter semester number"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="resourceLink">Resource Link</Label>
                <Input
                  id="resourceLink"
                  type="text"
                  placeholder="Enter resource link (optional)"
                  value={resourceLink}
                  onChange={(e) => setResourceLink(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Link to external resources or materials for this subject</p>
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
                    placeholder="Enter subject price (0 for free)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty or set to 0 for free subjects</p>
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
                <Label htmlFor="subjectImage">Subject Image (Optional)</Label>
                <Input
                  id="subjectImage"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
                {subjectImage && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-md">
                    <p className="text-sm text-green-700 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Image selected: {subjectImage.name}
                    </p>
                  </div>
                )}
                {selectedSubject?.image && !subjectImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Current image:</p>
                    <div className="relative group">
                      <img
                        src={selectedSubject.image}
                        alt={selectedSubject.name}
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
                  onClick={handleAddOrUpdateSubject}
                  disabled={saving || !subjectName}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {selectedSubject ? "Updating..." : "Adding..."}
                    </>
                  ) : selectedSubject ? (
                    "Update Subject"
                  ) : (
                    "Add Subject"
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

export default SubjectManager;