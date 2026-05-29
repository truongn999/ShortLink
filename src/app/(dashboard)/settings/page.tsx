'use client';

import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Key, 
  Plug, 
  Settings as SettingsIcon, 
  AlertTriangle,
  Camera,
  CheckCircle,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  Copy
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import PageHeader from '@/components/layout/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function Settings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'advanced', label: 'Advanced', icon: SettingsIcon },
  ];

  const Toggle = ({ checked = false, onChange }: { checked?: boolean, onChange?: () => void }) => (
    <button 
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-900 transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader 
        title="Settings" 
        description="Quản lý cài đặt tài khoản và ứng dụng của bạn"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 sticky top-8 transition-colors">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" style={{strokeWidth: 1.5}} />
                  {item.label}
                </button>
              ))}
              <hr className="my-2 border-neutral-200 dark:border-neutral-700" />
              <button
                 onClick={() => setActiveSection('danger')}
                 className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                   activeSection === 'danger' 
                     ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                     : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                 }`}
              >
                  <AlertTriangle className="w-4 h-4" style={{strokeWidth: 1.5}} />
                  Danger Zone
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
           {/* Profile Section */}
           {activeSection === 'profile' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-6">
                       <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Profile Settings</h2>
                       <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Quản lý thông tin cá nhân và hiển thị hồ sơ</p>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                       <div className="p-6">
                           <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Thông tin cá nhân</h3>

                           <div className="flex items-center gap-6 mb-6">
                               <div className="relative">
                                   {/* eslint-disable-next-line @next/next/no-img-element */}
                                   <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop" className="w-20 h-20 rounded-full" alt="Profile" />
                                   <button className="absolute bottom-0 right-0 w-7 h-7 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                                       <Camera className="w-3 h-3" style={{strokeWidth: 2}} />
                                   </button>
                               </div>
                               <div>
                                   <div className="font-medium text-neutral-900 dark:text-white">Ảnh đại diện</div>
                                   <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">JPG, GIF or PNG. Max size of 800K</div>
                               </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Họ và tên</label>
                                   <input type="text" defaultValue={user?.user_metadata?.full_name || "Nguyen Van A"} className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Email</label>
                                   <input type="email" defaultValue={user?.email || "nguyen@example.com"} disabled className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-md cursor-not-allowed" />
                               </div>
                               <div className="md:col-span-2">
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Bio</label>
                                   <textarea rows={3} className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" placeholder="Tell us about yourself..."></textarea>
                               </div>
                           </div>
                       </div>
                       <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 rounded-b-lg flex justify-end">
                           <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium">Lưu thay đổi</button>
                       </div>
                   </div>
               </div>
           )}

           {/* Account Security Section */}
           {activeSection === 'account' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-6">
                       <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Account Security</h2>
                       <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Manage your password and security settings</p>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6">
                       <div className="p-6">
                           <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Đổi mật khẩu</h3>
                           <div className="space-y-4 max-w-md">
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Mật khẩu hiện tại</label>
                                   <input type="password" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Mật khẩu mới</label>
                                   <input type="password" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Xác nhận mật khẩu mới</label>
                                   <input type="password" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                           </div>
                       </div>
                       <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 rounded-b-lg flex justify-end">
                           <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium">Cập nhật mật khẩu</button>
                       </div>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6">
                       <div className="p-6">
                           <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                           <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Add an extra layer of security to your account by enabling two-factor authentication (2FA).</p>
                           
                           <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                               <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                       <Shield className="w-5 h-5" />
                                   </div>
                                   <div>
                                       <div className="font-medium text-neutral-900 dark:text-white">2FA is currently disabled</div>
                                       <div className="text-sm text-neutral-500 dark:text-neutral-400">Protect your account with an authenticator app</div>
                                   </div>
                               </div>
                               <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium">Enable 2FA</button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {/* Notifications Section */}
           {activeSection === 'notifications' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-6">
                       <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Notifications</h2>
                       <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Manage how you receive notifications</p>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6">
                       <div className="p-6 space-y-6">
                           <div className="flex items-center justify-between">
                               <div>
                                   <div className="font-medium text-neutral-900 dark:text-white">Email Notifications</div>
                                   <div className="text-sm text-neutral-500 dark:text-neutral-400">Receive emails about your account activity</div>
                               </div>
                               <Toggle checked={true} />
                           </div>
                           <div className="flex items-center justify-between">
                               <div>
                                   <div className="font-medium text-neutral-900 dark:text-white">Marketing Emails</div>
                                   <div className="text-sm text-neutral-500 dark:text-neutral-400">Receive emails about new features and promotions</div>
                               </div>
                               <Toggle checked={false} />
                           </div>
                           <div className="flex items-center justify-between">
                               <div>
                                   <div className="font-medium text-neutral-900 dark:text-white">Security Alerts</div>
                                   <div className="text-sm text-neutral-500 dark:text-neutral-400">Receive emails about suspicious activity</div>
                               </div>
                               <Toggle checked={true} />
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {/* Danger Zone */}
           {activeSection === 'danger' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-6">
                       <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                       <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Irreversible actions for your account</p>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-red-200 dark:border-red-900/50 rounded-lg mb-6">
                       <div className="p-6">
                           <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Delete Account</h3>
                           <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">Permanently delete your account and all of your content. This action cannot be undone.</p>
                           
                           <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
                               <div>
                                   <div className="text-sm font-medium text-red-900 dark:text-red-200">Delete Account</div>
                                   <div className="text-xs text-red-700 dark:text-red-300">Permanently delete your account and all data</div>
                               </div>
                               <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium">Delete Account</button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {/* Placeholder for other sections */}
           {['subscription', 'api', 'integrations', 'advanced'].includes(activeSection) && (
               <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                   <SettingsIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4" />
                   <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Coming Soon</h3>
                   <p className="text-neutral-500 dark:text-neutral-400 mt-1">This section is under development.</p>
               </div>
           )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account" maxWidth="max-w-md">
          <div className="mb-4">
              <div className="text-sm text-neutral-900 dark:text-white mb-2">Are you sure you want to delete your account?</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">This action cannot be undone. All your data, links, and analytics will be permanently deleted.</div>
          </div>

          <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Type &quot;DELETE&quot; to confirm</label>
              <input type="text" placeholder="DELETE" className="w-full px-4 py-2 border border-red-300 dark:border-red-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>

          <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Password</label>
              <input type="password" placeholder="Enter your password" className="w-full px-4 py-2 border border-red-300 dark:border-red-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium">Delete Account</button>
          </div>
      </Modal>
    </div>
  );
}
