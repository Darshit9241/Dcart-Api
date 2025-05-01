import React from 'react';
import { getCurrencySymbol } from '../../utils/currencyUtils';

const AdminSettings = ({
  isDarkMode,
  activeSettingsTab,
  setActiveSettingsTab,
  storeSettings,
  adminSettings,
  handleStoreSettingsChange,
  handleAdminSettingsChange,
  saveStoreSettings,
  saveAdminSettings,
  getSystemInformation,
  currentCurrency
}) => {
  const tabs = [
    { id: 'store', name: 'Store Settings' },
    { id: 'admin', name: 'Admin Preferences' },
    { id: 'system', name: 'System Information' }
  ];
  
  const baseInputClass = `w-full p-2 rounded-lg border ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  } focus:ring-2 focus:ring-orange-500 focus:border-transparent`;
  
  const cardClass = `p-4 sm:p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`;
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Admin Settings</h1>
      
      {/* Settings Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSettingsTab(tab.id)}
            className={`py-2 px-3 sm:px-4 text-sm sm:text-base font-medium rounded-t-lg ${
              activeSettingsTab === tab.id
                ? `${isDarkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-50 text-orange-600'} border-b-2 border-orange-500`
                : `${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      
      {/* Store Settings */}
      {activeSettingsTab === 'store' && (
        <div className={cardClass}>
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Store Configuration</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">Configure your store's basic information and policies.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { name: 'storeName', label: 'Store Name', type: 'text' },
              { name: 'storeEmail', label: 'Store Email', type: 'email' },
              { name: 'storePhone', label: 'Store Phone', type: 'text' },
              { name: 'taxRate', label: 'Tax Rate (%)', type: 'number', step: '0.1', min: '0' },
              { 
                name: 'shippingFee', 
                label: `Standard Shipping Fee (${getCurrencySymbol(currentCurrency)})`, 
                type: 'number',
                min: '0',
                step: '0.01',
                className: 'col-span-1'
              },
              { 
                name: 'freeShippingThreshold', 
                label: `Free Shipping Threshold (${getCurrencySymbol(currentCurrency)})`, 
                type: 'number',
                min: '0',
                step: '0.01',
                className: 'col-span-1'
              }
            ].map(field => (
              <div key={field.name} className={field.className}>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={storeSettings[field.name]}
                  onChange={handleStoreSettingsChange}
                  step={field.step}
                  min={field.min}
                  className={baseInputClass}
                />
              </div>
            ))}
            
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Store Address</label>
              <textarea
                name="storeAddress"
                value={storeSettings.storeAddress}
                onChange={handleStoreSettingsChange}
                rows="3"
                className={baseInputClass}
              />
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={saveStoreSettings}
              className="bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-orange-600 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
      
      {/* Admin Preferences */}
      {activeSettingsTab === 'admin' && (
        <div className={cardClass}>
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Admin Preferences</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">Configure your notification preferences and admin settings.</p>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              value={adminSettings.adminEmail}
              onChange={handleAdminSettingsChange}
              className={baseInputClass + " mb-4 sm:mb-6"}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">Notifications</h3>
              {[
                { id: 'notificationEmails', label: 'Receive order notification emails' },
                { id: 'dailyReports', label: 'Receive daily sales reports' },
                { id: 'weeklyReports', label: 'Receive weekly sales reports' },
                { id: 'monthlyReports', label: 'Receive monthly sales reports' }
              ].map(option => (
                <div key={option.id} className="flex items-center mb-2 sm:mb-3">
                  <input
                    type="checkbox"
                    id={option.id}
                    name={option.id}
                    checked={adminSettings[option.id]}
                    onChange={handleAdminSettingsChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor={option.id} className="ml-2 block text-xs sm:text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">Inventory Alerts</h3>
              <div className="flex items-center mb-2 sm:mb-3">
                <input
                  type="checkbox"
                  id="alertLowStock"
                  name="alertLowStock"
                  checked={adminSettings.alertLowStock}
                  onChange={handleAdminSettingsChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="alertLowStock" className="ml-2 block text-xs sm:text-sm">
                  Alert when product stock is low
                </label>
              </div>
              
              <div className="mt-2 sm:mt-3">
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={adminSettings.lowStockThreshold}
                  onChange={handleAdminSettingsChange}
                  min="1"
                  className={baseInputClass}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={saveAdminSettings}
              className="bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-orange-600 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
      
      {/* System Information */}
      {activeSettingsTab === 'system' && (
        <div className={cardClass}>
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">System Information</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">View system statistics and information.</p>
          
          {(() => {
            const systemInfo = getSystemInformation();
            const statCardClass = `p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`;
            
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className={statCardClass}>
                    <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Store Statistics</h3>
                    {[
                      { label: 'Total Products', value: systemInfo.totalProducts },
                      { label: 'Total Orders', value: systemInfo.totalOrders },
                      { label: 'Total Users', value: systemInfo.totalUsers },
                      { label: 'Active Users', value: systemInfo.activeUsers },
                      { 
                        label: 'Total Revenue', 
                        value: `${getCurrencySymbol(currentCurrency)}${systemInfo.totalRevenue.toFixed(2)}`,
                        className: 'text-green-600 dark:text-green-400'
                      },
                      { 
                        label: 'Average Order Value', 
                        value: `${getCurrencySymbol(currentCurrency)}${systemInfo.averageOrderValue.toFixed(2)}`
                      }
                    ].map((stat, index) => (
                      <div key={index} className="flex justify-between mb-1 sm:mb-2 text-xs sm:text-sm">
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}:</span>
                        <span className={`font-medium ${stat.className || ''}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={statCardClass}>
                    <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Order Status</h3>
                    {[
                      { label: 'Pending Orders', value: systemInfo.pendingOrders },
                      { label: 'Completed Orders', value: systemInfo.completedOrders },
                      { label: 'Cancelled Orders', value: systemInfo.cancelledOrders }
                    ].map((stat, index) => (
                      <div key={index} className="flex justify-between mb-1 sm:mb-2 text-xs sm:text-sm">
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}:</span>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                    ))}
                    
                    <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm sm:text-md font-medium mb-1 sm:mb-2">Order Completion Rate</h4>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-1.5 sm:h-2 text-xs flex rounded bg-gray-300 dark:bg-gray-600">
                          {systemInfo.totalOrders > 0 && (
                            <div
                              style={{ width: `${(systemInfo.completedOrders / systemInfo.totalOrders) * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                            ></div>
                          )}
                        </div>
                        <div className="text-right text-xs mt-1">
                          {systemInfo.totalOrders > 0 
                            ? `${Math.round((systemInfo.completedOrders / systemInfo.totalOrders) * 100)}%` 
                            : '0%'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={statCardClass}>
                  <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Technical Information</h3>
                  {[
                    { label: 'System Version', value: systemInfo.systemVersion },
                    { label: 'Last Updated', value: systemInfo.lastUpdated },
                    { label: 'Browser', value: navigator.userAgent }
                  ].map((info, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between mb-2 text-xs sm:text-sm">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1 sm:mb-0`}>{info.label}:</span>
                      <span className="font-medium break-words sm:text-right sm:max-w-xs">{info.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 sm:mt-6 flex justify-end">
                  <button
                    onClick={() => window.print()}
                    className="bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Print Report
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default AdminSettings; 