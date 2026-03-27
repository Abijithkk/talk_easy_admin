import { Button } from '@/components/ui/Button';
import { Trash2, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-red-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="bg-red-50 p-2 rounded-full mr-3">
              <Trash2 className="text-red-600 h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Deletion
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="pl-11">
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{itemName}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="edit" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="delete" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;