"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnverifiedExecutives,
  verifyExecutive,
} from "@/redux/slices/executiveSlice";
import { Button } from "@/components/ui/Button";
import { DataTablePagination } from "@/components/layout/Pagination";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function VerifiedExecutiveDashboard() {
  const dispatch = useDispatch();
  const [updatingExecutive, setUpdatingExecutive] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const { unverifiedExecutives, unverifiedLoading, unverifiedError } =
    useSelector((state) => state.executives);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const router = useRouter();

  const handleAddExecutive = () => {
    router.push("/executive/add");
  };
const handleToggleVerify = async (
  executiveId,
  currentStatus,
  executiveName
) => {
  // Ensure executiveId is a string
  const id = String(executiveId);

  setUpdatingExecutive(id);
  setUpdatingStatus("verify");

  try {
    // Pass both executiveId and is_verified status
    const result = await dispatch(verifyExecutive({
      executiveId: id,
      is_verified: !currentStatus // Toggle the current verification status
    })).unwrap();

    toast.success(
      `${executiveName} has been ${
        !currentStatus ? "verified" : "unverified"
      } successfully`
    );

    // Refresh the list
    dispatch(
      fetchUnverifiedExecutives({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      })
    );
  } catch (error) {
    console.error("Failed to update executive status:", error);
    toast.error(`Failed to update ${executiveName}'s status`);
  } finally {
    setUpdatingExecutive(null);
    setUpdatingStatus(null);
  }
};

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
        if (!unverifiedExecutives?.count) return 1;
        return Math.ceil(unverifiedExecutives.count / pagination.pageSize);
      },
      getCanPreviousPage: () => pagination.pageIndex > 0,
      getCanNextPage: () => {
        if (!unverifiedExecutives?.count) return false;
        return (
          (pagination.pageIndex + 1) * pagination.pageSize <
          unverifiedExecutives.count
        );
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
    [pagination, unverifiedExecutives?.count]
  );

  useEffect(() => {
    dispatch(
      fetchUnverifiedExecutives({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      })
    )
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.error("Failed to fetch unverified executives:", err);
        toast.error("Failed to load unverified executives");
      });
  }, [dispatch, pagination.pageIndex, pagination.pageSize]);

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

  // Get the executives data from unverifiedExecutives - CORRECTED
  const executivesData = unverifiedExecutives?.results || [];
  const hasExecutives = executivesData.length > 0;
  // Show loading only on initial load
  if (unverifiedLoading && executivesData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error only if there's an error and no data
  if (unverifiedError && executivesData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading unverified executives
              </h3>
              <p className="text-sm text-red-600 mt-1">{unverifiedError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-4">
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Unverified Executives
            </h1>
            {unverifiedExecutives?.count && (
              <p className="text-gray-600 mt-2">
                Showing {executivesData.length} of {unverifiedExecutives.count}{" "}
                unverified executives
              </p>
            )}
          </div>

          {/* Button Group */}
          <div className="flex items-center gap-3">
            <Button onClick={handleAddExecutive} variant="default" size="lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Executive
            </Button>
          </div>
        </div>

        {/* Executive Cards Grid */}
        {hasExecutives ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {executivesData.map((executive) => (
                <div
                  key={executive.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div
                    className={`bg-gradient-to-r ${getAvatarGradient(
                      executive.name
                    )} px-2 py-6 relative`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* Professional Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                            <span className="text-white font-bold text-xl">
                              {executive.name?.charAt(0)?.toUpperCase() || "E"}
                            </span>
                          </div>
                        </div>

                        {/* Name and Title */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-white truncate">
                            {executive.name || "Unknown Executive"}
                          </h2>
                          <p className="text-white/80 text-sm truncate">
                            {executive.profession || "Executive"}
                          </p>
                          <p className="text-white/60 text-xs font-mono mt-1 truncate">
                            {executive.executive_id || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                       {/* Toggle Buttons Row - Properly aligned */}
                  <div className="flex items-center justify-between mt-4 gap-3">
                    {/*  Status Toggle */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white/80 font-medium">
                        Verify
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVerify(
                            executive.id,
                            executive.is_verified,
                            executive.name
                          );
                        }}
                        disabled={
                          updatingExecutive === executive.id &&
                          updatingStatus === "Verify"
                        }
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-700 ${
                          executive.is_verified
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        } ${
                          updatingExecutive === executive.id &&
                          updatingStatus === "verified"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span className="sr-only">
                          {executive.is_verified ? "Verify" : "Unverify"}
                        </span>
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            executive.is_verified
                              ? "translate-x-5"
                              : "translate-x-1"
                          } ${
                            updatingExecutive === executive.id &&
                            updatingStatus === "Unverify"
                              ? "animate-pulse"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  </div>
               
                  {/* Executive Details */}
                  <div
                    className="p-6 space-y-4"
                    onClick={() => router.push(`/executive/${executive.id}`)}
                  >
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="truncate font-medium">
                          {executive.email_id || "No email"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <svg
                            className="h-4 w-4 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <span className="truncate font-medium">
                          {executive.mobile_number || "No phone"}
                        </span>
                      </div>
                    </div>

                    {/* Stats and Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Performance Metric */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 border border-blue-200">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide whitespace-nowrap">
                            Coins/Sec
                          </span>
                          <span className="text-sm font-bold text-blue-900 truncate">
                            {executive.stats?.coins_per_second || 0}
                          </span>
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                            Gender
                          </span>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {executive.gender || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          executive.status === "active" &&
                          !executive.is_verified 
                         
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : executive.is_suspended
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : executive.is_banned
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {executive.status === "active" &&
                        !executive.is_suspended &&
                        !executive.is_banned
                          ? "Active"
                          : executive.is_suspended
                          ? "Suspended"
                          : executive.is_banned
                          ? "Banned"
                          : "Inactive"}
                      </span>

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          executive.is_verified
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {executive.is_verified ? "Verified" : "Unverified"}
                      </span>

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          executive.is_online
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {executive.is_online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <DataTablePagination table={table} />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No unverified executives found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              All executives are verified or no executives have been registered
              yet.
            </p>
            <Button onClick={handleAddExecutive} variant="default" size="lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Executive
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifiedExecutiveDashboard;
