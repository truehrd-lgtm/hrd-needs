import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue"></div>
      <p className="text-brand-blue dark:text-blue-400 text-lg font-semibold">AI가 진단 보고서를 생성 중입니다...</p>
      <p className="text-gray-500 dark:text-gray-400">잠시만 기다려주세요. 최대 1분 정도 소요될 수 있습니다.</p>
    </div>
  );
};

export default LoadingSpinner;