import React, { useState } from 'react';
import type { DiagnosisResult } from '../types';
import { CheckIcon, LightBulbIcon, DownloadIcon } from './icons';

// Declare global variables from CDN scripts for TypeScript
declare const html2canvas: any;
declare const jspdf: any;

interface ResultDisplayProps {
  result: DiagnosisResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const { addieAnalysis, trainingProposal } = result;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) {
      console.error("PDF content element not found!");
      return;
    }

    setIsDownloading(true);

    try {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff'; // Corresponds to dark:bg-gray-800 and bg-white

      const canvas = await html2canvas(element, { 
        scale: 2,
        backgroundColor: backgroundColor,
        useCORS: true,
       });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasWidth / canvasHeight;
      const imgHeight = pdfWidth / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save('HRD-Needs-Diagnosis-Report.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("PDF 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div id="pdf-content" className="p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center mb-10">
          <LightBulbIcon className="w-16 h-16 mx-auto text-brand-orange mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">AI 기반 교육 니즈 진단 결과</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">귀사의 성공적인 인재 개발을 위한 맞춤형 제안서입니다.</p>
        </div>

        <div className="space-y-12">
          {/* ADDIE Model Analysis */}
          <section>
            <h2 className="text-3xl font-bold text-brand-blue border-b-2 border-brand-blue pb-2 mb-6">ADDIE 모델 기반 교육 방향성</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-blue-800 dark:text-blue-200 mb-2">분석 (Analysis)</h3>
                <p className="text-blue-700 dark:text-blue-300">{addieAnalysis.analysis}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-blue-800 dark:text-blue-200 mb-2">설계 (Design)</h3>
                <p className="text-blue-700 dark:text-blue-300">{addieAnalysis.design}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-blue-800 dark:text-blue-200 mb-2">개발 (Development)</h3>
                <p className="text-blue-700 dark:text-blue-300">{addieAnalysis.development}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-blue-800 dark:text-blue-200 mb-2">실행 (Implementation)</h3>
                <p className="text-blue-700 dark:text-blue-300">{addieAnalysis.implementation}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg md:col-span-2">
                <h3 className="font-bold text-xl text-blue-800 dark:text-blue-200 mb-2">평가 (Evaluation)</h3>
                <p className="text-blue-700 dark:text-blue-300">{addieAnalysis.evaluation}</p>
              </div>
            </div>
          </section>

          {/* Training Proposal */}
          <section>
            <h2 className="text-3xl font-bold text-brand-orange border-b-2 border-brand-orange pb-2 mb-6">맞춤 교육 과정 제안서</h2>
            <div className="bg-orange-50/50 dark:bg-orange-900/30 p-6 sm:p-8 rounded-lg border border-orange-200 dark:border-orange-700/50">
              <h3 className="text-3xl font-extrabold text-orange-800 dark:text-orange-200 mb-4">{trainingProposal.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-orange-900 dark:text-orange-300">
                <p><span className="font-bold">교육 대상:</span> {trainingProposal.targetAudience}</p>
                <p><span className="font-bold">교육 기간:</span> {trainingProposal.duration}</p>
              </div>
              
              <div className="mb-6">
                  <h4 className="font-bold text-xl text-orange-800 dark:text-orange-200 mb-2">교육 목표</h4>
                  <ul className="space-y-1 list-inside text-gray-700 dark:text-gray-300">
                      {trainingProposal.objectives.map((obj, index) => (
                          <li key={index} className="flex items-start">
                              <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-500 mr-2 mt-1 flex-shrink-0" />
                              <span>{obj}</span>
                          </li>
                      ))}
                  </ul>
              </div>

              <div>
                <h4 className="font-bold text-xl text-orange-800 dark:text-orange-200 mb-3">주요 교육 모듈</h4>
                <div className="space-y-4">
                  {trainingProposal.modules.map((mod, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-700/50 border-l-4 border-orange-400 dark:border-orange-500 rounded-r-lg shadow-sm">
                      <h5 className="font-bold text-lg text-orange-800 dark:text-orange-300">{mod.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{mod.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center justify-center w-full sm:w-auto bg-brand-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-800 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-wait"
        >
            {isDownloading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                저장 중...
                </>
            ) : (
                <>
                <DownloadIcon className="w-5 h-5 mr-2" />
                PDF로 저장
                </>
            )}
        </button>
        <button
            onClick={onReset}
            className="w-full sm:w-auto bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
            새로 진단하기
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
