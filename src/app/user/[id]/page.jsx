'use client';
import { deleteUser, fetchUserById } from '@/redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import DeleteConfirmationModal from '@/components/layout/DeleteModal';
import CallHistoryPage from './components/userCallHistory'
export default function UserDetailPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();
  const userId = params.id;
  
  const { currentUser, userByIdLoading, userByIdError, deleteLoading, deleteError } = useSelector((state) => state.users);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId))
        .unwrap()
        .then((res) => {
          console.log("User details fetched successfully:", res);
        })
        .catch((err) => {
          console.error("Failed to fetch user details:", err);
        });
    }
  }, [dispatch, userId]);

  const handleDeleteUser = () => {
    if (!userId) return;

    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => {
        console.log("User deleted successfully");
        setDeleteSuccess(true);
        setIsDeleteModalOpen(false);
        
        // Redirect to users list after a short delay
        setTimeout(() => {
          router.push('/users');
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to delete user:", err);
      });
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  if (userByIdLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <Button 
          onClick={() => router.back()} 
          variant='secondary'
          className="mb-6"
        >
          <span className="mr-2">←</span>
          Back to Users
        </Button>
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600"></div>
          <p className="text-slate-600 mt-6 text-lg font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (userByIdError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <Button 
          onClick={() => router.back()} 
          variant='secondary'
          className="mb-6"
        >
          <span className="mr-2">←</span>
          Back to Users
        </Button>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading User</h3>
                <p className="text-red-700 mb-4">{userByIdError}</p>
                <button 
                  onClick={() => dispatch(fetchUserById(userId))}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatSeconds = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getMainStatus = (user) => {
    if (user.is_banned) return { label: 'Banned', color: 'red', icon: '🚫' };
    if (user.is_suspended) return { label: 'Suspended', color: 'yellow', icon: '⏸️' };
    if (user.is_verified && user.is_active) return { label: 'Active', color: 'green', icon: '✓' };
    return { label: 'Inactive', color: 'gray', icon: '○' };
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <Button 
          onClick={() => router.back()} 
          variant='secondary'
          className="mb-6"
        >
          <span className="mr-2">←</span>
          Back to Users
        </Button>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-slate-400 text-6xl mb-4">👤</div>
          <p className="text-slate-600 text-xl font-medium">No user data found</p>
        </div>
      </div>
    );
  }

  const status = getMainStatus(currentUser);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => router.back()} 
              variant='secondary'
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
              <p className="text-sm text-gray-500 mt-0.5">ID: {currentUser.user_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${
              status.color === 'green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              status.color === 'red' ? 'bg-red-50 text-red-700 border border-red-200' :
              status.color === 'yellow' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              {status.label}
            </div>
            
            {/* Delete Button */}
            <Button 
              onClick={openDeleteModal}
              variant="destructive"
              disabled={deleteLoading}
              className="ml-2"
            >
              {deleteLoading ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {deleteSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">User deleted successfully! Redirecting...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {deleteError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-700 font-medium">Error deleting user: {deleteError}</p>
            </div>
          </div>
        )}

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Coin Balance</div>
            <div className="text-2xl font-semibold text-gray-900">{currentUser.stats?.coin_balance?.toLocaleString() || 0}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Total Calls</div>
            <div className="text-2xl font-semibold text-gray-900">{currentUser.stats?.total_calls?.toLocaleString() || 0}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Total Duration</div>
            <div className="text-2xl font-semibold text-gray-900">{formatSeconds(currentUser.stats?.total_call_seconds || 0)}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Today's Duration</div>
            <div className="text-2xl font-semibold text-gray-900">{formatSeconds(currentUser.stats?.total_call_seconds_today || 0)}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
              User Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">User ID</div>
                <div className="text-sm text-gray-900 font-mono">{currentUser.user_id}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Internal ID</div>
                <div className="text-sm text-gray-900">{currentUser.id}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Mobile Number</div>
                <div className="text-sm text-gray-900">{currentUser.mobile_number || 'Not provided'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Email</div>
                <div className="text-sm text-gray-900 break-all">{currentUser.email || 'Not provided'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Gender</div>
                <div className="text-sm text-gray-900">{currentUser.gender || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Member Since</div>
                <div className="text-sm text-gray-900">
                  {currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
              Account Status
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verified</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  currentUser.is_verified ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentUser.is_verified ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  currentUser.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentUser.is_active ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Banned</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  currentUser.is_banned ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentUser.is_banned ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Suspended</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  currentUser.is_suspended ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentUser.is_suspended ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {currentUser.stats?.last_updated && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-500 mb-1">Last Updated</div>
                <div className="text-sm text-gray-700">
                  {new Date(currentUser.stats.last_updated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <CallHistoryPage/>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete user "${currentUser.user_id}"? This action cannot be undone and will permanently remove all user data.`}
        confirmText={deleteLoading ? "Deleting..." : "Delete User"}
        cancelText="Cancel"
        isConfirming={deleteLoading}
        type="destructive"
      />
    </div>
  );
}