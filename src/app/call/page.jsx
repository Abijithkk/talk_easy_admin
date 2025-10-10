"use client";
import { fetchCallHistory } from '@/redux/slices/callSlice';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/Button';
import { DataTablePagination } from '@/components/layout/Pagination';
import {
  Phone,
  PhoneOff,
  Clock,
  Calendar,
  User,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import toast from 'react-hot-toast';

const CallHistory = () => {
  const dispatch = useDispatch();
  const { calls, loading, error } = useSelector((state) => state.calls);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    console.log('🔄 Component mounted - fetching call history...');
    dispatch(fetchCallHistory({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }));
  }, [dispatch, pagination.pageIndex, pagination.pageSize]);

  // Mock table object for pagination
  const table = useMemo(
    () => ({
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
        if (!calls?.count) return 1;
        return Math.ceil(calls.count / pagination.pageSize);
      },
      getCanPreviousPage: () => pagination.pageIndex > 0,
      getCanNextPage: () => {
        if (!calls?.count) return false;
        return (pagination.pageIndex + 1) * pagination.pageSize < calls.count;
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
    }),
    [pagination, calls?.count]
  );

  // Refresh call history
  const handleRefresh = () => {
    console.log('🔄 Refreshing call history...');
    dispatch(fetchCallHistory({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }))
      .unwrap()
      .then(() => {
        toast.success('Call history refreshed successfully');
      })
      .catch((err) => {
        toast.error('Failed to refresh call history');
      });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'ended':
        return {
          label: "Completed",
          icon: CheckCircle,
          className: "bg-green-50 border-green-200 text-green-700",
          iconClassName: "text-green-500",
        };
      case 'rejected':
        return {
          label: "Rejected",
          icon: XCircle,
          className: "bg-red-50 border-red-200 text-red-700",
          iconClassName: "text-red-500",
        };
      case 'missed':
        return {
          label: "Missed",
          icon: PhoneOff,
          className: "bg-orange-50 border-orange-200 text-orange-700",
          iconClassName: "text-orange-500",
        };
      case 'pending':
        return {
          label: "Pending",
          icon: AlertTriangle,
          className: "bg-yellow-50 border-yellow-200 text-yellow-700",
          iconClassName: "text-yellow-500",
        };
      default:
        return {
          label: status,
          icon: Phone,
          className: "bg-gray-50 border-gray-200 text-gray-700",
          iconClassName: "text-gray-500",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading call history
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Call History
            </h1>
            {calls?.count && (
              <p className="text-gray-600 mt-2">
                Showing {calls.results?.length || 0} of {calls.count} calls
              </p>
            )}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant='default'
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    SI NO
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Coins Deducted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Executive Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calls?.results?.map((call, index) => {
                  const statusConfig = getStatusConfig(call.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={call.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* SI NO */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {call.id}
                        </div>
                      </td>

                      {/* Channel Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {call.channel_name}
                        </div>
                      </td>

                      {/* Users */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="font-medium">User:</span>
                            <span className="ml-1">{call.user_id || 'N/A'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 text-green-500 mr-2" />
                            <span className="font-medium">Executive:</span>
                            <span className="ml-1">{call.executive_name || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Start Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(call.start_time)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(call.start_time)}
                          </div>
                        </div>
                      </td>

                      {/* End Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {call.end_time ? formatDate(call.end_time) : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {call.end_time ? formatTime(call.end_time) : 'N/A'}
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDuration(call.duration_seconds)}
                        </div>
                      </td>

                      {/* Coins Deducted */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="mr-1">🪙</span>
                          {call.coins_deducted || 0}
                        </div>
                      </td>

                      {/* Executive Earnings */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ${call.executive_earnings || "0.00"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
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
          {(!calls?.results || calls.results.length === 0) && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No call history found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There are currently no calls in the system.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {calls?.results && calls.results.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;