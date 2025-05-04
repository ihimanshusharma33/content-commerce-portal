
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedCourses from '@/components/FeaturedCourses';
import CourseCategories from '@/components/CourseCategories';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { checkAuth } from '@/lib/data';

const Index = () => {
  useEffect(() => {
    // Check if user was previously logged in
    checkAuth();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CourseCategories />
        <FeaturedCourses />
        {/* More sections can be added here */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
