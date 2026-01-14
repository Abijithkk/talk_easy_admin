"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/Button";
import { updateCategory } from "@/redux/slices/categorySlice";
import toast from "react-hot-toast";

const EditCategoryModal = ({ isOpen, onClose, category, onCategoryUpdated }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when category changes or modal opens
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        is_active: category.is_active !== undefined ? category.is_active : true,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters long";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Category name must be less than 50 characters";
    }

  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        [name]: ""
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error("Please fix the form errors before submitting");
    return;
  }

  setIsSubmitting(true);

  try {
 

    // FIX: Change 'data' to 'categoryData' to match what the thunk expects
    const result = await dispatch(updateCategory({
      id: category.id || category._id,
      categoryData: {  
        ...formData,
        name: formData.name.trim(),
      }
    })).unwrap();

    toast.success("Category updated successfully! ✅");
    
    // Reset errors
    setErrors({});
    
    if (onCategoryUpdated) {
      onCategoryUpdated(result);
    }
    
    onClose();
    
  } catch (error) {
    toast.error(error.message || "Failed to update category. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    if (isSubmitting) return;
    
    setFormData({
      name: "",
      is_active: true,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
              <p className="text-sm text-gray-600 mt-1">Update category details</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed p-1 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name 
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter Category Name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

           

            {/* Active Status Field */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200 disabled:opacity-50"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                  Active Category
                </label>
                <p className="text-sm text-gray-500">
                  Inactive categories won't be available 
                </p>
              </div>
            </div>

            {/* Category Info (Read-only) */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Category Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">ID:</span>
                  <span className="text-blue-900 font-mono">{category.id || category._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Created:</span>
                  <span className="text-blue-900">
                    {new Date(category.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Category"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;