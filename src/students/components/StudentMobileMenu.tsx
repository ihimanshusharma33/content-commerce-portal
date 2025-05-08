import React from 'react';
import { Link } from "react-router-dom";
import { User, BookOpen, Star, CreditCard, Settings, LogOut, X } from "lucide-react";
import { studentSidebarItems } from "./StudentSidebar";

interface StudentMobileMenuProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isMobileMenuOpen: boolean;
    onMobileMenuItemClick: (sectionId: string) => void;
    onLogout: () => void;
    onClose: () => void; // Add new prop for closing menu
}

const StudentMobileMenu: React.FC<StudentMobileMenuProps> = ({
    activeSection,
    setActiveSection,
    isMobileMenuOpen,
    onMobileMenuItemClick,
    onLogout,
    onClose // Add prop
}) => {
    // Helper function to get the appropriate icon
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "profile":
                return <User className="h-5 w-5" />;
            case "my-courses":
                return <BookOpen className="h-5 w-5" />;
            case "reviews":
                return <Star className="h-5 w-5" />;
            case "payment-history":
                return <CreditCard className="h-5 w-5" />;
            case "settings":
                return <Settings className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
        }
    };

    if (!isMobileMenuOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden">
            <div className="w-full h-full bg-white border-r shadow-lg overflow-y-auto absolute left-0">
                <div className="flex justify-between p-4 border-b">
                    <h2 className="font-bold text-lg">Student Portal</h2>
                    <X 
                        className='h-6 w-6 cursor-pointer' 
                        onClick={onClose} // Use the dedicated close handler
                    />
                </div>
                <nav className="p-4 space-y-2">
                    {studentSidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onMobileMenuItemClick(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                activeSection === item.id
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 pt-4 border-t absolute bottom-0 w-full">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="ml-3">Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentMobileMenu;