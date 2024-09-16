import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import DrawingPreview from '../DrawingPreview/DrawingPreview';
import { useUpdateDrawing } from '../../hooks/useDrawings';
import { toast } from 'react-toastify';

const UpdateDrawingModal = ({ isOpen, onClose, drawing }) => {
  const [updatedTitle, setUpdatedTitle] = useState(drawing.title);
  const updateDrawingMutation = useUpdateDrawing();

  const handleUpdate = async () => {
    try {
      await updateDrawingMutation.mutateAsync({
        id: drawing._id,
        data: { title: updatedTitle },
      });
      toast.success('Drawing updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update drawing. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Update Drawing</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <DrawingPreview drawing={drawing} height={300} width={300} />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={updateDrawingMutation.isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {updateDrawingMutation.isLoading ? 'Updating...' : 'Update Drawing'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UpdateDrawingModal;