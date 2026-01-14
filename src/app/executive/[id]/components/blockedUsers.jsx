"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlockedUsers } from '@/redux/slices/executiveSlice';
import { useParams } from 'next/navigation';

const BlockedUsersPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const executiveId = params.id;

  const { blockedUsers, blockedUsersLoading, blockedUsersError } = useSelector(state => state.executives);

  useEffect(() => {
    if (executiveId) {
      dispatch(fetchBlockedUsers(executiveId));
    }
  }, [dispatch, executiveId]);

  if (blockedUsersLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading blocked users...</p>
        </div>
      </div>
    );
  }

  if (blockedUsersError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center text-red-600">
          <p>Failed to load blocked users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Blocked Users</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Blocked: <span className="font-semibold text-gray-900">{blockedUsers?.total_blocked || 0}</span>
          </span>
          <span className="text-sm text-gray-600">
            Executive: <span className="font-semibold text-gray-900">{blockedUsers?.executive || 'N/A'}</span>
          </span>
        </div>
      </div>

      {!blockedUsers?.blocked_users || blockedUsers.blocked_users.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Blocked Users</h3>
          <p className="text-gray-500">This executive hasn't blocked any users yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blocked At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockedUsers.blocked_users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.user_id}</div>
                  </td>
                 
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {user.reason || 'No reason provided'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(user.blocked_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_blocked 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.is_blocked ? 'BLOCKED' : 'UNBLOCKED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Helper function to format date time (reuse from your main component)
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

export default BlockedUsersPage;