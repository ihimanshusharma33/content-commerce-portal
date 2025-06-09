import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { changeStudentPassword } from "@/services/studentService";

const StudentSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    if (!currentPassword || !newPassword) {
      setPasswordMessage("Please fill in all password fields.");
      return;
    }

    setIsUpdating(true);
    try {
      await changeStudentPassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      setPasswordMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage("Failed to update password. Please check your current password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Account Settings */}
      <div>
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive emails about account activity
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Course Updates</p>
              <p className="text-sm text-muted-foreground">
                Get notified when courses you're enrolled in are updated
              </p>
            </div>
            <Switch checked={courseUpdates} onCheckedChange={setCourseUpdates} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Receive promotional offers and new course announcements
              </p>
            </div>
            <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div>
        <h2 className="text-xl font-semibold">Security Settings</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Current Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handlePasswordUpdate}
              disabled={isUpdating}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </button>

            {passwordMessage && (
              <p className={`mt-2 text-sm ${passwordMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {passwordMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default StudentSettings;
