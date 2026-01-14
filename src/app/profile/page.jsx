'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchAllSessions,
  revokeSession,
  clearAllAdminProfileStates,
  clearRevokeSuccess,
} from '@/redux/slices/adminProfileSlice';
import { Button } from '@/components/ui/Button';
import DeleteConfirmationModal from '@/components/layout/DeleteModal';

const SessionsPage = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Revoke'
  });

  // Get state from Redux store
  const {
    allSessions,
    allSessionsLoading,
    revokeLoading,
    allSessionsError,
    revokeError,
    revokeSuccess,
  } = useSelector((state) => state.adminProfile);

  // Fetch all sessions
  useEffect(() => {
    dispatch(fetchAllSessions());
  }, [dispatch]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (allSessionsError) {
      toast.error(`Failed to load all sessions: ${allSessionsError}`);
    }
    if (revokeError) {
      toast.error(`Failed to revoke session: ${revokeError}`);
    }
  }, [allSessionsError, revokeError]);

  // Handle success messages with toast notifications
  useEffect(() => {
    if (revokeSuccess) {
      toast.success(revokeSuccess);
      dispatch(clearRevokeSuccess());
      // Refresh data after successful revoke
      dispatch(fetchAllSessions());
    }
  }, [revokeSuccess, dispatch]);

  // Clear all states when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllAdminProfileStates());
    };
  }, [dispatch]);

  // Handler functions with modal confirmation
  const handleRevokeSession = (session) => {
    setModalConfig({
      title: 'Revoke Session',
      message: `Are you sure you want to revoke the session from ${session.device_name || 'Unknown Device'}? This will log out the user from this device.`,
      onConfirm: () => {
        dispatch(revokeSession(session.id));
        setModalOpen(false);
      },
      confirmText: 'Revoke Session'
    });
    setModalOpen(true);
  };

  // Format duration for display
  const formatDuration = (duration) => {
    if (!duration) return 'Unknown';
    
    // If duration is in seconds, convert to readable format
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    
    return duration;
  };

  // Get device icon based on device type
  const getDeviceIcon = (deviceType) => {
    const icons = {
      desktop: '💻',
      mobile: '📱',
      tablet: '📟',
    };
    return icons[deviceType] || '🖥️';
  };

  // Extract data from the response structure
  const sessionsByAdmin = allSessions?.sessions_by_admin || [];
  const totalSessions = allSessions?.total_sessions || 0;
  const totalAdmins = allSessions?.total_admins || 0;

  // Calculate session statistics from the actual data
  const getAllSessions = () => {
    return sessionsByAdmin.flatMap(admin => admin.sessions || []);
  };

  const allSessionsList = getAllSessions();
  
  const sessionStats = {
    totalSessions,
    totalAdmins,
    desktop: allSessionsList.filter(s => s.device_type === 'desktop').length,
    mobile: allSessionsList.filter(s => s.device_type === 'mobile').length,
    tablet: allSessionsList.filter(s => s.device_type === 'tablet').length,
    active: allSessionsList.filter(s => s.is_active).length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      {/* Header with Stats Summary at top */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Management</h1>
            <p className="text-gray-600">
              Monitor and manage active admin sessions across all devices
            </p>
          </div>
          
          {/* Stats Summary - Improved Design */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 min-w-[400px]">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sessionStats.totalSessions}</div>
                <div className="text-gray-600 text-sm font-medium">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sessionStats.totalAdmins}</div>
                <div className="text-gray-600 text-sm font-medium">Active Admins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{sessionStats.active}</div>
                <div className="text-gray-600 text-sm font-medium">Active Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{sessionStats.desktop}</div>
                <div className="text-gray-600 text-sm font-medium">Desktop</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{sessionStats.mobile}</div>
                <div className="text-gray-600 text-sm font-medium">Mobile</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{sessionStats.tablet}</div>
                <div className="text-gray-600 text-sm font-medium">Tablet</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-8xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              All Admin Sessions
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {totalSessions} active session{totalSessions !== 1 ? 's' : ''} across {totalAdmins} admin{totalAdmins !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => dispatch(fetchAllSessions())}
              variant="secondary"
              disabled={allSessionsLoading}
            >
              {allSessionsLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Sessions List by Admin */}
        <div className="space-y-8">
          {sessionsByAdmin.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">🔒</div>
              <div className="text-gray-500 text-lg font-medium">No active sessions found</div>
              <div className="text-gray-400 text-sm mt-1">All admin sessions have been logged out</div>
            </div>
          ) : (
            sessionsByAdmin.map((admin, adminIndex) => (
              <div key={admin.admin_email || adminIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Admin Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{admin.admin_name}</h3>
                      <p className="text-gray-600 text-sm">{admin.admin_email}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {admin.active_sessions} active session{admin.active_sessions !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin's Sessions */}
                <div className="divide-y divide-gray-200">
                  {admin.sessions && admin.sessions.map((session, sessionIndex) => (
                    <div 
                      key={session.id || sessionIndex} 
                      className="bg-white p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Session Info */}
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl flex-shrink-0">
                              {getDeviceIcon(session.device_type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <h4 className="text-md font-semibold text-gray-900 truncate">
                                  {session.device_name || 'Unknown Device'}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {session.is_current && (
                                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                      Current Session
                                    </span>
                                  )}
                                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    session.is_active 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {session.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center space-x-2 min-w-0">
                                  <span className="text-gray-500 flex-shrink-0">🌐</span>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-700 truncate">{session.browser || 'Unknown'}</div>
                                    <div className="text-gray-500 text-xs">Browser</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 min-w-0">
                                  <span className="text-gray-500 flex-shrink-0">💻</span>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-700 truncate">{session.os || 'Unknown'}</div>
                                    <div className="text-gray-500 text-xs">Operating System</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 min-w-0">
                                  <span className="text-gray-500 flex-shrink-0">📡</span>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-700 truncate">{session.ip_address || 'Unknown'}</div>
                                    <div className="text-gray-500 text-xs">IP Address</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 min-w-0">
                                  <span className="text-gray-500 flex-shrink-0">⏰</span>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-700 truncate">
                                      {session.login_time ? new Date(session.login_time).toLocaleDateString() : 'Unknown'}
                                    </div>
                                    <div className="text-gray-500 text-xs">Login Date</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 min-w-0">
                                  <span className="text-gray-500 flex-shrink-0">🕒</span>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-700 truncate">
                                      {session.login_time ? new Date(session.login_time).toLocaleTimeString() : 'Unknown'}
                                    </div>
                                    <div className="text-gray-500 text-xs">Login Time</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 min-w-0">
                                  <span className="text-gray-500 flex-shrink-0">⏱️</span>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-700 truncate">
                                      {formatDuration(session.session_duration)}
                                    </div>
                                    <div className="text-gray-500 text-xs">Duration</div>
                                  </div>
                                </div>
                              </div>
                              
                              {session.last_activity && (
                                <div className="mt-3 text-xs text-gray-500">
                                  Last activity: {new Date(session.last_activity).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-4 lg:mt-0 lg:ml-6 flex justify-end">
                          <Button
                            onClick={() => handleRevokeSession(session)}
                            disabled={revokeLoading}
                            variant="delete"
                            size="sm"
                          >
                            {revokeLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Revoking...
                              </>
                            ) : (
                              'Revoke Session'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isLoading={revokeLoading}
      />
    </div>
  );
};

export default SessionsPage;