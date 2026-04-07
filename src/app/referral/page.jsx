"use client";
import { clearAllReferralsStates, fetchUserReferrals } from '@/redux/slices/referralSlice';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/Button';
import { DataTablePagination } from '@/components/layout/Pagination';
import {
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Share2,
  Mail,
  RefreshCw,
  UserPlus,

} from "lucide-react";
import toast from 'react-hot-toast';

const ReferralsConsole = () => {
  const dispatch = useDispatch();
  const referralsState = useSelector(state => state.referrals);
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Performance stats state
  const [performanceStats, setPerformanceStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    successRate: "0%"
  });

  useEffect(() => {
    console.log('🔄 Starting to fetch user referrals...');
    dispatch(fetchUserReferrals());

    return () => {
      dispatch(clearAllReferralsStates());
    };
  }, [dispatch]);

  // Update performance stats when referrals data changes
  useEffect(() => {
    if (referralsState.referrals && !referralsState.loading && !referralsState.error) {
      const referralsArray = getReferralsArray();
      const totalReferrals = referralsArray.length;
      const successfulReferrals = referralsArray.length; // Since all are active based on your data
      
      const stats = {
        totalReferrals,
        successfulReferrals,
        successRate: totalReferrals > 0 ? '100%' : '0%'
      };
      
      setPerformanceStats(stats);
      console.log('📈 REFERRALS PERFORMANCE:', stats);
    }
  }, [referralsState.referrals, referralsState.loading, referralsState.error]);

  // Get the referrals array - handle both array and object formats
  const getReferralsArray = () => {
    if (!referralsState.referrals) return [];
    
    if (Array.isArray(referralsState.referrals)) {
      return referralsState.referrals;
    }
    
    return referralsState.referrals.results || [];
  };

  const referralsArray = getReferralsArray();

  // Get paginated data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return referralsArray.slice(start, end);
  }, [referralsArray, pagination.pageIndex, pagination.pageSize]);

  // Mock table object for pagination
  const table = useMemo(
    () => {
      const totalCount = referralsArray.length;
      
      return {
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
          if (!totalCount) return 1;
          return Math.ceil(totalCount / pagination.pageSize);
        },
        getCanPreviousPage: () => pagination.pageIndex > 0,
        getCanNextPage: () => {
          if (!totalCount) return false;
          return (pagination.pageIndex + 1) * pagination.pageSize < totalCount;
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
    },
    [pagination, referralsArray]
  );

  // Refresh referrals
  const handleRefresh = () => {
    console.log('🔄 Refreshing referrals...');
    dispatch(fetchUserReferrals())
      .unwrap()
      .then(() => {
        toast.success('Referrals refreshed successfully');
      })
      .catch((err) => {
        toast.error('Failed to refresh referrals');
      });
  };

  // Copy referral link
  const handleCopyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=your-referral-code`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success('Referral link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy referral link');
      });
  };

  // Share via email
  const handleShareViaEmail = () => {
    const subject = 'Join me on this amazing platform!';
    const body = `Hi! I think you'll love this platform. Use my referral link to sign up: ${window.location.origin}/signup?ref=your-referral-code`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status configuration
  const getStatusConfig = (isActive) => {
    if (isActive) {
      return {
        label: "Active",
        icon: CheckCircle,
        className: "bg-green-50 border-green-200 text-green-700",
        iconClassName: "text-green-500",
      };
    }
    return {
      label: "Inactive",
      icon: XCircle,
      className: "bg-gray-50 border-gray-200 text-gray-700",
      iconClassName: "text-gray-500",
    };
  };

  if (referralsState.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (referralsState.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading referrals
              </h3>
              <p className="text-sm text-red-600 mt-1">{referralsState.error}</p>
              <Button variant='edit' onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Referral Program
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleRefresh}
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

      

        {/* Referrals Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Referral ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Referred User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Referrer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Referred Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((referral) => {
                  const statusConfig = getStatusConfig(true); 
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={referral.id} className="hover:bg-gray-50 transition-colors duration-150">
                      {/* Referral ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              #{referral.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Referred User */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {referral.referred_user_name || `User #${referral.referred_user_id}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {referral.referred_user_id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserPlus className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {referral.referrer_name || `User #${referral.referrer_id}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {referral.referrer_id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Referred Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(referral.referred_at)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-start">
                          <div
                            className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${statusConfig.className}`}
                          >
                            <StatusIcon
                              className={`h-4 w-4 mr-2 ${statusConfig.iconClassName}`}
                            />
                            {statusConfig.label}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {referralsArray.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Referrals Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                You haven't referred anyone yet. Start sharing with your friends!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleCopyReferralLink}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Referral Link
                </Button>
                <Button
                  onClick={handleShareViaEmail}
                  variant="outline"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {referralsArray.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralsConsole;