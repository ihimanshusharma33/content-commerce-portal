import { HomeIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <HomeIcon className="h-16 w-16 text-primary mb-4" onClick={() => navigate('/')}/>
                <span className="text-md font-bold text-gray-900">click go to home page</span>
            <p className="text-lg text-gray-700">Welcome to the Admin Dashboard!</p>
            <p className="text-lg text-gray-700">Manage your content and users here.</p>
        </div>
    );
}

export default AdminDashboard;