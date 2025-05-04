
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-brand-50 to-secondary/30">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="font-extrabold text-4xl sm:text-5xl md:text-5xl lg:text-6xl mb-4 leading-tight animate-fade-up">
              Learn without limits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Start, switch, or advance your career with thousands of courses from expert instructors.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                onClick={() => navigate('/courses')}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              >
                Browse Courses
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                Join for Free
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex -space-x-2 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-brand-${i * 100} flex items-center justify-center`}>
                    <span className="text-xs text-white font-bold">{i}</span>
                  </div>
                ))}
              </div>
              <span>Join over 10,000 learners</span>
            </div>
          </div>
          
          <div className="md:w-1/2 relative animate-fade-in">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/placeholder.svg" 
                alt="Online learning"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-60 rounded-lg"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-5 -right-5 bg-white rounded-lg shadow-lg p-3 transform rotate-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Certificate</p>
                  <p className="text-xs text-gray-500">Earn on completion</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-5 -left-5 bg-white rounded-lg shadow-lg p-3 transform -rotate-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Flexible Learning</p>
                  <p className="text-xs text-gray-500">Learn at your pace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
