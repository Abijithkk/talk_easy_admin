import { Button } from '@/components/ui/Button';
import { adminRecharge, fetchPlans, clearRechargeError, clearRechargeSuccess } from '@/redux/slices/planSlice'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';

function AddCoinModal({ isOpen, onClose, onAddCoin,  }) {
  const dispatch = useDispatch();
  const { 
    plans, 
    loading, 
    rechargeLoading, 
    rechargeError, 
    rechargeSuccess 
  } = useSelector((state) => state.plans);
const params = useParams();
  const userId = params.id;
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !loading) {
      // Check if plans is empty array OR plans.results is empty array
      const hasNoPlans = Array.isArray(plans) 
        ? plans.length === 0
        : (!plans?.results || plans.results.length === 0);
      
      if (hasNoPlans) {
        dispatch(fetchPlans({ page: 1, limit: 10 }));
      }
    }
  }, [isOpen, plans, loading, dispatch]);

  // Handle recharge success
  useEffect(() => {
    if (rechargeSuccess) {
      toast.success(rechargeSuccess);
      dispatch(clearRechargeSuccess());
      handleClose();
    }
  }, [rechargeSuccess, dispatch]);

  // Handle recharge error
  useEffect(() => {
    if (rechargeError) {
      const errorMessage = typeof rechargeError === 'string' 
        ? rechargeError 
        : rechargeError.message || 'Failed to process recharge';
      
      toast.error(errorMessage);
      dispatch(clearRechargeError());
    }
  }, [rechargeError, dispatch]);

  // Fix: Handle both state structures
  const safePlans = Array.isArray(plans) 
    ? plans 
    : (Array.isArray(plans?.results) ? plans.results : []);

  const handleAdd = async () => {
    if (selectedPlan && userId) {
      const plan = safePlans.find((p) => p.id === selectedPlan);
      
      if (plan) {
        try {
          // Create recharge data
          const rechargeData = {
            user_id: userId,
            plan_id: selectedPlan
          };

          // Dispatch the recharge action
          const result = await dispatch(adminRecharge(rechargeData)).unwrap();
          
          // Show loading toast
          const loadingToast = toast.loading('Processing recharge...');
          
          // If we reach here, the recharge was successful
          toast.dismiss(loadingToast);
          toast.success(result?.message || 'Recharge completed successfully!');
          
          // Call the parent callback if provided
          if (onAddCoin) {
            onAddCoin(plan, result);
          }
          
          handleClose();
          
        } catch (error) {
          // Error is already handled by the useEffect above
          console.error('Recharge failed:', error);
        }
      } else {
        toast.error('Selected plan not found');
      }
    } else {
      if (!userId) {
        toast.error('User ID is required for recharge');
      } else {
        toast.error('Please select a plan');
      }
    }
  };

  const handleClose = () => {
    setSelectedPlan('');
    setIsDropdownOpen(false);
    
    // Clear any pending recharge states
    dispatch(clearRechargeError());
    dispatch(clearRechargeSuccess());
    
    onClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Recharge User</h2>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              disabled={rechargeLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          {userId && (
            <p className="text-sm text-gray-600 mt-1">
              Recharging for User ID: <span className="font-medium">{userId}</span>
            </p>
          )}
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a Plan
            </label>
            
            {/* Custom Dropdown */}
            <div className="relative dropdown-container">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={rechargeLoading || loading}
                className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <span className={selectedPlan ? "text-gray-800" : "text-gray-500"}>
                    {selectedPlan 
                      ? safePlans.find((p) => p.id === selectedPlan)?.plan_name || 'Unknown Plan'
                      : "Select a plan..."
                    }
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto dropdown-container">
                  {loading ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading plans...</span>
                      </div>
                    </div>
                  ) : safePlans.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No plans available. Please create plans first.
                    </div>
                  ) : (
                    safePlans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          setIsDropdownOpen(false);
                        }}
                        disabled={!plan.is_active}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition duration-150 ${
                          selectedPlan === plan.id ? 'bg-blue-50 text-blue-600' : 'text-gray-800'
                        } ${!plan.is_active ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{plan.plan_name}</span>
                          <span className="text-sm text-gray-500">₹{plan.final_price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">{plan.category_name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            plan.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          Coins: {plan.adjusted_coin_package?.toLocaleString() || '0'}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Plan Details */}
            {selectedPlan && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Selected Plan Details:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Plan Name:</span>
                    <span className="font-medium text-blue-800">
                      {safePlans.find((p) => p.id === selectedPlan)?.plan_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Price:</span>
                    <span className="font-medium text-blue-800">
                      ₹{safePlans.find((p) => p.id === selectedPlan)?.final_price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Category:</span>
                    <span className="font-medium text-blue-800">
                      {safePlans.find((p) => p.id === selectedPlan)?.category_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Coins:</span>
                    <span className="font-medium text-blue-800">
                      {safePlans.find((p) => p.id === selectedPlan)?.adjusted_coin_package?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Status:</span>
                    <span className={`font-medium ${
                      safePlans.find((p) => p.id === selectedPlan)?.is_active 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {safePlans.find((p) => p.id === selectedPlan)?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              disabled={rechargeLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAdd}
              disabled={!selectedPlan || rechargeLoading || !userId}
              isLoading={rechargeLoading}
              loadingText="Processing..."
            >
              Confirm Recharge
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-3 text-xs text-gray-500 text-center">
            {rechargeLoading && (
              <p className="text-blue-600 animate-pulse">
                Processing recharge, please wait...
              </p>
            )}
            {!userId && (
              <p className="text-red-600">
                Error: User ID is required for recharge
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCoinModal;