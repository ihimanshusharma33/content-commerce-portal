import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t pt-8 pb-4 text-gray-700">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        {/* Logo and Description */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <img src="/assests/images/Logo.png" alt="Amplifilearn Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-primary">Amplifilearn</span>
        </div>
        {/* Contact & Links */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-500">
          <a href="mailto:support@amplifilearn.com" className="hover:text-primary transition">support@amplifilearn.com</a>
          <span className="hidden md:inline-block mx-2">|</span>
          <span>New Delhi, India</span>
          <span className="hidden md:inline-block mx-2">|</span>
          <a href="#" className="hover:text-primary transition">Privacy Policy</a>
          <span className="hidden md:inline-block mx-2">|</span>
          <a href="#" className="hover:text-primary transition">Terms</a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-4">&copy; {currentYear} Amplifilearn. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
