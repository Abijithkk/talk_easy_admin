"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchUserRatings } from '@/redux/slices/userSlice';

const UserRatingsPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;

  const { userRatings, ratingsLoading, ratingsError } = useSelector(state => state.users);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserRatings(userId));
    }
  }, [dispatch, userId]);

  if (ratingsLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user ratings...</p>
        </div>
      </div>
    );
  }

  if (ratingsError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center text-red-600">
          <p>Failed to load user ratings</p>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating(userRatings?.results);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">User Ratings</h2>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <span className="text-sm text-gray-600">Average Rating</span>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <span className="text-sm text-gray-600">
            Total Ratings: <span className="font-semibold text-gray-900">{userRatings?.count || 0}</span>
          </span>
        </div>
      </div>

      {!userRatings?.results || userRatings.results.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Ratings Yet</h3>
          <p className="text-gray-500">This user has not received any ratings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userRatings.results.map((rating) => (
            <div key={rating.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rating.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{rating.rating}.0</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDateTime(rating.created_at)}
                </span>
              </div>
              
              {rating.comment && (
                <p className="text-sm text-gray-700 mb-3">
                  {rating.comment}
                </p>
              )}
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div>
                  <span className="font-medium">From:</span> User #{rating.rater_id || 'N/A'}
                </div>
                {rating.call_id && (
                  <div>
                    <span className="font-medium">Call ID:</span> {rating.call_id}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to calculate average rating
function calculateAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  
  const total = ratings.reduce((sum, rating) => {
    return sum + (rating.rating || 0);
  }, 0);
  
  return total / ratings.length;
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
      timeZone: 'Asia/Kolkata'
    });
  } catch (error) {
    return dateString;
  }
}

export default UserRatingsPage;