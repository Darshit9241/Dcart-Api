import React from 'react';
import { useAdminTheme, AdminThemeProvider } from '../component/admin/AdminThemeContext';
import AdminActivity from '../component/admin/AdminActivity';
import AdminLayout from './AdminLayout';

const AdminActivityPage = () => {
  const { isDarkMode } = useAdminTheme();

  return (
    <AdminLayout activeTab="activity">
      <AdminActivity />
    </AdminLayout>
  );
};

// Wrap with ThemeProvider
const AdminActivityPageWithTheme = () => {
  return (
    <AdminThemeProvider>
      <AdminActivityPage />
    </AdminThemeProvider>
  );
};

export default AdminActivityPageWithTheme; 