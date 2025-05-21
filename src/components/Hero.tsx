
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-4  bg-gradient-to-br from-brand-50 to-secondary/30">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="font-extrabold text-4xl sm:text-5xl md:text-5xl lg:text-6xl mb-4 leading-tight animate-fade-up">
              Learn without limits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Instantly access expert PDF resources, anytime, anywhere.
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
                Join Now
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
          <div className="md:w-1/2 relative">
            <div className="rounded-lg overflow-hidden  relative">
              <img
                src="/assests/images/Hero.png"
                alt="Online learning"
                className="w-full h-auto object-cover max-h-[500px] md:max-h-[600px]"
              />
              <div className="absolute inset-0 to-transparent opacity-60 rounded-lg"></div>
            </div>

            {/* Optional decorative element */}
            <div className="hidden md:block absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-lg bg-secondary/20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
