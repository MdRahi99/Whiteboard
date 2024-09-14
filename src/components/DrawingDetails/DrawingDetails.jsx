import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDrawing } from '../../hooks/useDrawings';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye } from 'lucide-react';
import DrawingPreview from '../DrawingPreview/DrawingPreview';
import Loading from '../shared/Loading/Loading';

const DrawingDetails = () => {
  const params = useParams();
  const { data, isLoading } = useDrawing(params.id);
  const [activeTab, setActiveTab] = useState('preview');

  if (isLoading) {
    return (
      <Loading />
    );
  }

  const { createdAt, lines, shapes, texts, title } = data;

  const tabs = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'details', label: 'Details', icon: ArrowLeft },
  ];

  return (
    <div className="min-h-screen">
      <div className="rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm opacity-80">Created on: {new Date(createdAt).toLocaleDateString()}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
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