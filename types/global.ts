export interface BaseObject {
  id: string;
  createdAt?: string;
  updatedAt?: string,
  isDeleted?: boolean;
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
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong answer",
  TIME_LIMIT: 'Time limit',
  STACK_OVERFLOW: 'Stack overflow'
}

export type SubmissionLanguage = keyof typeof SUBMISSION_LANGUAGE;

export type SubmissionLanguageValue = (typeof SUBMISSION_LANGUAGE)[keyof typeof SUBMISSION_LANGUAGE];

export type ProblemResult = keyof typeof PROBLEM_RESULT;

export type ProblemResultValue = (typeof PROBLEM_RESULT)[keyof typeof PROBLEM_RESULT];