"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlockedUsers, updateUserStatus } from "@/redux/slices/userSlice";
import { Button } from "@/components/ui/Button";
import { DataTablePagination } from "@/components/layout/Pagination";
import {
  User,
  Ban,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  UserX,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BlockedUsersPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { 
    blockedUsers, 
    blockedUsersLoading, 
    blockedUsersError,
    updateStatusError
  } = useSelector((state) => state.users);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

  // Get the actual blocked users array
  const blockedUsersList = Array.isArray(blockedUsers) ? blockedUsers : blockedUsers?.results || blockedUsers?.data || [];

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
        return Math.ceil(blockedUsersList.length / pagination.pageSize);
      },
      getCanPreviousPage: () => pagination.pageIndex > 0,
      getCanNextPage: () => {
        return (pagination.pageIndex + 1) * pagination.pageSize < blockedUsersList.length;
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
    [pagination, blockedUsersList.length]
  );

  useEffect(() => {
    dispatch(fetchBlockedUsers())
      .unwrap()
      .then((res) => {
        console.log("Blocked users fetched successfully:", res);
      })
      .catch((err) => {
        console.error("Failed to fetch blocked users:", err);
        toast.error("Failed to load blocked users");
      });
  }, [dispatch]);

  // Handle unblock user
  const handleUnblockUser = async (userId) => {
    setStatusUpdateLoading(userId);

    try {
      const statusData = {
        is_suspended: 0,
        is_banned: false,
      };

      await dispatch(
        updateUserStatus({
          id: userId,
          statusData: statusData,
        })
      ).unwrap();

      // Refresh blocked users list after successful update
      dispatch(fetchBlockedUsers());

      toast.success("User unblocked successfully");
      console.log(`User ${userId} unblocked successfully`);
    } catch (error) {
      console.error("Failed to unblock user:", error);
      toast.error(
        `Failed to unblock user: ${error.message || "Unknown error"}`
      );
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get status configuration
  const getStatusConfig = (user) => {
    return {
      label: "Blocked",
      icon: Ban,
      className: "bg-red-50 border-red-200 text-red-700",
      iconClassName: "text-red-500",
    };
  };

  // Apply pagination
  const paginatedUsers = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return blockedUsersList.slice(start, end);
  }, [blockedUsersList, pagination.pageIndex, pagination.pageSize]);

  if (blockedUsersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (blockedUsersError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading blocked users
              </h3>
              <p className="text-sm text-red-600 mt-1">{blockedUsersError}</p>
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
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Blocked Users
                </h1>
                {blockedUsersList.length > 0 && (
                  <p className="text-gray-600 mt-2">
                    Showing {Math.min(paginatedUsers.length, pagination.pageSize)} of {blockedUsersList.length} blocked users
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Error */}
        {updateStatusError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error updating status
                </h3>
                <p className="text-sm text-red-600 mt-1">{updateStatusError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Blocked By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Executive ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Blocked Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((blockedUser, index) => {
                  const statusConfig = getStatusConfig(blockedUser);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={blockedUser.id}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/user/${blockedUser.user}`);
                      }}
                    >
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {blockedUser.id}
                        </div>
                      </td>

                      {/* User Information */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                           
                            <div className="text-sm text-gray-500">
                              {blockedUser.user_id || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Blocked By */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <Shield className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {blockedUser.executive_name || "Executive"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Executive ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                          {blockedUser.executive_id || "N/A"}
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {blockedUser.reason || "No reason provided"}
                        </div>
                      </td>

                      {/* Blocked Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(blockedUser.blocked_at)}
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

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnblockUser(blockedUser.user);
                            }}
                            disabled={statusUpdateLoading === blockedUser.user}
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 transition-colors"
                          >
                            {statusUpdateLoading === blockedUser.user ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            Unblock
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {blockedUsersList.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No blocked users found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                All users are currently active and not blocked by any executives.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {blockedUsersList.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  );
}