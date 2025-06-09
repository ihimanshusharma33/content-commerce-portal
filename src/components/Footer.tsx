import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t pt-8 pb-4 text-gray-700">
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
      <div className="text-center text-xs text-gray-400 mt-4">&copy; {currentYear} Amplifilearn. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
