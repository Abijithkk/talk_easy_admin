"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCarouselImage,
  updateCarouselImage,
} from '@/redux/slices/carouselSlice';
import { Button } from '@/components/ui/Button';
import { X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CarouselModal = ({ isOpen, onClose, editData = null }) => {
  const dispatch = useDispatch();
  const carouselState = useSelector(state => state.carousel);
  
  const [formData, setFormData] = useState({
    title: '',
    for_executive: false,
    for_user: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          title: editData.title || '',
          for_executive: editData.for_executive || false,
          for_user: editData.for_user || false,
        });
        setImagePreview(editData.image || '');
        setImageFile(null);
      } else {
        resetForm();
      }
      setErrors({});
    }
  }, [isOpen, editData]);

  // Handle API responses
  useEffect(() => {
    if (isSubmitting) {
      if (editData) {
        // Update operations
        if (carouselState.updateCarouselImageSuccess) {
          toast.success('Carousel updated successfully!');
          handleClose();
        } else if (carouselState.updateCarouselImageError) {
          toast.error(`Update failed: ${carouselState.updateCarouselImageError}`);
          setErrors({ submit: carouselState.updateCarouselImageError });
        }
      } else {
        // Create operations
        if (carouselState.createCarouselImageSuccess) {
          toast.success('Carousel created successfully!');
          handleClose();
        } else if (carouselState.createCarouselImageError) {
          toast.error(`Create failed: ${carouselState.createCarouselImageError}`);
          setErrors({ submit: carouselState.createCarouselImageError });
        }
      }
      
      // Reset submitting state when operation completes
      if (!carouselState.createCarouselImageLoading && !carouselState.updateCarouselImageLoading) {
        setIsSubmitting(false);
      }
    }
  }, [
    carouselState.createCarouselImageSuccess,
    carouselState.createCarouselImageError,
    carouselState.updateCarouselImageSuccess,
    carouselState.updateCarouselImageError,
    carouselState.createCarouselImageLoading,
    carouselState.updateCarouselImageLoading,
    isSubmitting,
    editData
  ]);

  const resetForm = () => {
    setFormData({
      title: '',
      for_executive: false,
      for_user: false,
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!editData && !imageFile) {
      newErrors.image = 'Image is required for new carousel';
    }

    if (!formData.for_executive && !formData.for_user) {
      newErrors.audience = 'Please select at least one audience type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('for_executive', formData.for_executive.toString());
      submitData.append('for_user', formData.for_user.toString());
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      console.log('Submitting carousel data:', {
        title: formData.title,
        for_executive: formData.for_executive,
        for_user: formData.for_user,
        hasImage: !!imageFile
      });

      if (editData) {
        await dispatch(updateCarouselImage({ id: editData.id, data: submitData }));
      } else {
        await dispatch(createCarouselImage(submitData));
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLoading = carouselState.createCarouselImageLoading || carouselState.updateCarouselImageLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? 'Edit Carousel' : 'Add New Carousel'}
          </h2>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            variant='edit'
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter carousel title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {!editData && '*'}
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              {/* Upload Area */}
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <label htmlFor="image" className={`cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {imageFile ? 'Change image' : 'Click to upload image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </label>
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
              
              {editData && !imageFile && (
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty to keep current image
                </p>
              )}
            </div>

            {/* Audience Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Audience *
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="for_executive"
                    checked={formData.for_executive}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">For Executive</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="for_user"
                    checked={formData.for_user}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">For User</span>
                </label>
              </div>
              {errors.audience && (
                <p className="mt-1 text-sm text-red-600">{errors.audience}</p>
              )}
            </div>
          </form>
        </div>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="edit"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="flex-1 "
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {editData ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                editData ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselModal;