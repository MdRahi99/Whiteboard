import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrawing, useDeleteDrawing } from '../../hooks/useDrawings';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye } from 'lucide-react';
import DrawingPreview from '../DrawingPreview/DrawingPreview';
import Loading from '../shared/Loading/Loading';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DrawingDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDrawing(params.id);
  const deleteDrawingMutation = useDeleteDrawing();
  const [activeTab, setActiveTab] = useState('preview');

  if (isLoading) {
    return <Loading />;
  }

  const { _id, createdAt, lines, shapes, texts, title } = data;

  const tabs = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'details', label: 'Details', icon: ArrowLeft },
  ];

  const handleDelete = async (id) => {
    try {
      await deleteDrawingMutation.mutateAsync(id);
      toast.success('Drawing deleted successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error('Failed to delete drawing. Please try again.');
    }
  };

  const handleUpdate = (id) => {
    console.log(id);
  };

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm opacity-80">Created on: {new Date(createdAt).toLocaleDateString()}</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200">
          <div className='flex items-center justify-start'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-purple-600'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className='flex items-center justify-end gap-4'>
            <button 
              onClick={() => handleDelete(_id)} 
              className='flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg'
              disabled={deleteDrawingMutation.isLoading}
            >
              <MdOutlineDelete className='text-lg' />
              <span className='text-sm font-medium'>
                {deleteDrawingMutation.isLoading ? 'Deleting...' : 'Delete'}
              </span>
            </button>

            <button onClick={() => handleUpdate(_id)} className='flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded-lg'>
              <FaRegEdit className='text-lg' />
              <span className='text-sm font-medium'>Update</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <DrawingPreview drawing={data} height={420} width={420} />
              </div>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <DetailSection title="Lines" items={lines} renderItem={(line, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: line.color }}></div>
                  <span>Width: {line.width}</span>
                </div>
              )} />
              <DetailSection title="Shapes" items={shapes} renderItem={(shape, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: shape.color }}></div>
                  <span>Type: {shape.type}</span>
                </div>
              )} />
              <DetailSection title="Texts" items={texts} renderItem={(text, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{text.content}</p>
                  <p className="text-sm text-gray-500">Size: {text.fontSize}px</p>
                </div>
              )} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailSection = ({ title, items, renderItem }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <h3 className="text-lg font-semibold mb-3 text-purple-600">{title}</h3>
    <div className="space-y-2">
      {items.map((item, index) => renderItem(item, index))}
    </div>
  </div>
);

export default DrawingDetails;