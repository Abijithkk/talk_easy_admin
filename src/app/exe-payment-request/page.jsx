"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExecutivePaymentRequests,
  updateExecutivePaymentRequest,
  clearExecutivePaymentsError
} from '@/redux/slices/exePaymentRequestSlice';
import toast from 'react-hot-toast';
import ConfirmationModal from './components/confirmationModal';

const ExecutivePaymentRequests = () => {
  const dispatch = useDispatch();
  const {
    executivePaymentRequests, 
    loading,
    error,
    updateLoading
  } = useSelector(state => state.executivePaymentRequest);

  const [updatingId, setUpdatingId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState({ requestId: null, newStatus: null });
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(fetchExecutivePaymentRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to load payment requests', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        }
      });
    }
  }, [error]);

  const handleStatusChange = (requestId, currentStatus, newStatus) => {
    const request = executivePaymentRequests.find(req => req.id === requestId);
    setSelectedRequest(request);
    setPendingUpdate({ requestId, newStatus });
    
    if (currentStatus === newStatus) {
      return;
    }

    // Show confirmation for status changes away from pending
    if (currentStatus !== newStatus && newStatus !== 'pending') {
      setShowConfirmation(true);
    } else {
      // Direct update for pending or same status
      executeStatusUpdate(requestId, newStatus);
    }
  };

  const executeStatusUpdate = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      await dispatch(updateExecutivePaymentRequest({ 
        id: requestId, 
        status: newStatus 
      })).unwrap();
      
      // Success toast with different styles based on status
      const toastConfig = {
        approved: {
          message: 'Payment request approved successfully!',
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          }
        },
        rejected: {
          message: 'Payment request rejected.',
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          }
        },
        paid: {
          message: 'Payment marked as paid!',
          style: {
            background: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #dbeafe',
          }
        },
        pending: {
          message: 'Status updated to pending.',
          style: {
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fef3c7',
          }
        }
      };

      toast.success(toastConfig[newStatus]?.message || 'Status updated successfully!', {
        duration: 3000,
        position: 'top-right',
        style: toastConfig[newStatus]?.style
      });

    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        }
      });
    } finally {
      setUpdatingId(null);
      setShowConfirmation(false);
      setPendingUpdate({ requestId: null, newStatus: null });
      setSelectedRequest(null);
    }
  };

  const confirmUpdate = () => {
    if (pendingUpdate.requestId && pendingUpdate.newStatus) {
      executeStatusUpdate(pendingUpdate.requestId, pendingUpdate.newStatus);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmation(false);
    setPendingUpdate({ requestId: null, newStatus: null });
    setSelectedRequest(null);
    toast('Status update cancelled', {
      duration: 2000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#f8fafc',
        color: '#475569',
        border: '1px solid #e2e8f0',
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': 
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected': 
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'paid': 
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: 
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'paid': return '💰';
      default: return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg text-gray-600">Loading payment requests...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Executive Payment Requests</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Total: {executivePaymentRequests?.length || 0} requests
          </div>
          {error && (
            <button 
              onClick={() => dispatch(clearExecutivePaymentsError())}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
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
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Executive
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  UPI Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Requested At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {executivePaymentRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">#{request.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.executive_name}</div>
                      <div className="text-sm text-gray-500">ID: {request.executive}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">
                      ₹{request.redemption_amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded border">
                      {request.upi_details || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      <span className="mr-1">{getStatusIcon(request.status)}</span>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.requested_at).toLocaleDateString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(request.requested_at).toLocaleTimeString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, request.status, e.target.value)}
                        disabled={updatingId === request.id}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="paid">Paid</option>
                      </select>
                      {updatingId === request.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {executivePaymentRequests?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💸</div>
            <div className="text-gray-500 text-lg">No payment requests found</div>
            <div className="text-gray-400 text-sm mt-2">
              All payment requests will appear here
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
       <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={confirmUpdate}
        onCancel={cancelUpdate}
        message="Are you sure you want to update the status of this payment request?"
      />
    </div>
  );
};

export default ExecutivePaymentRequests;