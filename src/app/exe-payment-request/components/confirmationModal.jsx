const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: '⚠️',
      confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    danger: {
      icon: '🚨',
      confirmColor: 'bg-red-600 hover:bg-red-700',
    },
    info: {
      icon: 'ℹ️',
      confirmColor: 'bg-blue-600 hover:bg-blue-700',
    }
  };

  const config = typeConfig[type] || typeConfig.warning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mr-3">
            <span className="text-lg">{config.icon}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="p-6">
          <div className="text-gray-600">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 transition-colors ${config.confirmColor}`}
            onClick={onConfirm}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;