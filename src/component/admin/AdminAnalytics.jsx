import React, { useState, useMemo } from 'react';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiTrendingUp, FiCalendar, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import StatCard from './StatCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Directly define the currency symbol helper function within the component
// to avoid any import issues
const getCurrencySymbol = (code) => {
  const symbols = { 
    USD: '$', 
    EUR: '€', 
    GBP: '£', 
    JPY: '¥', 
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr'
  };
  return symbols[code] || '$';
};

// Generate demo chart data when no real data is available
const generateDemoData = (timeRange, isDarkMode) => {
  let labels = [];
  const now = new Date();
  
  // Generate appropriate labels based on time range
  if (timeRange === 'week') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
  } else if (timeRange === 'month') {
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (now.getDay() + 7 * i));
      const weekLabel = `Week ${4-i}`;
      labels.push(weekLabel);
    }
  } else if (timeRange === 'year') {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
  
  // Generate random revenue data with an upward trend
  const revenue = labels.map((_, i) => {
    const baseValue = 1000 + i * 150; // Base value with upward trend
    const randomVariation = Math.random() * 400 - 200; // Add some random variation
    return Math.max(200, Math.round(baseValue + randomVariation));
  });
  
  // Generate random order count data with correlation to revenue
  const orders = revenue.map(rev => Math.round(rev / (30 + Math.random() * 10)));
  
  // Chart colors
  const revenueColor = isDarkMode ? 'rgba(52, 211, 153, 1)' : 'rgba(16, 185, 129, 1)'; // Green
  const ordersColor = isDarkMode ? 'rgba(251, 146, 60, 1)' : 'rgba(249, 115, 22, 1)';   // Orange
  const bgColor1 = isDarkMode ? 'rgba(52, 211, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)';  
  const bgColor2 = isDarkMode ? 'rgba(251, 146, 60, 0.1)' : 'rgba(249, 115, 22, 0.1)';

  return {
    labels,
    revenue: {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenue,
          borderColor: revenueColor,
          backgroundColor: bgColor1,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: revenueColor
        }
      ]
    },
    orders: {
      labels,
      datasets: [
        {
          label: 'Orders',
          data: orders,
          backgroundColor: ordersColor,
          borderRadius: 4,
          barThickness: timeRange === 'year' ? 16 : 24,
          maxBarThickness: 24
        }
      ]
    }
  };
};

const AdminAnalytics = ({ orders, users, products, isDarkMode, currentCurrency = 'USD' }) => {
  console.log("AdminAnalytics rendering with:", { 
    isDarkMode, 
    currentCurrency,
    ordersCount: orders?.length || 0,
    usersCount: users?.length || 0,
    productsCount: products?.length || 0
  });

  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  
  // Theme classes for consistent styling
  const themeClasses = {
    container: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    title: isDarkMode ? 'text-white' : 'text-gray-800',
    subtext: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    card: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100',
    button: isDarkMode ? 'border-gray-700 text-orange-400 hover:bg-gray-700' : 'border-gray-200 text-orange-600 hover:bg-gray-50',
    activeButton: isDarkMode ? 'bg-orange-900/20 text-orange-400 border-orange-800/50' : 'bg-orange-100 text-orange-600 border-orange-200',
    inactiveButton: isDarkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
  };

  // Calculate date ranges
  const getCurrentDateRange = () => {
    const now = new Date();
    const ranges = {
      week: {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        end: now
      },
      month: {
        start: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        end: now
      },
      year: {
        start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        end: now
      }
    };
    return ranges[timeRange];
  };

  // Generate chart data
  const chartData = useMemo(() => {
    // In real implementation, you would process actual order data
    // For now, using demo data
    return generateDemoData(timeRange, isDarkMode);
  }, [timeRange, isDarkMode]);

  // Chart options
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Revenue: ${getCurrencySymbol(currentCurrency)}${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: (value) => `${getCurrencySymbol(currentCurrency)}${value}`
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  };

  const ordersChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  };

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const { start, end } = getCurrentDateRange();
    
    return {
      orders: (orders || []).filter(order => {
        const orderDate = new Date(order.date || Date.now());
        return orderDate >= start && orderDate <= end;
      }),
      users: (users || []).filter(user => {
        const registrationDate = new Date(user.registrationDate || user.createdAt || Date.now());
        return registrationDate >= start && registrationDate <= end;
      })
    };
  }, [orders, users, timeRange]);
  
  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredData.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const avgOrderValue = filteredData.orders.length > 0 
      ? totalRevenue / filteredData.orders.length 
      : 0;
    
    const productsSold = filteredData.orders.reduce((count, order) => {
      return count + (order.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 1);
    }, 0);
    
    // Calculate top categories if available in products
    const categoryCount = (products || []).reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    const sortedCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      totalRevenue,
      avgOrderValue,
      productsSold,
      ordersCount: filteredData.orders.length,
      newUsers: filteredData.users.length,
      topCategories: sortedCategories
    };
  }, [filteredData, products]);

  // Calculate order status breakdown
  const orderStatusBreakdown = useMemo(() => {
    const statuses = {
      processing: 0,
      completed: 0,
      cancelled: 0
    };
    
    filteredData.orders.forEach(order => {
      const status = order.status?.toLowerCase() || 'processing';
      if (statuses.hasOwnProperty(status)) {
        statuses[status]++;
      }
    });
    
    return statuses;
  }, [filteredData.orders]);

  // Function to get status color for order badges
  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelled':
        return isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700';
      case 'completed':
        return isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
      case 'processing':
      default:
        return isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700';
    }
  };

  // Most recent orders for activity feed
  const recentOrders = useMemo(() => {
    return [...(filteredData.orders || [])]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);
  }, [filteredData.orders]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <div className="animate-fadeIn space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header with time range selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className={`text-xl sm:text-2xl font-bold ${themeClasses.title}`}>Analytics Dashboard</h1>
        <div className="flex flex-col xs:flex-row w-full sm:w-auto items-start xs:items-center gap-2 sm:gap-0">
          <div className={`mb-2 xs:mb-0 mr-0 xs:mr-4 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center border rounded-lg overflow-hidden w-full xs:w-auto">
            <button 
              onClick={() => setTimeRange('week')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium border-r flex-1 xs:flex-auto transition-colors ${timeRange === 'week' ? themeClasses.activeButton : themeClasses.inactiveButton}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setTimeRange('month')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium border-r flex-1 xs:flex-auto transition-colors ${timeRange === 'month' ? themeClasses.activeButton : themeClasses.inactiveButton}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setTimeRange('year')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium flex-1 xs:flex-auto transition-colors ${timeRange === 'year' ? themeClasses.activeButton : themeClasses.inactiveButton}`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          title="Products" 
          value={(products?.length || 0).toString()} 
          icon={<FiPackage />} 
          trend={3.2} 
          color="blue" 
        />
        <StatCard 
          title="Orders" 
          value={(orders?.length || 0).toString()} 
          icon={<FiShoppingBag />} 
          trend={7.1} 
          color="orange" 
        />
        <StatCard 
          title="Revenue" 
          value={`${getCurrencySymbol(currentCurrency)}${totalRevenue.toFixed(2)}`}
          icon={<FiDollarSign />} 
          trend={12.3} 
          color="green" 
        />
        <StatCard 
          title="Users" 
          value={metrics.newUsers.toString()} 
          icon={<FiUsers />} 
          trend={4.8} 
          color="purple" 
        />
      </div>
      
      {/* Main Content - Exactly matching dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Orders Status */}
        <div className={`rounded-xl p-3 sm:p-4 ${themeClasses.container} shadow-sm`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${themeClasses.title}`}>Order Status</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className={`text-center p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="text-lg sm:text-xl font-bold text-blue-500">{orderStatusBreakdown.processing}</p>
              <p className={`text-xs ${themeClasses.subtext}`}>Processing</p>
            </div>
            <div className={`text-center p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <p className="text-lg sm:text-xl font-bold text-green-500">{orderStatusBreakdown.completed}</p>
              <p className={`text-xs ${themeClasses.subtext}`}>Completed</p>
            </div>
            <div className={`text-center p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <p className="text-lg sm:text-xl font-bold text-red-500">{orderStatusBreakdown.cancelled}</p>
              <p className={`text-xs ${themeClasses.subtext}`}>Cancelled</p>
            </div>
          </div>
        </div>
        
        {/* Sales Chart */}
        <div className={`rounded-xl p-3 sm:p-4 ${themeClasses.container} shadow-sm lg:col-span-2`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${themeClasses.title}`}>Sales Overview</h2>
          <div className="h-40 sm:h-48">
            <Line 
              data={chartData.revenue} 
              options={revenueChartOptions} 
            />
          </div>
        </div>
      </div>
      
      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Orders Chart */}
        <div className={`rounded-xl p-3 sm:p-4 ${themeClasses.container} shadow-sm`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${themeClasses.title}`}>Orders Trend</h2>
          <div className="h-40 sm:h-48">
            <Bar 
              data={chartData.orders} 
              options={ordersChartOptions} 
            />
          </div>
        </div>
        
        {/* Average Order Value Card */}
        <div className={`rounded-xl p-3 sm:p-4 ${themeClasses.container} shadow-sm`}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <FiTrendingUp className={isDarkMode ? 'text-orange-400' : 'text-orange-500'} />
              <h2 className={`text-base sm:text-lg font-semibold ${themeClasses.title}`}>Average Order Value</h2>
            </div>
            <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-lg flex items-center gap-1 ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
              <FiArrowUp className="w-3 h-3" />
              <span>8.3%</span>
            </div>
          </div>
          <div className="flex items-end gap-1 sm:gap-2">
            <span className={`text-2xl sm:text-3xl font-bold ${themeClasses.title}`}>
              {getCurrencySymbol(currentCurrency)}{metrics.avgOrderValue.toFixed(2)}
            </span>
            <span className={`text-xs sm:text-sm mb-1 ${themeClasses.subtext}`}>per order</span>
          </div>
          
          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.subtext}`}>Products per Order</p>
              <p className={`text-base sm:text-lg font-semibold ${themeClasses.title}`}>
                {(metrics.productsSold / (metrics.ordersCount || 1)).toFixed(1)}
              </p>
            </div>
            <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.subtext}`}>Revenue Growth</p>
              <p className={`text-base sm:text-lg font-semibold text-green-500`}>+14.2%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className={`rounded-xl p-3 sm:p-4 ${themeClasses.container} shadow-sm`}>
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <h2 className={`text-base sm:text-lg font-semibold ${themeClasses.title}`}>Recent Orders</h2>
          <button className={`text-xs sm:text-sm font-medium ${themeClasses.button} px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border`}>
            View All
          </button>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className={`p-2 sm:p-3 rounded-lg ${themeClasses.card} transition-colors`}>
                <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-1">
                  <div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="font-medium truncate max-w-[150px] sm:max-w-none">{order.userInfo?.name || 'Unknown User'}</span>
                      <span className={`px-1.5 sm:px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status || 'processing'}
                      </span>
                    </div>
                    <span className={`text-xs ${themeClasses.subtext}`}>
                      #{order.id} • {new Date(order.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className="font-semibold">{getCurrencySymbol(currentCurrency)}{order.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center py-3 sm:py-4 ${themeClasses.subtext}`}>No recent orders in selected time period</p>
        )}
      </div>
      
      {/* Top Categories */}
      <div className={`rounded-xl p-3 sm:p-4 ${themeClasses.container} shadow-sm`}>
        <h2 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${themeClasses.title}`}>Popular Product Categories</h2>
        
        {metrics.topCategories.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {metrics.topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center">
                <span className={`flex-1 truncate mr-2 ${themeClasses.title}`}>{category}</span>
                <span className={`px-2 py-0.5 sm:py-1 text-xs sm:text-sm rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${themeClasses.subtext}`}>
                  {count} products
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center py-3 sm:py-4 ${themeClasses.subtext}`}>No category data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics; 