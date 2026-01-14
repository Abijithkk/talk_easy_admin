"use client";
import { deleteRedemptionOption, fetchRedemptionOptions } from '@/redux/slices/paymentSlice';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/Button';
import { DataTablePagination } from '@/components/layout/Pagination';
import DeleteConfirmationModal from '@/components/layout/DeleteModal';
import ConversionModal from './components/conversionModal';
import {
  CheckCircle,
  XCircle,
  Calendar,
  Coins,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { IndianRupee } from "lucide-react";
import toast from 'react-hot-toast';

const RedemptionOptions = () => {
  const dispatch = useDispatch();
  const { redemptionOptions, loading, error } = useSelector((state) => state.payments);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Modal states
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalMode, setModalMode] = useState('add'); 

  useEffect(() => {
    console.log('🔄 Component mounted - fetching redemption options...');
    dispatch(fetchRedemptionOptions());
  }, [dispatch]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const data = Array.isArray(redemptionOptions) ? redemptionOptions : redemptionOptions?.results || [];
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [redemptionOptions, pagination.pageIndex, pagination.pageSize]);

  // Mock table object for pagination
  const table = useMemo(
    () => {
      const data = Array.isArray(redemptionOptions) ? redemptionOptions : redemptionOptions?.results || [];
      const totalCount = Array.isArray(redemptionOptions) ? redemptionOptions.length : redemptionOptions?.count || 0;
      
      return {
        getState: () => ({
          pagination,
        }),
        setPageIndex: (pageIndex) => {
          setPagination((prev) => ({ ...prev, pageIndex }));
        },
        setPageSize: (pageSize) => {
          setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
        },
        getPageCount: () => {
          if (!totalCount) return 1;
          return Math.ceil(totalCount / pagination.pageSize);
        },
        getCanPreviousPage: () => pagination.pageIndex > 0,
        getCanNextPage: () => {
          if (!totalCount) return false;
          return (pagination.pageIndex + 1) * pagination.pageSize < totalCount;
        },
        previousPage: () => {
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(0, prev.pageIndex - 1),
          }));
        },
        nextPage: () => {
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
          }));
        },
      };
    },
    [pagination, redemptionOptions]
  );

  // Refresh redemption options
  const handleRefresh = () => {
    console.log('🔄 Refreshing redemption options...');
    dispatch(fetchRedemptionOptions())
      .unwrap()
      .then(() => {
      })
      .catch((err) => {
        toast.error('Failed to refresh redemption options');
      });
  };

  // Handle add button click
  const handleAdd = () => {
    setModalMode('add');
    setSelectedOption(null);
    setIsConversionModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = (option) => {
    setModalMode('edit');
    setSelectedOption(option);
    setIsConversionModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (option) => {
    setSelectedOption(option);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      // Add your delete API call here
      await dispatch(deleteRedemptionOption(selectedOption.id)).unwrap();
      toast.success('Redemption option deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedOption(null);
      handleRefresh();
    } catch (err) {
      toast.error('Failed to delete redemption option');
    }
  };



  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status configuration
  const getStatusConfig = (isActive) => {
    if (isActive) {
      return {
        label: "Active",
        icon: CheckCircle,
        className: "bg-green-50 border-green-200 text-green-700",
        iconClassName: "text-green-500",
      };
    }
    return {
      label: "Inactive",
      icon: XCircle,
      className: "bg-gray-50 border-gray-200 text-gray-700",
      iconClassName: "text-gray-500",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading redemption options
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = Array.isArray(redemptionOptions) ? redemptionOptions : redemptionOptions?.results || [];
  const totalCount = Array.isArray(redemptionOptions) ? redemptionOptions.length : redemptionOptions?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Redemption Options
            </h1>
            {totalCount > 0 && (
              <p className="text-gray-600 mt-2">
                Showing {paginatedData.length} of {totalCount} redemption options
              </p>
            )}
          </div>
          <Button
            onClick={handleAdd}
            disabled={loading}
            variant='default'
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((option) => {
                  const statusConfig = getStatusConfig(option.is_active);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr
                      key={option.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              #{option.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <IndianRupee className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              ₹{option.amount}
                            </div>
                            <div className="text-xs text-gray-500">
                              Redemption Value
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-start">
                          <div
                            className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${statusConfig.className}`}
                          >
                            <StatusIcon
                              className={`h-4 w-4 mr-2 ${statusConfig.iconClassName}`}
                            />
                            {statusConfig.label}
                          </div>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(option.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => handleEdit(option)}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-150 group"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(option)}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-150 group"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {data.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No redemption options found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There are currently no redemption options available in the system.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {data.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>

      {/* Conversion Modal */}
     <ConversionModal
  isOpen={isConversionModalOpen}
  onClose={() => {
    setIsConversionModalOpen(false);
    setSelectedOption(null);
  }}
  mode={modalMode}
  initialData={selectedOption}
/>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedOption(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Redemption Option"
        message={`Are you sure you want to delete the redemption option of ₹${selectedOption?.amount}? This action cannot be undone.`}
      />
    </div>
  );
};

export default RedemptionOptions;