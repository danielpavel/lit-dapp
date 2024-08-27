import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  copy?: string;
  error?: Error;
}

const Loading = ({ copy = 'Loading...', error }: LoadingProps) => {
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-100 text-red-700 rounded-md">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="mt-2 text-gray-600">{copy}</span>
    </div>
  );
};

export default Loading;
