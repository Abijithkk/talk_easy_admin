import React, { useState, useEffect } from 'react';
import { X, IndianRupee, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDispatch } from 'react-redux';
import { createRedemptionOption, updateRedemptionOption, fetchRedemptionOptions } from '@/redux/slices/paymentSlice';
import toast from 'react-hot-toast';

const ConversionModal = ({ 
  isOpen, 
  onClose, 
  mode = 'add', 
  initialData = null 
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          amount: initialData.amount?.toString() || '',
          is_active: initialData.is_active ?? true
        });
      } else {
        setFormData({
          amount: '',
          is_active: true
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a valid positive number';
    } else if (parseFloat(formData.amount) > 1000000) {
      newErrors.amount = 'Amount cannot exceed ₹10,00,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const submitData = {
        amount: parseFloat(formData.amount),
        is_active: formData.is_active
      };

      if (mode === 'add') {
        // Create new redemption option
        const result = await dispatch(createRedemptionOption(submitData)).unwrap();
        toast.success('Redemption option created successfully!');
      } else {
        // Update existing redemption option
        const result = await dispatch(updateRedemptionOption({
          id: initialData.id,
          data: submitData
        })).unwrap();
        toast.success('Redemption option updated successfully!');
      }

      // Refresh the redemption options list
      await dispatch(fetchRedemptionOptions()).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error?.message || `Failed to ${mode === 'add' ? 'create' : 'update'} redemption option`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'add' ? 'Add Redemption Option' : 'Edit Redemption Option'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'add' 
                ? 'Create a new redemption option' 
                : `Update redemption option #${initialData?.id}`
              }
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="edit"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Redemption Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Enter amount"
                disabled={isSubmitting}
                className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.amount 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-white'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                {errors.amount}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Enter the redemption amount in Indian Rupees
            </p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Status</h3>
              <p className="text-sm text-gray-600">
                {formData.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('is_active', !formData.is_active)}
              disabled={isSubmitting}
              className="relative inline-flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg disabled:opacity-50"
            >
              {formData.is_active ? (
                <ToggleRight className="h-10 w-10 text-green-600" />
              ) : (
                <ToggleLeft className="h-10 w-10 text-gray-400" />
              )}
            </button>
          </div>

          {/* Status Description */}
          <div className={`p-3 rounded-lg border ${
            formData.is_active 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-sm ${
              formData.is_active ? 'text-green-700' : 'text-gray-700'
            }`}>
              {formData.is_active 
                ? '✓ This redemption option will be available for users to select.'
                : '✗ This redemption option will be hidden and unavailable for users.'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'add' ? 'Adding...' : 'Updating...'}
                </div>
              ) : (
                mode === 'add' ? 'Add Option' : 'Update Option'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConversionModal;