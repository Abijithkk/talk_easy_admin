"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPlan } from "@/redux/slices/planSlice";
import { fetchCategories } from "@/redux/slices/categorySlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function AddPlan() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { loading, error } = useSelector((state) => state.plans);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    plan_name: "",
    coin_package: "",
    base_price: "",
    category_id: "",
    discount_percentage: "",
    is_active: true,
  });

  useEffect(() => {
    // Fetch categories when component mounts
    dispatch(fetchCategories({ page: 1, limit: 100 })) // Increased limit to get all categories
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      let errorMessage = "Failed to add plan";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }

    if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
      toast.error("Discount percentage must be between 0 and 100");
      return;
    }

    const submitData = {
      ...formData,
      coin_package: parseInt(formData.coin_package),
      base_price: parseFloat(formData.base_price),
      category_id: parseInt(formData.category_id),
      discount_percentage: parseFloat(formData.discount_percentage),
      is_active: Boolean(formData.is_active),
    };

    console.log("Submitting plan data:", submitData);

    try {
      const result = await dispatch(createPlan(submitData)).unwrap();
      
      // Reset form
      setFormData({
        plan_name: "",
        coin_package: "",
        base_price: "",
        category_id: "",
        discount_percentage: "",
        is_active: true,
      });

      toast.success("Plan added successfully!");
      
      // Optional: Redirect after success
      // router.push('/plans');
      
    } catch (error) {
      console.error("Failed to add plan:", error);
      
      let errorMessage = "Failed to add plan. Please try again.";
      
      if (error?.message) {
        if (error.message.includes("already exists")) {
          errorMessage = "A plan with this name already exists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const refreshCategories = () => {
    dispatch(fetchCategories({ page: 1, limit: 100 }))
      .unwrap()
      .then((res) => {
        toast.success("Categories refreshed successfully!");
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-4 lg:px-4">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header Section with Back Button */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Plan
            </h1>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleBack}
            >
              ← Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Plan Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="plan_name"
                  placeholder="Enter plan name"
                  value={formData.plan_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coin Package *
                </label>
                <input
                  type="number"
                  name="coin_package"
                  placeholder="Enter number of coins"
                  value={formData.coin_package}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Price *
                </label>
                <input
                  type="number"
                  name="base_price"
                  placeholder="Enter base price"
                  value={formData.base_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  name="discount_percentage"
                  placeholder="Enter discount percentage"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Category *
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={refreshCategories}
                  disabled={categoriesLoading}
                >
                  {categoriesLoading ? "Refreshing..." : "Refresh Categories"}
                </Button>
              </div>
              
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                >
                  <option value="">Select Category</option>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
                </select>
              )}
              {!formData.category_id && (
                <p className="text-red-500 text-sm mt-2">
                  Please select a category
                </p>
              )}
            </div>

            {/* Status Toggle */}
            <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  Plan is Active
                </span>
              </label>
              <span className="text-sm text-gray-500">
                {formData.is_active ? "Plan will be available for users" : "Plan will be hidden from users"}
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" variant="default" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Adding Plan...</span>
                  </>
                ) : (
                  <span>Add Plan</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}