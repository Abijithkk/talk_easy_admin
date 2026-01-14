"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchExecutiveProfilePictures, 
  approveExecutiveProfilePicture,
  rejectExecutiveProfilePicture,
//   deleteExecutiveProfilePicture 
} from '@/redux/slices/executiveProfileSlice';
import { Button } from '@/components/ui/Button';
import { DataTablePagination } from '@/components/layout/Pagination';
import { toast } from 'react-hot-toast';
import { Check, X, Trash2, Image, Clock, User, RefreshCw, MoreVertical } from 'lucide-react';

const ExecutiveProfilePicturesPage = () => {
  const dispatch = useDispatch();
  const { 
    profilePictures = {},
    loading,
    error 
  } = useSelector(state => state.executiveProfile);

  const [selectedPictureId, setSelectedPictureId] = useState(null);
  const [updatingPicture, setUpdatingPicture] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 12,
  });

  // Fetch all executive profile pictures on component mount
  useEffect(() => {
    dispatch(fetchExecutiveProfilePictures({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize
    }));
  }, [dispatch, pagination.pageIndex, pagination.pageSize]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // Mock table object for pagination
  const table = {
    getState: () => ({
      pagination,
    }),
    setPageIndex: (pageIndex) => {
      setPagination((prev) => ({ ...prev, pageIndex }));
    },
    setPageSize: (pageSize) => {
      setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
    },
    getPageCount: () => {
      if (!profilePictures?.count) return 1;
      return Math.ceil(profilePictures.count / pagination.pageSize);
    },
    getCanPreviousPage: () => pagination.pageIndex > 0,
    getCanNextPage: () => {
      if (!profilePictures?.count) return false;
      return (pagination.pageIndex + 1) * pagination.pageSize < profilePictures.count;
    },
    previousPage: () => {
      setPagination((prev) => ({
        ...prev,
        pageIndex: Math.max(0, prev.pageIndex - 1),
      }));
    },
    nextPage: () => {
      setPagination((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex + 1,
      }));
    },
  };

  // Handle approve function - FIXED
  const handleApprove = async (pictureId) => {
    setUpdatingPicture(pictureId);
    setOpenMenuId(null);
    try {
      await dispatch(approveExecutiveProfilePicture(pictureId)).unwrap();
      toast.success('Profile picture approved successfully');
      
      // Optional: Refresh data to ensure consistency
      dispatch(fetchExecutiveProfilePictures({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
      }));
    } catch (err) {
      console.error('Failed to approve picture:', err);
      toast.error(err?.message || 'Failed to approve profile picture');
    } finally {
      setUpdatingPicture(null);
    }
  };

  // Handle reject function - FIXED
  const handleReject = async (pictureId) => {
    setUpdatingPicture(pictureId);
    setOpenMenuId(null);
    try {
      await dispatch(rejectExecutiveProfilePicture(pictureId)).unwrap();
      toast.success('Profile picture rejected successfully');
      
      // Optional: Refresh data to ensure consistency
      dispatch(fetchExecutiveProfilePictures({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
      }));
    } catch (err) {
      console.error('Failed to reject picture:', err);
      toast.error(err?.message || 'Failed to reject profile picture');
    } finally {
      setUpdatingPicture(null);
    }
  };

  // Handle delete function - FIXED
//   const handleDelete = async (pictureId) => {
//     setUpdatingPicture(pictureId);
//     setOpenMenuId(null);
//     try {
//       await dispatch(deleteExecutiveProfilePicture(pictureId)).unwrap();
//       toast.success('Profile picture deleted successfully');
      
//       // Refresh data since we removed an item
//       dispatch(fetchExecutiveProfilePictures({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize
//       }));
//     } catch (err) {
//       console.error('Failed to delete picture:', err);
//       toast.error(err?.message || 'Failed to delete profile picture');
//     } finally {
//       setUpdatingPicture(null);
//     }
//   };

  // Function to generate gradient based on name
  const getAvatarGradient = (name) => {
    const colors = [
      "from-slate-500 to-slate-700",
      "from-gray-500 to-gray-700",
      "from-zinc-500 to-zinc-700",
      "from-neutral-500 to-neutral-700",
      "from-stone-500 to-stone-700",
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        icon: Clock,
        label: 'Pending Review'
      },
      approved: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        icon: Check,
        label: 'Approved'
      },
      rejected: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        icon: X,
        label: 'Rejected'
      }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile pictures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error loading profile pictures
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
          <Button
            onClick={() => dispatch(fetchExecutiveProfilePictures({
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize
            }))}
            variant="outline"
            className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Picture Approvals
            </h1>
            {profilePictures?.count && (
              <p className="text-gray-600">
                Showing <span className="font-semibold">{profilePictures.results?.length || 0}</span> of{" "}
                <span className="font-semibold">{profilePictures.count}</span> profile pictures
              </p>
            )}
          </div>
          
          {/* Refresh Button */}
          <Button
            onClick={() => dispatch(fetchExecutiveProfilePictures({
              page: pagination.pageIndex + 1,
              limit: pagination.pageSize
            }))}
            variant="outline"
            size="lg"
            disabled={loading}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Profile Pictures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {profilePictures?.results?.map((picture) => {
            const statusConfig = getStatusBadge(picture.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={picture.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] relative"
              >
                {/* Status Badge - Top Right */}
                <div className="absolute top-3 right-3 z-10">
                  <div className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm backdrop-blur-sm`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`}></span>
                    {statusConfig.label}
                  </div>
                </div>

                {/* Profile Picture Display - Fixed Size with Proper Aspect Ratio */}
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  {picture.profile_photo_url ? (
                    <img
                      src={picture.profile_photo_url}
                      alt={`${picture.executive_name}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${picture.profile_photo_url ? 'hidden' : 'flex'}`}>
                    <Image className="w-16 h-16 mb-2" />
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4">
                  {/* Executive Info */}
                  <div className="mb-3">
                    <h2 className="text-lg font-bold text-gray-900 truncate mb-1">
                      {picture.executive_name || "Unknown Executive"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Created {new Date(picture.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>

                  {/* Action Buttons - Modern Inline Approach */}
                  <div className="flex items-center gap-2">
                    {picture.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleApprove(picture.id)}
                          variant="default"
                          size="sm"
                          disabled={updatingPicture === picture.id}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-sm"
                        >
                          {updatingPicture === picture.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mx-auto"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1.5" />
                              Approve
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => handleReject(picture.id)}
                          variant="outline"
                          size="sm"
                          disabled={updatingPicture === picture.id}
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black font-medium transition-colors"
                        >
                          {updatingPicture === picture.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mx-auto"></div>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1.5" />
                              Reject
                            </>
                          )}
                        </Button>
                      </>
                    )}

                    {picture.status !== 'pending' && (
                      <div className="flex-1 text-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">No actions available</span>
                      </div>
                    )}

                    {/* Delete Button - Icon Only */}
                    {/* <Button
                      onClick={() => handleDelete(picture.id)}
                      variant="outline"
                      size="sm"
                      disabled={updatingPicture === picture.id}
                      className="border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors p-2"
                      title="Delete"
                    >
                      {updatingPicture === picture.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {(!profilePictures?.results || profilePictures.results.length === 0) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              No profile pictures found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              All profile picture requests have been processed or there are no pending approvals at the moment.
            </p>
            <Button
              onClick={() => dispatch(fetchExecutiveProfilePictures({
                page: 1,
                limit: pagination.pageSize
              }))}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}

        {/* Pagination Component */}
        {profilePictures?.results && profilePictures.results.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveProfilePicturesPage;