
export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
}

export interface SurveyStep {
  title: string;
  description: string;
  questions: Question[];
}

export interface Answers {
  [questionId: string]: string;
}

export interface AddieAnalysis {
  analysis: string;
  design: string;
  development: string;
  implementation: string;
  evaluation: string;
}

export interface TrainingModule {
  title: string;
  content: string;
}

export interface TrainingProposal {
  title: string;
  targetAudience: string;
  duration: string;
  objectives: string[];
  modules: TrainingModule[];
}

export interface DiagnosisResult {
  addieAnalysis: AddieAnalysis;
  trainingProposal: TrainingProposal;
}
