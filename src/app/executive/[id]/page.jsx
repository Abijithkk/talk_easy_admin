"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExecutiveById,
  clearCurrentExecutive,
  clearCurrentExecutiveError,
} from "@/redux/slices/executiveSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";
import BlockedUsersPage from "./components/blockedUsers";
import CallHistoryPage from "./components/exeCallHistory"
export default function ViewExecutive() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const executiveId = params.id;

  const {
    currentExecutive,
    currentExecutiveLoading,
    currentExecutiveError,
  } = useSelector((state) => state.executives);

  useEffect(() => {
    if (executiveId) {
      dispatch(fetchExecutiveById(executiveId));
    }

    return () => {
      dispatch(clearCurrentExecutive());
      dispatch(clearCurrentExecutiveError());
    };
  }, [dispatch, executiveId]);

  useEffect(() => {
    if (currentExecutiveError) {
      toast.error("Failed to fetch executive details");
    }
  }, [currentExecutiveError]);

  const handleBack = () => {
    router.back();
  };

  if (currentExecutiveLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading executive details...</p>
        </div>
      </div>
    );
  }

  if (!currentExecutive && !currentExecutiveLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Executive Not Found
          </h2>
          <Button variant='secondary' onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const executive = currentExecutive;
  const stats = executive.stats || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-4">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {executive.name?.charAt(0) || "E"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{executive.name}</h1>
                <p className="text-gray-600">Executive ID: {executive.executive_id}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    executive.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {executive.status?.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    executive.is_online 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {executive.is_online ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="secondary" onClick={handleBack}>
              ← Back
            </Button>
          </div>
        </div>

        {/* FIXED: Using flex instead of grid for better bottom alignment */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Personal Info */}
          <div className="flex-1 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Mobile Number" value={executive.mobile_number} />
                <InfoField label="Email" value={executive.email_id} />
                <InfoField label="Age" value={executive.age} />
                <InfoField label="Gender" value={executive.gender} />
                <InfoField label="Location" value={executive.place} />
                <InfoField label="Profession" value={executive.profession} />
              </div>
            </div>

            {/* Professional Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">Professional Details</h2>
              <div className="space-y-4">
                <InfoField label="Education Qualification" value={executive.education_qualification} />
                <InfoField label="Skills" value={executive.skills} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Known</label>
                  <div className="flex flex-wrap gap-2">
                    {executive.languages_known?.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>



            {/* Bank Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">Bank Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Account Number" value={executive.account_number} />
                <InfoField label="IFSC Code" value={executive.ifsc_code} />
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Status */}
          <div className="lg:w-96 space-y-6">
            {/* Performance Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">Performance Stats</h2>
              <div className="space-y-4">
                <StatCard 
                  label="Total Earnings" 
                  value={`₹${stats.total_earnings || '0.00'}`}
                  color="text-green-600"
                />
                <StatCard 
                  label="Earnings Today" 
                  value={`₹${stats.earnings_today || '0.00'}`}
                  color="text-blue-600"
                />
                <StatCard 
                  label="Pending Payout" 
                  value={`₹${stats.pending_payout || '0.00'}`}
                  color="text-orange-600"
                />
                <StatCard 
                  label="Amount Per Minute" 
                  value={`₹${stats.amount_per_min || '0.00'}`}
                  color="text-purple-600"
                />
                <StatCard 
                  label="Coins Per Second" 
                  value={stats.coins_per_second || 0}
                  color="text-indigo-600"
                />
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.total_picked_calls || 0}</div>
                    <div className="text-sm text-gray-600">Calls Picked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.total_missed_calls || 0}</div>
                    <div className="text-sm text-gray-600">Calls Missed</div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">Additional Statistics</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <StatCard 
                      label="Total On Duty Seconds" 
                      value={formatTime(stats.total_on_duty_seconds || 0)}
                      color="text-gray-600"
                    />
                    <StatCard 
                      label="Total Talk Seconds Today" 
                      value={formatTime(stats.total_talk_seconds_today || 0)}
                      color="text-gray-600"
                    />
                  </div>
                </div>

                {/* Last Updated */}
                {stats.last_updated && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 text-center">
                      Last updated: {formatDateTime(stats.last_updated)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b">Account Status</h2>
              <div className="space-y-3">
                <StatusBadge label="Verified" value={executive.is_verified} />
                <StatusBadge label="Banned" value={executive.is_banned} />
                <StatusBadge label="Suspended" value={executive.is_suspended} />
                <StatusBadge label="Logged Out" value={executive.is_logged_out} />
                <StatusBadge label="On Call" value={executive.on_call} />
              </div>
            </div>
          </div>

        </div>
      
      </div>
        <BlockedUsersPage></BlockedUsersPage>
        <CallHistoryPage></CallHistoryPage>

    </div>
  );
}

// Helper Components
function InfoField({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-bluie-900 text-sm">
        {value || "Not provided"}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value ? 'YES' : 'NO'}
      </span>
    </div>
  );
}

// Helper functions
function formatTime(seconds) {
  if (!seconds) return "0s";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  } catch (error) {
    return dateString;
  }
}