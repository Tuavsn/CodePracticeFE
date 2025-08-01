import { Result, Solution, Submission } from "@/types/submission";
import { apiClient } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";

export const SubmissionService = {
	runSolution: async (solution: Solution): Promise<Submission> => {
		try {
			console.log(`Run solution: ${JSON.stringify(solution)}`);
			const response = await apiClient.post<Submission>(`${API_CONFIG.API_END_POINT.SUBMISSION}/execute?type=RUN`, solution);
			return response;
		} catch (error) {
			throw error;
		}
	},
	submitSolution: async (solution: Solution): Promise<Submission> => {
		try {
			console.log(`Submit solution: ${JSON.stringify(solution)}`);
			const response = await apiClient.post<Submission>(`${API_CONFIG.API_END_POINT.SUBMISSION}/execute?type=RUN`, solution);
			return response;
		} catch (error) {
			throw error;
		}
	},
	getSubmissions: async (problemId: string): Promise<Submission[]> => {
		try {
			console.log(`Get all submission with ProblemId: ${problemId}`);
			const response = await apiClient.get<Submission[]>(
				`${API_CONFIG.API_END_POINT.SUBMISSION}?problemId=${problemId}`
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
	getResultBySubmission: async (id: string): Promise<Result[]> => {
		try {
			console.log(`Get all result with submissionId: ${id}`);
			const response = await apiClient.get<Result[]>(
				`${API_CONFIG.API_END_POINT.SUBMISSION}/${id}`
			)
			return response;
		} catch (error) {
			throw error;
		}
	}
}