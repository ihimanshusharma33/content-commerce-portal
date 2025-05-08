import { useState } from 'react';

const StudentSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  return (
    <div className="bg-white pt-1 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Account Settings</h2>
      
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <h3 className="text-sm sm:text-base font-medium">Email Notifications</h3>
            <p className="text-xs sm:text-sm text-gray-500">Receive emails about account activity</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="notifications" 
              className="sr-only" 
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
            <div className={`w-11 h-6 rounded-full transition ${
              emailNotifications ? 'bg-primary' : 'bg-gray-200'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
              emailNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <h3 className="text-sm sm:text-base font-medium">Course Updates</h3>
            <p className="text-xs sm:text-sm text-gray-500">Get notified when courses you're enrolled in are updated</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="updates" 
              className="sr-only" 
              checked={courseUpdates}
              onChange={() => setCourseUpdates(!courseUpdates)}
            />
            <div className={`w-11 h-6 rounded-full transition ${
              courseUpdates ? 'bg-primary' : 'bg-gray-200'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
              courseUpdates ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <h3 className="text-sm sm:text-base font-medium">Marketing Emails</h3>
            <p className="text-xs sm:text-sm text-gray-500">Receive promotional offers and new course announcements</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="marketing" 
              className="sr-only" 
              checked={marketingEmails}
              onChange={() => setMarketingEmails(!marketingEmails)}
            />
            <div className={`w-11 h-6 rounded-full transition ${
              marketingEmails ? 'bg-primary' : 'bg-gray-200'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
              marketingEmails ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </div>
        </div>
      </div>
      
      <div className="border-t mt-6 pt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Security Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex-1">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Update Password
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t mt-6 pt-6">
        <h2 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
        </p>
        <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default StudentSettings;