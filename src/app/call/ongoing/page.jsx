"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOngoingCalls,
  clearOngoingCallsError,
  clearOngoingCalls,
} from "@/redux/slices/callSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import HearingModal from "./components/hearingModal";

const OngoingCalls = () => {
  const dispatch = useDispatch();
  const { ongoingCalls, ongoingCallsLoading, ongoingCallsError } = useSelector(
    (state) => state.calls
  );

  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [hearingModalOpen, setHearingModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    dispatch(fetchOngoingCalls());

    // Set up auto-refresh every 10 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      dispatch(fetchOngoingCalls()).finally(() => setRefreshing(false));
    }, 10000);

    return () => {
      clearInterval(interval);
      dispatch(clearOngoingCalls());
    };
  }, [dispatch]);

  useEffect(() => {
    if (ongoingCallsError) {
      toast.error(
        typeof ongoingCallsError === "string"
          ? ongoingCallsError
          : "Failed to load ongoing calls",
        {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          },
        }
      );
    }
  }, [ongoingCallsError]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    dispatch(fetchOngoingCalls())
      .unwrap()
      .then(() => {
        toast.success("Calls refreshed successfully!", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
          },
        });
      })
      .finally(() => setRefreshing(false));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "joined":
        return "bg-green-100 text-green-800 border border-green-200";
      case "connecting":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "joined":
        return "📞";
      case "connecting":
        return "🔄";
      case "waiting":
        return "⏳";
      default:
        return "❓";
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "N/A", time: "N/A" };

    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString("en-IN"),
        time: date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
    } catch (error) {
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  // Action handlers
  const handleHearCall = async (call) => {
    setActionLoading(call.id);
    try {
      // Validate that the call has required data
      if (!call.channel_name || !call.token) {
        toast.error("No channel or token available for this call", {
          duration: 4000,
          position: "top-right",
        });
        return;
      }

      // Set the selected call and open modal
      setSelectedCall({
        id: call.id,
        channelName: call.channel_name,
        token: call.token, // Use the existing token from API
        executiveToken: call.executive_token, // Optional: if you need executive token
        uid: call.uid, // User ID from the call data
        calleeUid: call.callee_uid, // Callee ID from the call data
      });
      setHearingModalOpen(true);
    } catch (error) {
      console.error("Error preparing call hearing:", error);
      toast.error("Failed to initialize call hearing", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseHearingModal = () => {
    setHearingModalOpen(false);
    setSelectedCall(null);
  };

  const handleCloseCall = async (callId) => {
    setActionLoading(callId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Call ended successfully", {
        duration: 2000,
        position: "top-right",
      });
      // Refresh the calls list after closing
      dispatch(fetchOngoingCalls());
    } catch (error) {
      toast.error("Failed to end call", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Now ongoingCalls is directly the array
  const callsData = ongoingCalls || [];

  if (ongoingCallsLoading && !refreshing) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg text-gray-600">
          Loading ongoing calls...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Ongoing Calls</h1>
          {refreshing && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Refreshing...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Active: {callsData.length} calls
          </div>
          <Button
            onClick={handleManualRefresh}
            disabled={refreshing}
            variant="default"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </Button>
          {ongoingCallsError && (
            <button
              onClick={() => dispatch(clearOngoingCallsError())}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              Clear Error
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Call ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Channel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Executive Id
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  User Id
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Start Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callsData.map((call) => {
                const startTime = formatDateTime(call.start_time);

                return (
                  <tr
                    key={call.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        #{call.id || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded border">
                        {call.channel_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {call.executive || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {call.user || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          call.status
                        )}`}
                      >
                        <span className="mr-1">
                          {getStatusIcon(call.status)}
                        </span>
                        {call.status
                          ? call.status.charAt(0).toUpperCase() +
                            call.status.slice(1)
                          : "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {call.duration || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {startTime.date || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {startTime.time || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleHearCall(call)}
                          disabled={
                            actionLoading === call.id || !call.channel_name
                          }
                          className={`px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 ${
                            !call.channel_name
                              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          title={
                            !call.channel_name
                              ? "No channel available"
                              : "Listen to call"
                          }
                        >
                          {actionLoading === call.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white"></div>
                          ) : (
                            <span>👂</span>
                          )}
                          <span>Hear</span>
                        </button>
                        <button
                          onClick={() => handleCloseCall(call.id)}
                          disabled={actionLoading === call.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          {actionLoading === call.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white"></div>
                          ) : (
                            <span>📞</span>
                          )}
                          <span>Close</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {callsData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📞</div>
            <div className="text-gray-500 text-lg">No ongoing calls</div>
            <div className="text-gray-400 text-sm mt-2">
              Active calls will appear here in real-time
            </div>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-2 shadow-lg">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>Auto-refresh every 10s</span>
      </div>
      <HearingModal
        isOpen={hearingModalOpen}
        onClose={handleCloseHearingModal}
        channelName={selectedCall?.channelName}
        callId={selectedCall?.id}
        token={selectedCall?.token}
        executiveToken={selectedCall?.executiveToken}
        uid={selectedCall?.uid}
        calleeUid={selectedCall?.calleeUid}
      />
    </div>
  );
};

export default OngoingCalls;
