import { Pencil, Trash2 } from "lucide-react";

const CategoryCard = ({ category, onClick, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatusBadge = ({ isActive }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.(category);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(category);
  };

  // Check if category is already deleted
  const isDeleted = category.is_deleted;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
        isDeleted ? "opacity-60" : ""
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Category Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge isActive={category.is_active} />
                {isDeleted && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Deleted
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Icons - Hide delete button if already deleted */}
          {!isDeleted && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleEditClick}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Edit category"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Category Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Created:</span>
            <span className="text-gray-900">
              {formatDate(category.created_at)}
            </span>
          </div>

          {category.updated_at && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Updated:</span>
              <span className="text-gray-900">
                {formatDate(category.updated_at)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;