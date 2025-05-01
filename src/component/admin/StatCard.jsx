import React from 'react';
import { useTheme } from '../../component/header/ThemeContext';

const StatCard = ({ title, value, icon, trend, color = 'blue' }) => {
  const { isDarkMode } = useTheme();
  
  const colorClasses = {
    blue: {
      bg: isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50',
      text: 'text-blue-500',
      border: isDarkMode ? 'border-blue-800/20' : 'border-blue-200/70'
    },
    green: {
      bg: isDarkMode ? 'bg-green-900/10' : 'bg-green-50',
      text: 'text-green-500',
      border: isDarkMode ? 'border-green-800/20' : 'border-green-200/70'
    },
    orange: {
      bg: isDarkMode ? 'bg-orange-900/10' : 'bg-orange-50',
      text: 'text-orange-500',
      border: isDarkMode ? 'border-orange-800/20' : 'border-orange-200/70'
    },
    purple: {
      bg: isDarkMode ? 'bg-purple-900/10' : 'bg-purple-50',
      text: 'text-purple-500',
      border: isDarkMode ? 'border-purple-800/20' : 'border-purple-200/70'
    }
  };
  
  const selectedColor = colorClasses[color] || colorClasses.blue;
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  
  return (
    <div className={`p-4 rounded-lg ${selectedColor.bg} ${selectedColor.border} border shadow-sm hover:shadow transition-all duration-200`}>
      <div className="flex items-center gap-3">
        <div className={`text-2xl p-2 rounded-lg ${selectedColor.text}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${subtextColor}`}>{title}</p>
          <p className={`text-xl font-bold truncate ${textColor}`}>
            {value.length > 10 ? value.substring(0, 9) + '...' : value}
          </p>
          {trend && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              <span className="ml-1 text-xs text-gray-500 hidden xs:inline-block">vs last month</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 