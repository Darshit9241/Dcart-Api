import React, { useState, useEffect, useCallback } from 'react';
import { useTheme, ThemeProvider } from '../component/header/ThemeContext';
import CustomerManagement from '../component/admin/CustomerManagement';
import AdminLayout from './AdminLayout';

const AdminCustomers = () => {
  const { isDarkMode } = useTheme();
  
  // Search state
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch users on component mount
  const fetchUsers = useCallback(() => {
    setLoading(true);
    try {
      // Try to get saved users from localStorage
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      
      if (savedUsers.length === 0) {
        // Create mock users if none exist
        const mockUsers = [
          {
            id: 'USR001',
            name: 'John Doe',
            email: 'john@example.com',
            password: '●●●●●●',
            realPassword: 'password123',
            photo: 'https://randomuser.me/api/portraits/men/1.jpg',
            dateJoined: '2023-01-15',
            orders: 5,
            status: 'active'
          },
          {
            id: 'USR002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: '●●●●●●●',
            realPassword: 'securepass',
            photo: 'https://randomuser.me/api/portraits/women/2.jpg',
            dateJoined: '2023-02-20',
            orders: 3,
            status: 'active'
          },
          {
            id: 'USR003',
            name: 'Michael Johnson',
            email: 'michael@example.com',
            password: '●●●●●●●●',
            realPassword: 'michael2023',
            photo: 'https://randomuser.me/api/portraits/men/3.jpg',
            dateJoined: '2023-03-10',
            orders: 0,
            status: 'inactive'
          },
          {
            id: 'USR004',
            name: 'Emily Wilson',
            email: 'emily@example.com',
            password: '●●●●●●',
            realPassword: 'emilyw',
            photo: 'https://randomuser.me/api/portraits/women/4.jpg',
            dateJoined: '2023-04-05',
            orders: 7,
            status: 'active'
          },
          {
            id: 'USR005',
            name: 'Robert Brown',
            email: 'robert@example.com',
            password: '●●●●●●●●',
            realPassword: 'robert1234',
            photo: 'https://randomuser.me/api/portraits/men/5.jpg',
            dateJoined: '2023-05-12',
            orders: 2,
            status: 'active'
          }
        ];
        
        localStorage.setItem('users', JSON.stringify(mockUsers));
        setUsers(mockUsers);
      } else {
        setUsers(savedUsers);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // User management functions
  const toggleUserStatus = useCallback((userId) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  const deleteUser = useCallback((userId) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  const togglePasswordVisibility = useCallback((userId) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              password: user.password === '●●●●●●' ? user.realPassword : '●●●●●●' 
            } 
          : user
      );
      return updatedUsers;
    });
  }, []);

  // Event handlers
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    
    // Close the modal if the deleted user was being viewed
    if (selectedUser && selectedUser.id === userId) {
      setShowUserModal(false);
      setSelectedUser(null);
    }
  };

  const handleToggleUserStatus = (userId) => {
    toggleUserStatus(userId);
    
    // Update the selected user if it's the one being modified
    if (selectedUser && selectedUser.id === userId) {
      const updatedUser = users.find(user => user.id === userId);
      setSelectedUser(updatedUser);
    }
  };

  const handleRevealPassword = (userId) => {
    togglePasswordVisibility(userId);
    
    // Update the selected user if it's the one being modified
    if (selectedUser && selectedUser.id === userId) {
      const updatedUser = users.find(user => user.id === userId);
      setSelectedUser(updatedUser);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayout activeTab="customers">
      <CustomerManagement
        users={filteredUsers}
        loading={loading}
        error={error}
        isDarkMode={isDarkMode}
        userSearchTerm={userSearchTerm}
        setUserSearchTerm={setUserSearchTerm}
        handleViewUserDetails={handleViewUserDetails}
        handleToggleUserStatus={handleToggleUserStatus}
        handleDeleteUser={handleDeleteUser}
        handleRevealPassword={handleRevealPassword}
      />
    </AdminLayout>
  );
};

// Wrap with ThemeProvider
const AdminCustomersWithTheme = () => {
  return (
    <ThemeProvider>
      <AdminCustomers />
    </ThemeProvider>
  );
};

export default AdminCustomersWithTheme; 