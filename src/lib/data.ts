
// Sample data for our course application

export interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  image: string;
  featured?: boolean;
  bestseller?: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content?: string;
  isFree?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
}

export const categories: Category[] = [
  {
    id: "web-dev",
    name: "Web Development",
    count: 5,
    image: "/placeholder.svg"
  },
  {
    id: "data-science",
    name: "Data Science",
    count: 3,
    image: "/placeholder.svg"
  },
  {
    id: "mobile-dev",
    name: "Mobile Development",
    count: 2,
    image: "/placeholder.svg"
  },
  {
    id: "design",
    name: "Design",
    count: 4,
    image: "/placeholder.svg"
  },
  {
    id: "business",
    name: "Business",
    count: 3,
    image: "/placeholder.svg"
  },
  {
    id: "marketing",
    name: "Marketing",
    count: 2,
    image: "/placeholder.svg"
  }
];

export const courses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    description: "Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, and Node.js to help you become a full-stack web developer.",
    price: 99.99,
    discountPrice: 79.99,
    rating: 4.8,
    reviewCount: 2547,
    category: "web-dev",
    level: "All Levels",
    duration: "52 hours",
    image: "/placeholder.svg",
    featured: true,
    bestseller: true,
    lessons: [
      { id: "1-1", title: "Introduction to Web Development", duration: "15 min", isFree: true },
      { id: "1-2", title: "HTML Fundamentals", duration: "1 hour", isFree: true },
      { id: "1-3", title: "CSS Styling Basics", duration: "1.5 hours" },
      { id: "1-4", title: "JavaScript Essentials", duration: "2 hours" },
      { id: "1-5", title: "Building Your First Website", duration: "3 hours" }
    ]
  },
  {
    id: "2",
    title: "Data Science Fundamentals with Python",
    instructor: "Michael Chen",
    description: "Master the basics of data science using Python. Learn data analysis, visualization, and machine learning techniques to derive insights from complex datasets.",
    price: 89.99,
    rating: 4.7,
    reviewCount: 1823,
    category: "data-science",
    level: "Beginner",
    duration: "40 hours",
    image: "/placeholder.svg",
    featured: true,
    lessons: [
      { id: "2-1", title: "Introduction to Data Science", duration: "20 min", isFree: true },
      { id: "2-2", title: "Python Programming Basics", duration: "2 hours" },
      { id: "2-3", title: "Data Manipulation with Pandas", duration: "2.5 hours" },
      { id: "2-4", title: "Data Visualization", duration: "2 hours" },
      { id: "2-5", title: "Introduction to Machine Learning", duration: "3 hours" }
    ]
  },
  {
    id: "3",
    title: "Mobile App Development with React Native",
    instructor: "Alex Rodriguez",
    description: "Build cross-platform mobile applications using React Native. Create iOS and Android apps with a single codebase and deploy to app stores.",
    price: 79.99,
    rating: 4.5,
    reviewCount: 952,
    category: "mobile-dev",
    level: "Intermediate",
    duration: "38 hours",
    image: "/placeholder.svg",
    bestseller: true,
    lessons: [
      { id: "3-1", title: "Introduction to React Native", duration: "25 min", isFree: true },
      { id: "3-2", title: "Setting Up Your Development Environment", duration: "1 hour" },
      { id: "3-3", title: "Components and Styling", duration: "2 hours" },
      { id: "3-4", title: "Navigation and Routing", duration: "1.5 hours" },
      { id: "3-5", title: "Building Your First Mobile App", duration: "4 hours" }
    ]
  },
  {
    id: "4",
    title: "UI/UX Design Masterclass",
    instructor: "Emma Thompson",
    description: "Learn the principles of user interface and user experience design. Create stunning, user-friendly designs for web and mobile applications.",
    price: 69.99,
    discountPrice: 49.99,
    rating: 4.9,
    reviewCount: 1205,
    category: "design",
    level: "All Levels",
    duration: "30 hours",
    image: "/placeholder.svg",
    featured: true,
    lessons: [
      { id: "4-1", title: "Design Principles and Theory", duration: "1 hour", isFree: true },
      { id: "4-2", title: "User Research Methods", duration: "1.5 hours" },
      { id: "4-3", title: "Wireframing and Prototyping", duration: "2 hours" },
      { id: "4-4", title: "Visual Design Fundamentals", duration: "2.5 hours" },
      { id: "4-5", title: "Design Systems and Components", duration: "2 hours" }
    ]
  },
  {
    id: "5",
    title: "Advanced JavaScript: From Fundamentals to Functional JS",
    instructor: "David Miller",
    description: "Take your JavaScript skills to the next level. Learn advanced concepts like closures, prototypes, async programming, and functional programming techniques.",
    price: 59.99,
    rating: 4.6,
    reviewCount: 892,
    category: "web-dev",
    level: "Advanced",
    duration: "25 hours",
    image: "/placeholder.svg",
    lessons: [
      { id: "5-1", title: "JavaScript Deep Dive", duration: "30 min", isFree: true },
      { id: "5-2", title: "Closures and Scope", duration: "1.5 hours" },
      { id: "5-3", title: "Prototypes and Inheritance", duration: "2 hours" },
      { id: "5-4", title: "Asynchronous JavaScript", duration: "3 hours" },
      { id: "5-5", title: "Functional Programming", duration: "2.5 hours" }
    ]
  },
  {
    id: "6",
    title: "Digital Marketing Fundamentals",
    instructor: "Lisa Crawford",
    description: "Learn essential digital marketing skills including SEO, social media marketing, email campaigns, content strategy, and analytics.",
    price: 69.99,
    discountPrice: 59.99,
    rating: 4.7,
    reviewCount: 1563,
    category: "marketing",
    level: "Beginner",
    duration: "28 hours",
    image: "/placeholder.svg",
    bestseller: true,
    lessons: [
      { id: "6-1", title: "Introduction to Digital Marketing", duration: "20 min", isFree: true },
      { id: "6-2", title: "Search Engine Optimization", duration: "2 hours" },
      { id: "6-3", title: "Social Media Marketing", duration: "2.5 hours" },
      { id: "6-4", title: "Email Marketing Campaigns", duration: "1.5 hours" },
      { id: "6-5", title: "Analytics and Reporting", duration: "2 hours" }
    ]
  }
];

// Simulated user state - in a real app, this would come from authentication
export interface User {
  id: string;
  name: string;
  email: string;
  purchasedCourses: string[];
}

export const sampleUser: User = {
  id: "user1",
  name: "Sample User",
  email: "user@example.com",
  purchasedCourses: ["1", "4"]
};

// User authentication state management
let currentUser: User | null = null;

export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const loginUser = (email: string, password: string): User | null => {
  // In a real app, this would validate against a backend
  if (email === "user@example.com" && password === "password") {
    currentUser = sampleUser;
    localStorage.setItem("isLoggedIn", "true");
    return currentUser;
  }
  return null;
};

export const signupUser = (name: string, email: string, password: string): User | null => {
  // In a real app, this would create a new user in the backend
  currentUser = {
    id: `user${Date.now()}`,
    name,
    email,
    purchasedCourses: []
  };
  localStorage.setItem("isLoggedIn", "true");
  return currentUser;
};

export const logoutUser = (): void => {
  currentUser = null;
  localStorage.removeItem("isLoggedIn");
};

export const purchaseCourse = (courseId: string): void => {
  if (currentUser) {
    if (!currentUser.purchasedCourses.includes(courseId)) {
      currentUser.purchasedCourses.push(courseId);
    }
  }
};

// Auto-login from localStorage if previously logged in
export const checkAuth = (): void => {
  if (localStorage.getItem("isLoggedIn") === "true" && !currentUser) {
    currentUser = sampleUser;
  }
};
