import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentInfo {
  name: string;
  email: string;
  enrolledSince: string;
}

interface SettingsProps {
  studentInfo: StudentInfo;
}

export const Settings: React.FC<SettingsProps> = ({ studentInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                defaultValue={studentInfo.name}
                className="w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                id="email"
                defaultValue={studentInfo.email}
                className="w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Notification Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="course-updates" className="block text-sm font-medium">
                  Course Updates
                </label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about course content updates
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="course-updates"
                  defaultChecked={true}
                  className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="promotions" className="block text-sm font-medium">
                  Promotional Emails
                </label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about discounts and special offers
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="promotions"
                  defaultChecked={false}
                  className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md">
            Save Changes
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Settings;