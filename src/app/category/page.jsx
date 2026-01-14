"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, fetchCategories } from "@/redux/slices/categorySlice";
import { Button } from "@/components/ui/Button";
import CategoryModal from "./components/categoryModal";
import AddCategoryModal from "./components/addCategory";
import CategoryCard from "./components/categoryCard";
import DeleteConfirmationModal from "@/components/layout/DeleteModal";
import toast from "react-hot-toast";

const Category = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  // Function to refresh categories
  const refreshCategories = () => {
    dispatch(fetchCategories({ page: 1, limit: 10 }))
      .unwrap()
      .then((res) => {
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      });
  };

  useEffect(() => {
    refreshCategories();
  }, [dispatch, refreshTrigger]);

  const handleCardClick = (category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    const categoryId = categoryToDelete.id || categoryToDelete._id;
    
    try {
      const result = await dispatch(deleteCategory(categoryId)).unwrap();
      
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
      
      // Refresh the categories list
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error(error?.message || "Failed to delete category");
    } finally {
      // Close the modal regardless of success/failure
      handleCloseDeleteModal();
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Callback when category is successfully added
  const handleCategoryAdded = (newCategory) => {
   
    setRefreshTrigger(prev => prev + 1);
  };

  // Callback when category is successfully updated
  const handleCategoryUpdated = (updatedCategory) => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-4">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">
              Manage your product categories ({categories?.length || 0} total)
            </p>
          </div>
          <Button variant="default" size="lg" onClick={handleAddCategory}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Category
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading categories
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id || category._id}
                category={category}
                onClick={() => handleCardClick(category)}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No categories
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first category.
              </p>
              <div className="mt-6">
                <Button variant="default" onClick={handleAddCategory}>
                  Add New Category
                </Button>
              </div>
            </div>
          )
        )}

        {/* Pagination Section */}
        {categories && categories.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{categories?.length || 0}</span> of{" "}
                <span className="font-medium">{categories?.length || 0}</span>{" "}
                results
              </p>
            </div>
          </div>
        )}


        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onCategoryAdded={handleCategoryAdded}
        />

        <CategoryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          category={selectedCategory}
          onCategoryUpdated={handleCategoryUpdated}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Category"
          description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default Category;