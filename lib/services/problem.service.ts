import { CreateProblemRequest, Problem, UpdateProblemRequest } from "@/types/problem";
import { apiClient } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";

export const ProblemService = {
	getProblems: async (): Promise<Problem[]> => {
		try {
			console.log("Fetching all problems with url: " + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.get<Problem[]>(
				`${API_CONFIG.API_END_POINT.PROBLEM}`,
				{
					cache: true,
					cacheTTL: 5 * 60 * 1000
				}
			);
			return response;
		} catch (error) {
			throw error;
		}
	},
	getProblemById: async (id: string): Promise<Problem> => {
		try {
			console.log(`Fetching problem with id: ${id} ` + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.get<Problem>(
				`${API_CONFIG.API_END_POINT.PROBLEM}/${id}`,
				{
					cache: true,
					cacheTTL: 10 * 60 * 1000
				}
			);
			return response;
		} catch (error) {
			throw error
		}
	},
	createProblem: async (request: CreateProblemRequest): Promise<Problem> => {
		try {
			console.log(`Create problem: ${JSON.stringify(request)}` + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.post<Problem>(`${API_CONFIG.API_END_POINT.PROBLEM}`, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	updateProblem: async (id: string, request: UpdateProblemRequest): Promise<Problem> => {
		try {
			console.log(`Update problem: ${JSON.stringify(request)} with id: ${id}` + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.put<Problem>(`${API_CONFIG.API_END_POINT.PROBLEM}/${id}`, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	deleteProblem: async (id: string): Promise<void> => {
		try {
			console.log(`Delete problem with id: ${id}` + API_CONFIG.API_END_POINT.PROBLEM);
			await apiClient.delete(`${API_CONFIG.API_END_POINT.PROBLEM}/${id}`);
		} catch (error) {
			throw error;
		}
	}
}