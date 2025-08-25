import { BaseObject, ProblemResult, SubmissionLanguage } from "./global";

export interface RunResponse {
  stdout: string;
  stderr: string;
  compile_output: string;
  message: string;
  success: boolean;
}

export interface Submission extends BaseObject {
	code: string;
	langugage: SubmissionLanguage;
	result: ProblemResult;
	time: number;
	memory: number;
	score: number;
}

export interface Result extends BaseObject {
	result: ProblemResult;
	error: string;
	stdout: string;
	time: number;
	memory: number;
	point: number;
}

export interface RunSolution {
  code: string;
  language: SubmissionLanguage;
  input: string;
}

export interface SubmitSolution {
	problemId: string;
	code: string;
	language: SubmissionLanguage
}