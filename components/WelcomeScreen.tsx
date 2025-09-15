import React from 'react';
import { DocumentTextIcon } from './icons';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full">
            <DocumentTextIcon className="w-16 h-16 text-brand-blue" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">HRD 니즈 진단 시스템</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        몇 가지 간단한 질문에 답변하고, 귀사의 조직에 꼭 맞는 맞춤형 교육 방향성과 과정 제안서를 받아보세요.
        AI 기반 진단을 통해 체계적이고 효과적인 인재 개발 계획을 수립할 수 있습니다.
      </p>
      <button
        onClick={onStart}
        className="bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        진단 시작하기
      </button>
    </div>
  );
};

export default WelcomeScreen;