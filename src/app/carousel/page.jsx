"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCarouselImages,
  deleteCarouselImage,
  clearAllCarouselStates
} from '@/redux/slices/carouselSlice';
import { Button } from '@/components/ui/Button';
import CarouselModal from './components/CarouselModal';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/layout/DeleteModal';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Calendar,
  Users,
  UserCheck,
  Loader2 
} from 'lucide-react';

const CarouselConsole = () => {
  const dispatch = useDispatch();
  const carouselState = useSelector(state => state.carousel);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carouselToDelete, setCarouselToDelete] = useState(null);

  // Get carousel images array safely
  const carouselImages = carouselState.carouselImages?.results || [];
  const carouselCount = carouselState.carouselImages?.count || carouselImages.length;

  useEffect(() => {
    console.log('🔄 Starting carousel operations...');
    dispatch(fetchCarouselImages());

    return () => {
      dispatch(clearAllCarouselStates());
    };
  }, [dispatch]);

  // Handle API responses
  useEffect(() => {
    if (carouselState.createCarouselImageSuccess) {
      toast.success('Carousel image created successfully!');
      handleModalClose();
    }
    
    if (carouselState.updateCarouselImageSuccess) {
      toast.success('Carousel image updated successfully!');
      handleModalClose();
    }
    
    if (carouselState.deleteCarouselImageSuccess) {
      toast.success('Carousel image deleted successfully!');
      setDeleteModalOpen(false);
      setCarouselToDelete(null);
    }
  }, [
    carouselState.createCarouselImageSuccess,
    carouselState.updateCarouselImageSuccess,
    carouselState.deleteCarouselImageSuccess,
    dispatch
  ]);

  // Handle errors
  useEffect(() => {
    if (carouselState.createCarouselImageError) {
      toast.error(`Create failed: ${carouselState.createCarouselImageError}`);
    }
    
    if (carouselState.updateCarouselImageError) {
      toast.error(`Update failed: ${carouselState.updateCarouselImageError}`);
    }
    
    if (carouselState.deleteCarouselImageError) {
      toast.error(`Delete failed: ${carouselState.deleteCarouselImageError}`);
      setDeleteModalOpen(false);
      setCarouselToDelete(null);
    }
  }, [
    carouselState.createCarouselImageError,
    carouselState.updateCarouselImageError,
    carouselState.deleteCarouselImageError
  ]);

  const handleEdit = (carousel) => {
    setEditingCarousel(carousel);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCarousel(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCarousel(null);
  };

  const handleDeleteClick = (carousel) => {
    setCarouselToDelete(carousel);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (carouselToDelete) {
      dispatch(deleteCarouselImage(carouselToDelete.id));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCarouselToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carousel Management</h1>
            <p className="text-gray-600 mt-2">
              Manage your website carousel images and visibility settings
            </p>
          </div>
          <Button 
            onClick={handleAddNew}
            disabled={carouselState.loading}
          >
            <Plus className="w-5 h-5" />
            Add New Carousel
          </Button>
        </div>
        
        {/* Stats Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{carouselCount}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Visible</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {carouselImages.filter(img => img.for_user).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Executive Visible</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {carouselImages.filter(img => img.for_executive).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {carouselState.loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium">Loading carousel images...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {carouselState.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-700 font-medium">Error loading carousel images: {carouselState.error}</p>
          </div>
        </div>
      )}

      {/* Carousel List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {carouselImages.length === 0 && !carouselState.loading ? (
          <div className="text-center py-16 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No carousel images found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first carousel image to showcase on your website.
            </p>
            <Button 
              onClick={handleAddNew}
            >
              <Plus className="w-5 h-5" />
              Create Your First Carousel
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {carouselImages.map((carousel) => (
              <div key={carousel.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Image Thumbnail */}
                  <div className="flex-shrink-0">
                    
                      <div className="relative group">
                        <img 
                          src={carousel.image} 
                          alt={carousel.title || 'Carousel Image'}
                          className="w-32 h-20 lg:w-40 lg:h-24 object-cover rounded-lg shadow-sm border border-gray-200"
                          
                        />
                      </div>
                   
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {carousel.title || 'Untitled Carousel'}
                        </h3>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            carousel.for_executive 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            <UserCheck className="w-3 h-3" />
                            Executive: {carousel.for_executive ? 'Yes' : 'No'}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            carousel.for_user 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            <Users className="w-3 h-3" />
                            User: {carousel.for_user ? 'Yes' : 'No'}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(carousel.created_at).toLocaleDateString()}</span>
                          </div>
                          {carousel.updated_at && carousel.updated_at !== carousel.created_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Updated: {new Date(carousel.updated_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleEdit(carousel)}
                          variant="edit"
                          size="sm"
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                          disabled={carouselState.loading}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(carousel)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                          disabled={carouselState.deleteCarouselImageLoading}
                        >
                          {carouselState.deleteCarouselImageLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CarouselModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editData={editingCarousel}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Carousel Image"
        description={`Are you sure you want to delete "${carouselToDelete?.title || 'this carousel image'}"? This action cannot be undone.`}
        confirmText={carouselState.deleteCarouselImageLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default CarouselConsole;