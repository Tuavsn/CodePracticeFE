import { BaseObject, ProblemResult, SubmissionLanguage } from "./global";

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

export interface Solution {
	problemId: string;
	code: string;
	language: SubmissionLanguage
}