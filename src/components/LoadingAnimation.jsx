import React from 'react';
import { LoaderCircle } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
      <span className="ml-3 text-lg font-medium text-gray-700">Loading...</span>
    </div>
  );
};

export default LoadingAnimation;
