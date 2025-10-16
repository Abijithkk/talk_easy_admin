"use client";
import { fetchUsers, updateUserStatus } from "@/redux/slices/userSlice";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/Button";
import { DataTablePagination } from "@/components/layout/Pagination";
import {
  Coins,
  Calendar,
  Phone,
  PhoneCall,
  Clock,
  User,
  Ban,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { filterUsersByStatus, searchUsers } from "@/redux/slices/userSlice";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error, updateStatusLoading, updateStatusError } =
    useSelector((state) => state.users);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const router = useRouter();

  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

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
        if (!users?.count) return 1;
        return Math.ceil(users.count / pagination.pageSize);
      },
      getCanPreviousPage: () => pagination.pageIndex > 0,
      getCanNextPage: () => {
        if (!users?.count) return false;
        return (pagination.pageIndex + 1) * pagination.pageSize < users.count;
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
    [pagination, users?.count]
  );

  // Fetch users with current filters and pagination
  const fetchUsersWithParams = async () => {
    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    // Add search query if exists
    if (searchQuery) {
      params.search = searchQuery;
    }

    // Add status filter if not "all"
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    try {
      await dispatch(fetchUsers(params)).unwrap();
      console.log("Users fetched successfully with params:", params);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsersWithParams();
  }, [dispatch, pagination.pageIndex, pagination.pageSize, searchQuery, statusFilter]);

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setIsSearching(true);
    
    // The actual API call will be triggered by the useEffect above
    // This ensures pagination is reset when searching
  };

  // Handle status filter
  const handleStatusFilter = async (status) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setIsFiltering(true);
    
    // The actual API call will be triggered by the useEffect above
    // This ensures pagination is reset when filtering
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Handle status update
  const handleStatusUpdate = async (userId, newStatus) => {
    setStatusUpdateLoading(userId);

    try {
      const statusData = {
        is_suspended: newStatus === "suspended" ? 1 : 0,
        is_banned: newStatus === "banned",
      };

      await dispatch(
        updateUserStatus({
          id: userId,
          statusData: statusData,
        })
      ).unwrap();

      // Refresh users list after successful update with current filters
      await fetchUsersWithParams();

      toast.success(`User status updated to ${newStatus} successfully`);
      console.log(`User ${userId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error(
        `Failed to update user status: ${error.message || "Unknown error"}`
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
    });
  };

  // Get status configuration
  const getStatusConfig = (user) => {
    if (user.is_banned) {
      return {
        label: "Banned",
        icon: Ban,
        className: "bg-red-50 border-red-200 text-red-700",
        iconClassName: "text-red-500",
      };
    }

    if (user.is_suspended) {
      return {
        label: "Suspended",
        icon: AlertTriangle,
        className: "bg-yellow-50 border-yellow-200 text-yellow-700",
        iconClassName: "text-yellow-500",
      };
    }

    if (user.is_active) {
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
                Error loading users
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
              Users Management
            </h1>
            {users?.count && (
              <p className="text-gray-600 mt-2">
                Showing {users.results?.length || 0} of {users.count} users
                {(searchQuery || statusFilter !== "all") && " (filtered)"}
              </p>
            )}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or mobile..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                  <option value="inactive">Inactive</option>
                </select>
                {isFiltering && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            )}
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
                    SI NO
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Coin Balance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Calls
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Talktime
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
                {users?.results?.map((user, index) => {
                  const statusConfig = getStatusConfig(user);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/user/${user.id}`);
                      }}
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {user.user_id || "Anonymous User"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>

                      {/* Mobile Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {user.mobile_number || "N/A"}
                        </div>
                      </td>

                      {/* Coin Balance */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Coins className="h-4 w-4 mr-2" />
                          {user.stats?.coin_balance || 0}
                        </div>
                      </td>

                      {/* Total Calls */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <PhoneCall className="h-4 w-4 text-gray-400 mr-2" />
                          {user.stats?.total_calls || 0}
                        </div>
                      </td>

                      {/* Total Talktime */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          {user.stats?.total_call_seconds || 0}s
                        </div>
                      </td>

                      {/* Improved Status Section */}
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
                          {/* Show Suspend only if user is NOT banned and NOT suspended */}
                          {!user.is_banned && !user.is_suspended && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusUpdate(user.id, "suspended")
                              }
                              disabled={statusUpdateLoading === user.id}
                              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                            >
                              {statusUpdateLoading === user.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              Suspend
                            </Button>
                          )}

                          {/* Show Unsuspend only if user is suspended but NOT banned */}
                          {user.is_suspended && !user.is_banned && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusUpdate(user.id, "active")
                              }
                              disabled={statusUpdateLoading === user.id}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              {statusUpdateLoading === user.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                              ) : (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              Unsuspend
                            </Button>
                          )}

                          {/* Show Ban only if user is NOT banned */}
                          {!user.is_banned && (
                            <Button
                              size="sm"
                              variant="outlline"
                              onClick={() =>
                                handleStatusUpdate(user.id, "banned")
                              }
                              disabled={statusUpdateLoading === user.id}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                              {statusUpdateLoading === user.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                              ) : (
                                <Ban className="h-3 w-3 mr-1" />
                              )}
                              Ban
                            </Button>
                          )}

                          {/* Show Unban only if user is banned */}
                          {user.is_banned && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusUpdate(user.id, "active")
                              }
                              disabled={statusUpdateLoading === user.id}
                              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 transition-colors"
                            >
                              {statusUpdateLoading === user.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                              ) : (
                                <Ban className="h-3 w-3 mr-1" />
                              )}
                              Unban
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {(!users?.results || users.results.length === 0) && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== "all" ? "No matching users found" : "No users found"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "There are currently no users in the system."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {users?.results && users.results.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  );
}