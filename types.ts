
import React from 'react';

export type MascotMood = 'neutral' | 'happy' | 'sad' | 'thinking' | 'excited' | 'confused' | 'curious';

export interface DiscoveryInteractiveProps {
  onDiscover: (data?: any) => void;
  state: any;
  target?: any;
  playSound?: (type: string) => void;
}

export type QuestionType = 'discovery' | 'multiple-choice' | 'predict' | 'drag-drop' | 'balance' | 'grid-builder' | 'transform';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  subPrompt?: string;
  explanation: string;
  options?: string[];
  correctAnswer?: string;
  interactive?: React.FC<DiscoveryInteractiveProps>;
  illustration?: React.ReactNode;
  templateData?: any;
}

export interface Step {
  id: string;
  type: 'explore' | 'quiz';
  questions: Question[];
}

export interface Level {
  id: string;
  title: string;
  steps: Step[];
}

export interface SubTopic extends Level {}

export interface Module {
  id: string;
  title: string;
  levels: Level[];
}

export interface World {
  id: string;
  title: string;
  icon: string;
  modules: Module[];
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  subTopics: SubTopic[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  isComingSoon?: boolean;
  worlds: World[];
}

export interface UserProgress {
  completedLevels: string[];
  score: number;
  onboardingDone: boolean;
  streak: number;
  lastCompletionDate?: string;
  preferences?: {
    goal: string;
    focus: string;
    time: string;
    level: string;
  };
}
