import React from 'react';
import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, Star, CreditCard, Settings, LogOut } from "lucide-react";
import { sidebarItems } from "../data/mockData";

interface MobileMenuProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isMobileMenuOpen: boolean;
    onMobileMenuItemClick: (sectionId: string) => void;
    onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
    activeSection,
    setActiveSection,
    isMobileMenuOpen,
    onMobileMenuItemClick,
    onLogout
}) => {
    // Helper function to get the appropriate icon
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "dashboard":
                return <LayoutDashboard className="h-5 w-5" />;
            case "courses":
                return <BookOpen className="h-5 w-5" />;
            case "students":
                return <Users className="h-5 w-5" />;
            case "reviews":
                return <Star className="h-5 w-5" />;
            case "transactions":
                return <CreditCard className="h-5 w-5" />;
            case "settings":
                return <Settings className="h-5 w-5" />;
            default:
                return <LayoutDashboard className="h-5 w-5" />;
        }
    };

    if (!isMobileMenuOpen) return null;

    return (
        <div className="w-full h-full bg-white border-t p-4 overflow-y-auto">
            <nav className="space-y-2">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onMobileMenuItemClick(item.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-4 pt-4 border-t">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-3">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default MobileMenu;