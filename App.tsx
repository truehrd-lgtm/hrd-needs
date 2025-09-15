import React, { useState, useCallback, useEffect } from 'react';
import type { Answers, DiagnosisResult } from './types';
import { SURVEY_STEPS } from './constants';
import { diagnoseTrainingNeeds } from './services/geminiService';

import WelcomeScreen from './components/WelcomeScreen';
import SurveyForm from './components/SurveyForm';
import LoadingSpinner from './components/LoadingSpinner';
import ResultDisplay from './components/ResultDisplay';
import ThemeToggle from './components/ThemeToggle';

type AppState = 'welcome' | 'survey' | 'loading' | 'result' | 'error';
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleStart = () => {
    setAppState('survey');
  };

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = () => {
    if (currentStep < SURVEY_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    setAppState('loading');
    setError(null);
    try {
      const diagnosisResult = await diagnoseTrainingNeeds(answers, SURVEY_STEPS);
      setResult(diagnosisResult);
      setAppState('result');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setAppState('error');
    }
  };
  
  const handleReset = () => {
      setAnswers({});
      setCurrentStep(0);
      setResult(null);
      setError(null);
      setAppState('welcome');
  };

  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'survey':
        return (
          <SurveyForm
            steps={SURVEY_STEPS}
            currentStep={currentStep}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
          />
        );
      case 'loading':
        return <LoadingSpinner />;
      case 'result':
        return result ? <ResultDisplay result={result} onReset={handleReset} /> : null;
      case 'error':
        return (
            <div className="text-center p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">오류가 발생했습니다</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
                <button
                    onClick={handleReset}
                    className="bg-brand-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    처음으로 돌아가기
                </button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="bg-slate-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
        <div className="w-full relative">
            {renderContent()}
        </div>
        <footer className="w-full max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-400 mt-8 text-sm relative px-4">
            <p>Powered by Google Gemini. © 2024 HRD Needs Diagnosis System.</p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </footer>
    </main>
  );
};

export default App;