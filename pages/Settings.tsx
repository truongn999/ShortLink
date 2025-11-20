
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
import Modal from '../components/Modal';

const Settings: React.FC = () => {
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

  const Toggle = ({ checked = false }) => (
    <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-900 transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                   <div className="mb-8">
                       <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Profile Settings</h1>
                       <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Manage your personal information and profile visibility</p>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                       <div className="p-6">
                           <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Profile Information</h3>

                           <div className="flex items-center gap-6 mb-6">
                               <div className="relative">
                                   <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop" className="w-20 h-20 rounded-full" alt="Profile" />
                                   <button className="absolute bottom-0 right-0 w-7 h-7 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                                       <Camera className="w-3 h-3" style={{strokeWidth: 2}} />
                                   </button>
                               </div>
                               <div>
                                   <h4 className="text-lg font-medium text-neutral-900 dark:text-white">Nguyễn Văn A</h4>
                                   <p className="text-sm text-neutral-500 dark:text-neutral-400">Member since January 2024</p>
                                   <div className="flex items-center gap-2 mt-2">
                                       <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">Pro Plan</span>
                                       <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">Verified</span>
                                   </div>
                               </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">First Name</label>
                                   <input type="text" defaultValue="Nguyễn" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Last Name</label>
                                   <input type="text" defaultValue="Văn A" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Email Address</label>
                                   <input type="email" defaultValue="nguyenvana@example.com" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Phone Number</label>
                                   <input type="tel" defaultValue="+84 123 456 789" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                               <div className="md:col-span-2">
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Bio</label>
                                   <textarea rows={3} className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" placeholder="Tell us about yourself..." defaultValue="Affiliate marketer focused on electronics and fashion products. 5+ years of experience in e-commerce."></textarea>
                               </div>
                               <div className="md:col-span-2">
                                   <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Website/Social Media</label>
                                   <input type="url" placeholder="https://yourwebsite.com" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                               </div>
                           </div>

                           <div className="flex items-center justify-end gap-3 mt-6">
                               <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">Cancel</button>
                               <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium">Save Changes</button>
                           </div>
                       </div>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-neutral-900 dark:text-white">Profile Visibility</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Control who can see your profile information</div>
                                    </div>
                                    <select className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white">
                                        <option>Public</option>
                                        <option>Private</option>
                                        <option>Team Only</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-neutral-900 dark:text-white">Show Statistics</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Display your performance metrics publicly</div>
                                    </div>
                                    <Toggle checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-neutral-900 dark:text-white">Allow Contact Requests</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Let other users send you messages</div>
                                    </div>
                                    <Toggle checked={false} />
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
           )}

           {/* Account Security Section */}
           {activeSection === 'account' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Account Security</h1>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Manage your password and authentication methods</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Password</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Last changed 3 months ago</p>
                                </div>
                                <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">Change Password</button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Current Password</label>
                                    <input type="password" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">New Password</label>
                                    <input type="password" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Confirm New Password</label>
                                    <input type="password" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">Cancel</button>
                                <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium">Update Password</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Two-Factor Authentication</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Add an extra layer of security to your account</p>
                                </div>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">Enable</button>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" style={{strokeWidth: 1.5}} />
                                    <div>
                                        <div className="text-sm font-medium text-green-900 dark:text-green-300">2FA is currently enabled</div>
                                        <div className="text-sm text-green-700 dark:text-green-400 mt-1">Using authenticator app</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Active Sessions</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                                            <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" style={{strokeWidth: 1.5}} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">Windows PC - Chrome</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">192.168.1.100 • Hanoi, Vietnam</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Current session</div>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">Active</span>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                                            <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">iPhone 14 - Safari</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">192.168.1.101 • Hanoi, Vietnam</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Last active 2 hours ago</div>
                                        </div>
                                    </div>
                                    <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">Revoke</button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                                            <Tablet className="w-5 h-5 text-purple-600 dark:text-purple-400" style={{strokeWidth: 1.5}} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">iPad Pro - Safari</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">192.168.1.102 • Ho Chi Minh City</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Last active 1 day ago</div>
                                        </div>
                                    </div>
                                    <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">Revoke</button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">Sign out all other sessions</button>
                            </div>
                        </div>
                    </div>
               </div>
           )}
           
           {/* Subscription Section */}
           {activeSection === 'subscription' && (
              <div className="animate-in fade-in duration-300">
                 <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Subscription & Billing</h1>
                    <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Manage your plan and payment methods</p>
                 </div>

                 <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 text-white rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
                            <p className="text-neutral-300 mb-4">Perfect for professional affiliate marketers</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">₫199,000</span>
                                <span className="text-neutral-300">/month</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-neutral-300 mb-2">Next billing date</div>
                            <div className="text-lg font-medium">February 15, 2024</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-700">
                        <div><div className="text-2xl font-bold">198</div><div className="text-sm text-neutral-300">Links Created</div></div>
                        <div><div className="text-2xl font-bold">45.2K</div><div className="text-sm text-neutral-300">Total Clicks</div></div>
                        <div><div className="text-2xl font-bold">100K</div><div className="text-sm text-neutral-300">Click Limit</div></div>
                        <div><div className="text-2xl font-bold">54.8K</div><div className="text-sm text-neutral-300">Remaining</div></div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Usage Statistics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2"><span className="text-sm text-neutral-600 dark:text-neutral-400">Monthly Clicks</span><span className="text-sm font-medium text-neutral-900 dark:text-white">45,200 / 100,000</span></div>
                                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{width: '45.2%'}}></div></div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2"><span className="text-sm text-neutral-600 dark:text-neutral-400">Links Created</span><span className="text-sm font-medium text-neutral-900 dark:text-white">198 / Unlimited</span></div>
                                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"><div className="h-full bg-green-600 rounded-full" style={{width: '100%'}}></div></div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2"><span className="text-sm text-neutral-600 dark:text-neutral-400">API Calls</span><span className="text-sm font-medium text-neutral-900 dark:text-white">12,450 / 50,000</span></div>
                                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"><div className="h-full bg-purple-600 rounded-full" style={{width: '24.9%'}}></div></div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2"><span className="text-sm text-neutral-600 dark:text-neutral-400">Team Members</span><span className="text-sm font-medium text-neutral-900 dark:text-white">3 / 5</span></div>
                                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"><div className="h-full bg-orange-600 rounded-full" style={{width: '60%'}}></div></div>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                     <div className="p-6">
                         <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Available Plans</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                                 <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Free</h4>
                                 <div className="mb-4"><span className="text-3xl font-bold text-neutral-900 dark:text-white">₫0</span><span className="text-neutral-600 dark:text-neutral-400">/month</span></div>
                                 <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> 50 links/month</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> 1,000 clicks/month</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> Basic analytics</li>
                                 </ul>
                                 <button className="w-full border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white py-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium">Current Plan</button>
                             </div>
                             <div className="border-2 border-neutral-900 dark:border-white rounded-lg p-6 relative">
                                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1 rounded-full text-xs font-medium">Current</div>
                                 <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Pro</h4>
                                 <div className="mb-4"><span className="text-3xl font-bold text-neutral-900 dark:text-white">₫199,000</span><span className="text-neutral-600 dark:text-neutral-400">/month</span></div>
                                 <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> Unlimited links</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> 100,000 clicks/month</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> Advanced analytics</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> Custom domain</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> API access</li>
                                 </ul>
                                 <button className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium">Current Plan</button>
                             </div>
                             <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                                 <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Agency</h4>
                                 <div className="mb-4"><span className="text-3xl font-bold text-neutral-900 dark:text-white">₫499,000</span><span className="text-neutral-600 dark:text-neutral-400">/month</span></div>
                                 <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> Everything in Pro</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> Unlimited clicks</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> 5 team members</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> White label</li>
                                     <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 dark:text-green-400" style={{strokeWidth: 1.5}} /> Priority support</li>
                                 </ul>
                                 <button className="w-full border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white py-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium">Upgrade</button>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Payment Methods</h3>
                            <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-white dark:hover:bg-neutral-700 transition-colors font-medium">Add Payment Method</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center"><span className="text-white text-xs font-bold">VISA</span></div>
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">•••• 4242</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Expires 12/25</div></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">Default</span>
                                    <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Remove</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center"><span className="text-white text-xs font-bold">MC</span></div>
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">•••• 5555</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Expires 09/24</div></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Set as Default</button>
                                    <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Remove</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between">
                                <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Billing History</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Download your invoices and receipts</div></div>
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">View History</button>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
           )}

           {/* Notifications Section */}
           {activeSection === 'notifications' && (
               <div className="animate-in fade-in duration-300">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Notification Preferences</h1>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Control how and when you receive notifications</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Email Notifications</h3>
                            <div className="space-y-4">
                                {['Performance Reports', 'New Features', 'Security Alerts', 'Billing Reminders'].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">{item}</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Receive updates about {item.toLowerCase()}</div>
                                        </div>
                                        <Toggle checked={true} />
                                    </div>
                                ))}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-neutral-900 dark:text-white">Marketing Emails</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Promotional offers and newsletters</div>
                                    </div>
                                    <Toggle checked={false} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Push Notifications</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Browser Push</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Real-time notifications in your browser</div></div>
                                    <Toggle checked={false} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Mobile Push</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Push notifications on mobile app</div></div>
                                    <Toggle checked={true} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Alert Thresholds</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Daily Click Alert</label>
                                    <input type="number" defaultValue="1000" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Alert when daily clicks exceed this amount</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Low Click Rate Alert</label>
                                    <input type="number" defaultValue="5" step="0.1" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Alert when CTR drops below this percentage</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Revenue Alert</label>
                                    <input type="number" defaultValue="1000000" className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent" />
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Alert when daily revenue exceeds this amount (VND)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Link Expiry Alert</label>
                                    <select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent">
                                        <option>7 days before</option>
                                        <option>3 days before</option>
                                        <option>1 day before</option>
                                        <option>On expiry day</option>
                                    </select>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">When to send link expiry notifications</p>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
           )}

           {/* API Keys Section */}
           {activeSection === 'api' && (
               <div className="animate-in fade-in duration-300">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">API Keys</h1>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Manage your API access keys and permissions</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Active API Keys</h3>
                                <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium">Generate New Key</button>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">Production API Key</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Created on January 1, 2024</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">Active</span>
                                            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Revoke</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 text-xs bg-neutral-100 dark:bg-neutral-900 px-3 py-2 rounded font-mono text-neutral-700 dark:text-neutral-300">ls_live_4h8k2j3m5n7p9q1r3s5t7</code>
                                        <button onClick={() => {navigator.clipboard.writeText('ls_live_4h8k2j3m5n7p9q1r3s5t7'); alert('Copied!')}} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                                            <Copy className="w-4 h-4" style={{strokeWidth: 1.5}} />
                                        </button>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">links:read</span>
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">links:write</span>
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">analytics:read</span>
                                    </div>
                                </div>
                                <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">Development API Key</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Created on January 10, 2024</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">Active</span>
                                            <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Revoke</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 text-xs bg-neutral-100 dark:bg-neutral-900 px-3 py-2 rounded font-mono text-neutral-700 dark:text-neutral-300">ls_test_2a4b6c8d1e3f5g7h9j2k4</code>
                                        <button onClick={() => {navigator.clipboard.writeText('ls_test_2a4b6c8d1e3f5g7h9j2k4'); alert('Copied!')}} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                                            <Copy className="w-4 h-4" style={{strokeWidth: 1.5}} />
                                        </button>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">links:read</span>
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">analytics:read</span>
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs font-medium rounded-full">Sandbox</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">API Usage</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div><div className="text-2xl font-bold text-neutral-900 dark:text-white">12,450</div><div className="text-sm text-neutral-500 dark:text-neutral-400">Requests this month</div></div>
                                <div><div className="text-2xl font-bold text-neutral-900 dark:text-white">418</div><div className="text-sm text-neutral-500 dark:text-neutral-400">Daily average</div></div>
                                <div><div className="text-2xl font-bold text-neutral-900 dark:text-white">99.8%</div><div className="text-sm text-neutral-500 dark:text-neutral-400">Success rate</div></div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2"><span className="text-sm text-neutral-600 dark:text-neutral-400">Monthly Quota</span><span className="text-sm font-medium text-neutral-900 dark:text-white">12,450 / 50,000</span></div>
                                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full"><div className="h-full bg-purple-600 rounded-full" style={{width: '24.9%'}}></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">API Documentation</h3>
                                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">View Full Docs →</a>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                                    <div className="text-sm font-medium text-neutral-900 dark:text-white mb-2">Quick Start</div>
                                    <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">Get started with our REST API in minutes</div>
                                    <code className="block text-xs bg-neutral-900 dark:bg-black text-green-400 p-3 rounded font-mono whitespace-pre-wrap">
                                        curl -X POST https://api.linkshort.vn/v1/links \<br/>
                                        &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                                        &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                                        &nbsp;&nbsp;-d '{"destination: https://example.com"}'
                                    </code>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <a href="#" className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors">
                                        <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">Endpoints</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Complete API reference</div>
                                    </a>
                                    <a href="#" className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors">
                                        <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">SDKs</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Python, JavaScript, PHP</div>
                                    </a>
                                    <a href="#" className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors">
                                        <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">Examples</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Code samples & tutorials</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
           )}

           {/* Integrations Section */}
           {activeSection === 'integrations' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Integrations</h1>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Connect LinkShort with your favorite tools</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Connected Integrations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center"><span className="text-lg font-bold text-blue-600 dark:text-blue-400">G</span></div>
                                            <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Google Analytics</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Track link performance</div></div>
                                        </div>
                                        <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Disconnect</button>
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400">Connected on Jan 15, 2024</div>
                                </div>
                                <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center"><span className="text-lg font-bold text-purple-600 dark:text-purple-400">S</span></div>
                                            <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Slack</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Daily notifications</div></div>
                                        </div>
                                        <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Disconnect</button>
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400">Connected on Jan 10, 2024</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Available Integrations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    {char: 'Z', color: 'red', name: 'Zapier', desc: 'Automate workflows'},
                                    {char: 'W', color: 'green', name: 'WhatsApp', desc: 'Share links via WhatsApp'},
                                    {char: 'D', color: 'blue', name: 'Discord', desc: 'Community notifications'},
                                    {char: 'F', color: 'orange', name: 'Facebook', desc: 'Auto-post to pages'},
                                    {char: 'T', color: 'blue', name: 'Telegram', desc: 'Bot notifications'},
                                    {char: 'N', color: 'purple', name: 'Notion', desc: 'Track links in databases'}
                                ].map((tool, i) => (
                                    <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 bg-${tool.color}-100 dark:bg-${tool.color}-900/30 rounded-md flex items-center justify-center`}>
                                                <span className={`text-lg font-bold text-${tool.color}-600 dark:text-${tool.color}-400`}>{tool.char}</span>
                                            </div>
                                            <div><div className="text-sm font-medium text-neutral-900 dark:text-white">{tool.name}</div><div className="text-xs text-neutral-500 dark:text-neutral-400">{tool.desc}</div></div>
                                        </div>
                                        <button className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">Connect</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
               </div>
           )}

           {/* Advanced Section */}
           {activeSection === 'advanced' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Advanced Settings</h1>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Configure advanced options and preferences</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">General Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Default Domain</label>
                                    <select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"><option>linkshort.vn</option><option>custom-domain.com</option></select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Timezone</label>
                                    <select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"><option>Asia/Ho_Chi_Minh (GMT+7)</option><option>Asia/Bangkok (GMT+7)</option><option>UTC (GMT+0)</option></select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Language</label>
                                    <select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"><option>Vietnamese</option><option>English</option></select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Date Format</label>
                                    <select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg mb-6 transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Tracking & Analytics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Enhanced Tracking</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Track advanced metrics like scroll depth and time on page</div></div>
                                    <Toggle checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">UTM Auto-tagging</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Automatically add UTM parameters to all links</div></div>
                                    <Toggle checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Cookie Consent</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Show cookie consent banner for GDPR compliance</div></div>
                                    <Toggle checked={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Data & Privacy</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Data Retention Period</label>
                                    <select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"><option>6 months</option><option>1 year</option><option>2 years</option><option>Forever</option></select>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">How long to keep analytics data</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Anonymize IP Addresses</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Remove last octet from IP addresses for privacy</div></div>
                                    <Toggle checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div><div className="text-sm font-medium text-neutral-900 dark:text-white">Share Anonymous Data</div><div className="text-xs text-neutral-500 dark:text-neutral-400">Help improve LinkShort by sharing anonymous usage data</div></div>
                                    <Toggle checked={false} />
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">Download My Data</button>
                            </div>
                        </div>
                    </div>
               </div>
           )}

           {/* Danger Zone */}
           {activeSection === 'danger' && (
               <div className="animate-in fade-in duration-300">
                   <div className="mb-8">
                       <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Danger Zone</h1>
                       <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">Irreversible actions that affect your account</p>
                   </div>

                   <div className="bg-white dark:bg-neutral-800 border border-red-200 dark:border-red-900/50 rounded-lg transition-colors">
                       <div className="p-6">
                           <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Dangerous Actions</h3>

                           <div className="space-y-6">
                               <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                   <div>
                                       <div className="text-sm font-medium text-neutral-900 dark:text-white">Clear All Analytics Data</div>
                                       <div className="text-xs text-neutral-500 dark:text-neutral-400">Permanently delete all historical analytics data</div>
                                   </div>
                                   <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">Clear Data</button>
                               </div>

                               <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                   <div>
                                       <div className="text-sm font-medium text-neutral-900 dark:text-white">Delete All Links</div>
                                       <div className="text-xs text-neutral-500 dark:text-neutral-400">Remove all created links and their data</div>
                                   </div>
                                   <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">Delete Links</button>
                               </div>

                               <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                   <div>
                                       <div className="text-sm font-medium text-neutral-900 dark:text-white">Downgrade to Free Plan</div>
                                       <div className="text-xs text-neutral-500 dark:text-neutral-400">Lose access to Pro features and data limits</div>
                                   </div>
                                   <button className="px-4 py-2 border border-orange-300 dark:border-orange-800 text-orange-600 dark:text-orange-400 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-medium">Downgrade Plan</button>
                               </div>

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
              <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">Type "DELETE" to confirm</label>
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
    </>
  );
};

export default Settings;
    