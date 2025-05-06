import React, { useState, useEffect } from 'react';
import { useAdminTheme, AdminThemeProvider } from './AdminThemeContext';
import { FaUser, FaEnvelope, FaLock, FaKey, FaCalendarAlt, FaUserTag, FaCamera } from 'react-icons/fa';
import { FiSave, FiUpload, FiRefreshCw, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../pages/AdminLayout';

const AdminProfile = () => {
  const { isDarkMode } = useAdminTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [securityExpanded, setSecurityExpanded] = useState(false);

  // Profile data state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    avatar: null,
    lastLogin: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  // Load admin profile data
  useEffect(() => {
    const adminName = localStorage.getItem('adminName');
    const adminEmail = localStorage.getItem('adminEmail');
    const adminRole = localStorage.getItem('adminRole');
    const adminPhoto = localStorage.getItem('adminPhoto');
    const lastLogin = localStorage.getItem('adminLastLogin') || new Date().toLocaleString();

    setProfile(prev => ({
      ...prev,
      name: adminName || 'Admin User',
      email: adminEmail || 'admin@dcartstore.com',
      role: adminRole || 'Administrator',
      avatar: adminPhoto || null,
      lastLogin: lastLogin
    }));
  }, []);

  // Handle profile updates
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile
  const handleSaveProfile = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('adminName', profile.name);
      localStorage.setItem('adminEmail', profile.email);
      localStorage.setItem('adminRole', profile.role);
      
      if (profile.avatar) {
        localStorage.setItem('adminPhoto', profile.avatar);
      }
      
      setLoading(false);
      setIsEditing(false);
      
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  // Update password
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    
    if (!profile.password) {
      toast.error("Current password is required");
      return;
    }
    
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (profile.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setProfile(prev => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      toast.success("Password updated successfully!");
    }, 1000);
  };

  // Toggle two-factor authentication
  const handleToggle2FA = () => {
    setProfile(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
    
    toast.success(`Two-factor authentication ${profile.twoFactorEnabled ? 'disabled' : 'enabled'}`);
  };

  return (
    <AdminLayout activeTab="settings">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md overflow-hidden mb-8`}>
        {/* Profile Header */}
        <div className={`px-6 py-8 relative ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 ring-4 ring-indigo-500/30">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                    <FaUser className="w-14 h-14 opacity-70" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-indigo-600 transition-colors">
                  <FaCamera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{profile.email}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                isDarkMode ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {profile.role}
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaCalendarAlt className="inline-block mr-1" /> Last login: {profile.lastLogin}
              </p>
            </div>
            
            <div>
              <button
                className={`px-4 py-2 rounded-lg ${
                  isEditing 
                    ? (isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700') 
                    : (isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700')
                } text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode ? 'focus:ring-offset-gray-800' : ''
                } focus:ring-indigo-500`}
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                disabled={loading}
              >
                {loading ? (
                  <FiRefreshCw className="inline-block mr-2 animate-spin" />
                ) : isEditing ? (
                  <><FiSave className="inline-block mr-2" /> Save</>
                ) : (
                  <>Edit Profile</>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Information Form */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`pl-10 w-full py-2 px-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isEditing ? 'opacity-75' : ''}`}
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`pl-10 w-full py-2 px-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isEditing ? 'opacity-75' : ''}`}
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTag className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <select
                  name="role"
                  value={profile.role}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`pl-10 w-full py-2 px-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isEditing ? 'opacity-75' : ''}`}
                >
                  <option>Administrator</option>
                  <option>Manager</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Security Section */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            className="flex items-center justify-between w-full text-left"
            onClick={() => setSecurityExpanded(!securityExpanded)}
          >
            <div className="flex items-center">
              <FiShield className="mr-2" />
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>
            <svg 
              className={`w-5 h-5 transition-transform ${securityExpanded ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {securityExpanded && (
            <div className="mt-4 space-y-6">
              {/* Password Change Form */}
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={profile.password}
                        onChange={handleInputChange}
                        className={`pl-10 w-full py-2 px-4 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaKey className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={profile.newPassword}
                        onChange={handleInputChange}
                        className={`pl-10 w-full py-2 px-4 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaKey className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={profile.confirmPassword}
                        onChange={handleInputChange}
                        className={`pl-10 w-full py-2 px-4 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg ${
                        isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
                      } text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isDarkMode ? 'focus:ring-offset-gray-800' : ''
                      } focus:ring-indigo-500`}
                      disabled={loading}
                    >
                      {loading ? (
                        <FiRefreshCw className="inline-block mr-2 animate-spin" />
                      ) : (
                        <>Update Password</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Two-Factor Authentication */}
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={profile.twoFactorEnabled}
                      onChange={handleToggle2FA}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Wrapper with ThemeProvider
const AdminProfileWithTheme = () => {
  return (
    <AdminThemeProvider>
      <AdminProfile />
    </AdminThemeProvider>
  );
};

export default AdminProfileWithTheme; 