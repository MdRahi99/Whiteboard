import React from 'react';

const Loading = () => {
    
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-t-4 border-b-4 border-dashed border-slate-700 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;