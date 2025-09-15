import React from 'react';
import type { SurveyStep, Answers, Question } from '../types';
import { QuestionType } from '../types';
import ProgressBar from './ProgressBar';

interface SurveyFormProps {
  steps: SurveyStep[];
  currentStep: number;
  answers: Answers;
  onAnswerChange: (questionId: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const renderQuestion = (question: Question, answer: string, onAnswerChange: (questionId: string, value: string) => void) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onAnswerChange(question.id, e.target.value);
  };
  
  switch (question.type) {
    case QuestionType.TEXT:
      return (
        <input
          type="text"
          id={question.id}
          value={answer}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      );
    case QuestionType.TEXTAREA:
      return (
        <textarea
          id={question.id}
          value={answer}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      );
    case QuestionType.MULTIPLE_CHOICE:
      return (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-brand-blue/5 dark:hover:bg-brand-blue/10 transition has-[:checked]:bg-brand-blue/10 has-[:checked]:border-brand-blue dark:has-[:checked]:bg-brand-blue/20 dark:has-[:checked]:border-brand-blue">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answer === option}
                onChange={handleChange}
                className="w-5 h-5 text-brand-orange focus:ring-brand-orange border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const SurveyForm: React.FC<SurveyFormProps> = ({ steps, currentStep, answers, onAnswerChange, onNext, onPrev, onSubmit }) => {
  const stepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const isStepComplete = stepData.questions.every(q => answers[q.id] && answers[q.id].trim() !== '');

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-fade-in">
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-brand-blue">{stepData.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{stepData.description}</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (isStepComplete) { isLastStep ? onSubmit() : onNext() } }}>
        <div className="space-y-6">
          {stepData.questions.map((question) => (
            <div key={question.id}>
              <label htmlFor={question.id} className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {question.label}
              </label>
              {renderQuestion(question, answers[question.id] || '', onAnswerChange)}
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-between items-center">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            이전
          </button>
          {isLastStep ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!isStepComplete}
              className="px-8 py-3 text-white bg-brand-orange rounded-md font-bold hover:bg-orange-600 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition shadow-lg"
            >
              진단 결과 보기
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isStepComplete}
              className="px-6 py-2 text-white bg-brand-blue rounded-md hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            >
              다음
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;