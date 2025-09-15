
import type { SurveyStep } from './types';
import { QuestionType } from './types';

export const SURVEY_STEPS: SurveyStep[] = [
  {
    title: '1단계: 조직 현황 진단',
    description: '귀사의 현재 상황과 비즈니스 목표를 파악합니다.',
    questions: [
      {
        id: 'company_goals',
        type: QuestionType.TEXTAREA,
        label: '올해 귀사의 가장 중요한 비즈니스 목표는 무엇인가요?',
      },
      {
        id: 'current_challenges',
        type: QuestionType.TEXTAREA,
        label: '목표 달성 과정에서 겪고 있는 가장 큰 어려움이나 장애물은 무엇인가요?',
      },
      {
        id: 'organizational_culture',
        type: QuestionType.MULTIPLE_CHOICE,
        label: '귀사의 조직 문화를 가장 잘 설명하는 단어는 무엇인가요?',
        options: ['성과 중심', '안정 지향', '혁신 추구', '고객 중심', '팀워크 중시'],
      },
    ],
  },
  {
    title: '2단계: 교육 목표 설정',
    description: '이번 교육을 통해 달성하고자 하는 구체적인 목표를 설정합니다.',
    questions: [
      {
        id: 'training_purpose',
        type: QuestionType.TEXTAREA,
        label: '이번 교육을 통해 해결하고 싶은 가장 핵심적인 문제는 무엇인가요?',
      },
      {
        id: 'desired_outcomes',
        type: QuestionType.TEXTAREA,
        label: '교육이 성공적으로 끝났을 때, 참가자들이 어떤 행동이나 역량 변화를 보이길 기대하시나요?',
      },
      {
        id: 'success_metrics',
        type: QuestionType.TEXT,
        label: '교육의 성공 여부를 측정할 수 있는 핵심 성과 지표(KPI)는 무엇이 있을까요?',
      },
    ],
  },
  {
    title: '3단계: 교육 대상 분석',
    description: '교육에 참여할 대상의 특성을 파악합니다.',
    questions: [
      {
        id: 'participant_role',
        type: QuestionType.TEXT,
        label: '교육에 참여할 직원들의 주된 직무나 직책은 무엇인가요? (예: 신입사원, 중간관리자, 영업팀)',
      },
      {
        id: 'participant_experience',
        type: QuestionType.MULTIPLE_CHOICE,
        label: '참가자들의 평균 경력 수준은 어느 정도인가요?',
        options: ['1년 미만', '1-3년', '4-7년', '8-12년', '13년 이상'],
      },
      {
        id: 'participant_motivation',
        type: QuestionType.TEXTAREA,
        label: '참가자들의 학습 동기 수준은 어떻다고 생각하시나요? 교육에 대한 기대나 우려는 무엇일까요?',
      },
    ],
  },
  {
    title: '4단계: 환경 및 실행 요소',
    description: '교육 실행에 필요한 환경과 제약 조건을 확인합니다.',
    questions: [
      {
        id: 'training_format',
        type: QuestionType.MULTIPLE_CHOICE,
        label: '선호하는 교육 형태는 무엇인가요?',
        options: ['오프라인 워크숍', '온라인 라이브 강의', '온/오프라인 혼합', '이러닝(VOD)'],
      },
      {
        id: 'training_duration',
        type: QuestionType.TEXT,
        label: '확보 가능한 총 교육 시간이나 기간은 어느 정도인가요? (예: 총 16시간, 2일 워크숍)',
      },
      {
        id: 'training_budget',
        type: QuestionType.TEXT,
        label: '이번 교육에 배정된 예산 범위를 알려주실 수 있나요? (선택 사항)',
      },
    ],
  },
];
