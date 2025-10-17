"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExecutivesAnalytics,
  fetchUsersAnalytics,
  fetchCallsAnalytics,
  fetchPaymentsAnalytics,
  clearAllDashboardStates
} from '@/redux/slices/dashboardSlice';
import { 
  FiUsers, 
  FiUserCheck, 
  FiUserX, 
  FiPhone, 
  FiPhoneOff, 
  FiClock,
  FiTrendingUp,
  FiActivity,
  FiBarChart2,
  FiCreditCard
} from 'react-icons/fi';
import { 
  RiUserStarLine, 
  RiUserSharedLine, 
  RiMoneyRupeeCircleLine,
  RiCoinsLine
} from 'react-icons/ri';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, status }) => {
  const statusColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
    warning: "text-orange-600"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`inline-flex items-center mt-2 text-xs font-medium ${statusColors[status] || statusColors.neutral}`}>
              {trend}
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gray-50 text-gray-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, description, icon: Icon, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-50 text-gray-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

const ProgressMetric = ({ label, value, total, color = "blue" }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{value} / {total}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const DashboardConsole = () => {
  const dispatch = useDispatch();
  const dashboardState = useSelector(state => state.dashboard);

  useEffect(() => {
    console.log('🔄 Starting to fetch all analytics data...');
    
    dispatch(fetchExecutivesAnalytics());
    dispatch(fetchUsersAnalytics());
    dispatch(fetchCallsAnalytics());
    dispatch(fetchPaymentsAnalytics());

    return () => {
      dispatch(clearAllDashboardStates());
    };
  }, [dispatch]);

  const isLoading = 
    dashboardState.executivesAnalyticsLoading || 
    dashboardState.usersAnalyticsLoading || 
    dashboardState.callsAnalyticsLoading || 
    dashboardState.paymentsAnalyticsLoading;

  const hasData = 
    dashboardState.executivesAnalytics && 
    dashboardState.usersAnalytics && 
    dashboardState.callsAnalytics && 
    dashboardState.paymentsAnalytics;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const { executivesAnalytics, usersAnalytics, callsAnalytics, paymentsAnalytics } = dashboardState;

  const executiveActivityRate = executivesAnalytics.total_executives > 0 
    ? (executivesAnalytics.active_executives / executivesAnalytics.total_executives) * 100 
    : 0;

  const userActivityRate = usersAnalytics.total_users > 0 
    ? (usersAnalytics.active_users / usersAnalytics.total_users) * 100 
    : 0;

  const callAnswerRate = callsAnalytics.total_calls > 0 
    ? ((callsAnalytics.total_calls - callsAnalytics.total_missed_calls) / callsAnalytics.total_calls) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of platform performance</p>
        </div>

        {/* Executive Overview */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <RiUserStarLine className="text-gray-700 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Executive Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Executives"
              value={executivesAnalytics.total_executives}
              subtitle="Registered accounts"
              icon={FiUsers}
            />
            <StatCard
              title="Active Executives"
              value={executivesAnalytics.active_executives}
              subtitle="Currently working"
              icon={FiUserCheck}
              status="positive"
            />
            <StatCard
              title="Online Executives"
              value={executivesAnalytics.online_executives}
              subtitle="Available for calls"
              icon={FiActivity}
              status={executivesAnalytics.online_executives > 0 ? "positive" : "negative"}
            />
            <StatCard
              title="New Executives"
              value={executivesAnalytics.recently_joined_last_10_days}
              subtitle="Last 10 days"
              icon={RiUserSharedLine}
            />
          </div>
        </div>

        {/* User Management */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FiUsers className="text-gray-700 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={usersAnalytics.total_users}
              subtitle="Registered accounts"
              icon={FiUsers}
            />
            <StatCard
              title="Active Users"
              value={usersAnalytics.active_users}
              subtitle="Currently online"
              icon={FiUserCheck}
              status="positive"
            />
            <StatCard
              title="Banned Users"
              value={usersAnalytics.banned_users}
              subtitle="Permanently restricted"
              icon={FiUserX}
              status="negative"
            />
            <StatCard
              title="Suspended Users"
              value={usersAnalytics.suspended_users}
              subtitle="Temporary restrictions"
              icon={FiUserX}
              status="warning"
            />
          </div>
        </div>

        {/* Call Analytics */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FiPhone className="text-gray-700 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Call Analytics</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Call Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <MetricCard
                    title="Total Calls"
                    value={callsAnalytics.total_calls}
                    icon={FiBarChart2}
                    color="blue"
                  />
                  <MetricCard
                    title="Today's Calls"
                    value={callsAnalytics.today_calls}
                    icon={FiActivity}
                    color="green"
                  />
                  <MetricCard
                    title="Missed Calls"
                    value={callsAnalytics.total_missed_calls}
                    icon={FiPhoneOff}
                    color="red"
                  />
                  <MetricCard
                    title="Talk Time"
                    value={`${callsAnalytics.total_talk_time_minutes}m`}
                    icon={FiClock}
                    color="blue"
                  />
                </div>
                <div className="space-y-4">
                  <ProgressMetric
                    label="Call Answer Rate"
                    value={callsAnalytics.total_calls - callsAnalytics.total_missed_calls}
                    total={callsAnalytics.total_calls}
                    color="green"
                  />
                  <ProgressMetric
                    label="Missed Call Rate"
                    value={callsAnalytics.total_missed_calls}
                    total={callsAnalytics.total_calls}
                    color="red"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Today's Activity</h3>
                <div className="space-y-3">
                  <MetricCard
                    title="Calls Today"
                    value={callsAnalytics.today_calls}
                    icon={FiPhone}
                    color="blue"
                  />
                  <MetricCard
                    title="Missed Today"
                    value={callsAnalytics.today_missed_calls}
                    icon={FiPhoneOff}
                    color="red"
                  />
                  <MetricCard
                    title="Talk Time Today"
                    value={`${callsAnalytics.today_talk_time_minutes}m`}
                    icon={FiClock}
                    color="green"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Payments */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <RiMoneyRupeeCircleLine className="text-gray-700 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Revenue & Payments</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Financial Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <MetricCard
                    title="Total Revenue"
                    value={`₹${paymentsAnalytics.total_revenue}`}
                    icon={RiMoneyRupeeCircleLine}
                    color="green"
                  />
                  <MetricCard
                    title="Today's Revenue"
                    value={`₹${paymentsAnalytics.today_revenue}`}
                    icon={FiTrendingUp}
                    color="green"
                  />
                  <MetricCard
                    title="Coin Sales"
                    value={paymentsAnalytics.total_coin_sales}
                    icon={RiCoinsLine}
                    color="blue"
                  />
                  <MetricCard
                    title="Admin Spent"
                    value={`₹${paymentsAnalytics.admin_spent_amount}`}
                    icon={FiCreditCard}
                    color="orange"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Net Revenue</p>
                    <p className="text-lg font-semibold text-green-600">
                      ₹{paymentsAnalytics.total_revenue - paymentsAnalytics.admin_spent_amount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">After admin expenses</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Admin Coins Spent</p>
                    <p className="text-lg font-semibold text-orange-600">
                      {paymentsAnalytics.admin_coins_spent}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total coins utilized</p>
                  </div>
                </div>
              </div>
            </div>
          
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Executive Availability</span>
                <span className={`text-sm font-medium ${
                  executivesAnalytics.online_executives > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {executivesAnalytics.online_executives > 0 ? 'Operational' : 'No Executives Online'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">User Activity</span>
                <span className={`text-sm font-medium ${
                  usersAnalytics.active_users > 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {usersAnalytics.active_users > 0 ? 'Active' : 'Low'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Call Performance</span>
                <span className={`text-sm font-medium ${
                  callAnswerRate > 50 ? 'text-green-600' : callAnswerRate > 25 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {callAnswerRate > 50 ? 'Good' : callAnswerRate > 25 ? 'Fair' : 'Poor'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Revenue Status</span>
                <span className={`text-sm font-medium ${
                  paymentsAnalytics.today_revenue > 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {paymentsAnalytics.today_revenue > 0 ? 'Generating' : 'No Revenue Today'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Quick Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Active Executive Rate</span>
                <span className="text-sm font-medium text-gray-900">{executiveActivityRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">User Activity Rate</span>
                <span className="text-sm font-medium text-gray-900">{userActivityRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Call Answer Rate</span>
                <span className="text-sm font-medium text-gray-900">{callAnswerRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Avg. Talk Time</span>
                <span className="text-sm font-medium text-gray-900">
                  {callsAnalytics.total_calls > 0 
                    ? (callsAnalytics.total_talk_time_minutes / callsAnalytics.total_calls).toFixed(1) + 'm' 
                    : '0m'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardConsole;