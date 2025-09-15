
import { GoogleGenAI, Type } from '@google/genai';
import type { Answers, SurveyStep } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatAnswersForPrompt = (answers: Answers, steps: SurveyStep[]): string => {
  let formatted = '';
  steps.forEach((step) => {
    formatted += `\n**${step.title}**\n`;
    step.questions.forEach(question => {
      const answer = answers[question.id] || '답변 없음';
      formatted += `- ${question.label}: ${answer}\n`;
    });
  });
  return formatted;
};

export const diagnoseTrainingNeeds = async (answers: Answers, steps: SurveyStep[]) => {
  const formattedAnswers = formatAnswersForPrompt(answers, steps);
  const prompt = `
    당신은 기업 교육(HRD) 전문가입니다. 주어진 설문조사 결과를 바탕으로, ADDIE 모델에 근거한 교육 방향성 진단과 맞춤형 교육 과정 제안서를 생성해주세요. 모든 답변은 한국어로 작성해야 합니다.

    **설문조사 결과:**
    ${formattedAnswers}

    **요청 사항:**
    1.  **ADDIE 모델 분석:** 설문 결과를 바탕으로 분석(Analysis), 설계(Design), 개발(Development), 실행(Implementation), 평가(Evaluation) 각 단계에서 고려해야 할 핵심 사항을 구체적으로 제시해주세요.
    2.  **교육 과정 제안:** 위의 분석을 토대로, 다음과 같은 항목을 포함하는 구체적인 교육 과정 초안을 제안해주세요.
        - 과정명
        - 교육 대상
        - 교육 기간
        - 교육 목표 (3가지 이상)
        - 주요 교육 모듈 (3개 이상, 각 모듈의 핵심 내용 포함)

    결과는 반드시 아래의 JSON 스키마에 맞춰 생성해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            addieAnalysis: {
              type: Type.OBJECT,
              properties: {
                analysis: { type: Type.STRING, description: '분석 단계에 대한 제언' },
                design: { type: Type.STRING, description: '설계 단계에 대한 제언' },
                development: { type: Type.STRING, description: '개발 단계에 대한 제언' },
                implementation: { type: Type.STRING, description: '실행 단계에 대한 제언' },
                evaluation: { type: Type.STRING, description: '평가 단계에 대한 제언' },
              },
              required: ["analysis", "design", "development", "implementation", "evaluation"]
            },
            trainingProposal: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: '교육 과정명' },
                targetAudience: { type: Type.STRING, description: '교육 대상' },
                duration: { type: Type.STRING, description: '교육 기간' },
                objectives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '교육 목표 리스트',
                },
                modules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: '모듈 제목' },
                      content: { type: Type.STRING, description: '모듈 핵심 내용' },
                    },
                     required: ["title", "content"]
                  },
                  description: '교육 모듈 리스트',
                },
              },
              required: ["title", "targetAudience", "duration", "objectives", "modules"]
            },
          },
          required: ["addieAnalysis", "trainingProposal"]
        },
      },
    });

    const jsonText = response.text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('AI 진단 보고서 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
};
