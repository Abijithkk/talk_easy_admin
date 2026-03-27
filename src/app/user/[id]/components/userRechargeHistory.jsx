"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchUserRechargeHistory } from '@/redux/slices/userSlice';

const RechargeHistoryPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;

  const { userRechargeHistory, rechargeHistoryLoading, rechargeHistoryError } = useSelector(state => state.users);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserRechargeHistory(userId));
    }
  }, [dispatch, userId]);

  // Get the recharge history data - handle both array and object formats
  const rechargeData = Array.isArray(userRechargeHistory) 
    ? userRechargeHistory 
    : userRechargeHistory?.data || userRechargeHistory?.results || [];

  if (rechargeHistoryLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading recharge history...</p>
        </div>
      </div>
    );
  }

  if (rechargeHistoryError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center text-red-600">
          <p>Failed to load recharge history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Recharge History</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Recharges: <span className="font-semibold text-gray-900">{rechargeData.length || 0}</span>
          </span>
          <span className="text-sm text-gray-600">
            Total Amount: <span className="font-semibold text-green-600">₹{calculateTotalAmount(rechargeData) || '0.00'}</span>
          </span>
        </div>
      </div>

      {!rechargeData || rechargeData.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2 text-6xl">
            ₹
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Recharge History</h3>
          <p className="text-gray-500">This user has no recharge history</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Coins Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Date & Time
                  </th>
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rechargeData.map((recharge) => (
                  <tr key={recharge.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{recharge.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">₹{recharge.amount_paid || '0.00'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recharge.coins_added || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {recharge.by_admin ? 'Admin' : 'User'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getPaymentStatusColor(recharge.is_successful ? 'success' : 'failed')
                      }`}>
                        {recharge.is_successful ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(recharge.created_at)}
                      </div>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate total amount
function calculateTotalAmount(recharges) {
  if (!recharges || recharges.length === 0) return '0.00';
  
  const total = recharges.reduce((sum, recharge) => {
    return sum + (parseFloat(recharge.amount_paid) || 0);
  }, 0);
  
  return total.toFixed(2);
}

// Helper function to format date time
function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  } catch (error) {
    return dateString;
  }
}

// Helper function to get payment status color
function getPaymentStatusColor(status) {
  switch (status) {
    case 'completed':
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default RechargeHistoryPage;