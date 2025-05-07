import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface StudentInfo {
  name: string;
  email: string;
  enrolledSince: string;
}

interface ProfileProps {
  studentInfo: StudentInfo;
}

export const Profile: React.FC<ProfileProps> = ({ studentInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-muted-foreground" />
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="sr-only">Upload avatar</span>
            </button>
          </div>
          <h3 className="text-lg font-semibold">{studentInfo.name}</h3>
          <p className="text-sm text-muted-foreground">{studentInfo.email}</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Profile Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">Bio</label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="w-full rounded-md border border-input px-3 py-2 text-sm min-h-[100px]"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">Location</label>
              <input
                type="text"
                id="location"
                placeholder="Your city/country"
                className="w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Social Profiles</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-1">LinkedIn</label>
              <input
                type="text"
                id="linkedin"
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-foreground mb-1">Twitter</label>
              <input
                type="text"
                id="twitter"
                placeholder="https://twitter.com/username"
                className="w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md">
            Save Profile
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;