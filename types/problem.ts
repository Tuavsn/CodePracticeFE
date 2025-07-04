import { BaseObject } from "./global";
import { User } from "./user";

export interface Problem extends BaseObject {
  title: string;
  description: string;
  difficulty: (keyof typeof PROBLEM_COMPLEXITY);
  tags: string[];
  author: User;
  likeCount: number;
  commentCount: number;
  submissionCount: number;
  acceptanceRate: number;
  isLiked?: boolean;
  isSolved?: boolean;
  constraints?: string[];
  examples?: ProblemExample[];
  hints?: string[];
  status?: (keyof typeof PROBLEM_STATUS);
  isSelected?: boolean;
}

export interface ProblemExample {
  input: string;
  ouput: string;
  explanation?: string;
}

// export interface ProblemSubmission extends BaseObject {
//     problemI
// }

export interface ProblemFilter {
  difficulty?: (keyof typeof PROBLEM_COMPLEXITY);
  category?: string;
  tags?: string[];
  status?: 'all' | 'solved' | 'unsolved' | 'published' | 'draft' | 'archived' | 'deleted';
  sortBy: 'newest' | 'oldest' | 'difficulty' | 'acceptance';
  search?: string;
}

export const PROBLEM_COMPLEXITY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

export const PROBLEM_STATUS = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
  DELETED: 'Deleted'
}

export const SUBMISSION_LANGUAGE = {
  C: 'C',
  CPP: 'C++',
  PYTHON: 'Python',
  JAVA: 'Java',
  JAVASCRIPT: 'Javascript',
  CSHARP: 'C#'
}

export const PROBLEM_RESULT = {
  ACCEPT: "Accepted",
  WRONG_ANSWER: "Wrong answer",
  TIME_LIMIT: 'Time limit',
  STACK_OVERFLOW: 'Stack overflow'
}