import { CreateProblemCommentRequest, CreateProblemRequest, Problem, PROBLEM_COMPLEXITY, ProblemComment, UpdateProblemCommentRequest, UpdateProblemRequest } from "@/types/problem";
import { apiClient, FilterParams, PaginationData, PaginationParams } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";

export const ProblemService = {
	//================================ Problem =======================================
	getProblems: async (
		params: PaginationParams & FilterParams & { difficulty?: (keyof typeof PROBLEM_COMPLEXITY) }
	): Promise<PaginationData<Problem[]>> => {
		try {
			const defaultParams: Required<PaginationParams & FilterParams & { difficulty?: (keyof typeof PROBLEM_COMPLEXITY) }> = {
				page: 0,
				size: 6,
				sort: "desc",
				difficulty: "ALL",
				tags: [],
				search: "",
			};

			const finalParams = { ...defaultParams, ...params };

			const queryObject: Record<string, string> = {
				page: finalParams.page.toString(),
				size: finalParams.size.toString(),
				sortDir: finalParams.sort,
			};

			if (finalParams.difficulty !== 'ALL') {
				queryObject.difficulty = finalParams.difficulty;
			}

			if (finalParams.tags.length > 0) {
				queryObject.tags = finalParams.tags.join(",");
			}

			if (finalParams.search) {
				queryObject.title = finalParams.search;
			}

			const queryParams = new URLSearchParams(queryObject);
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}?${queryParams.toString()}`;
			console.log("Fetching all problems with url:", url);

			return await apiClient.getWithPaginated<Problem[]>(url);
		} catch (error) {
			throw error;
		}
	},
	getProblemById: async (problemId: string): Promise<Problem> => {
		try {
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}/${problemId}`;
			console.log('Fetching problem with url: ' + url);
			const response = await apiClient.get<Problem>(url);
			return response;
		} catch (error) {
			throw error
		}
	},
	createProblem: async (request: CreateProblemRequest): Promise<Problem> => {
		try {
			const url = API_CONFIG.API_END_POINT.PROBLEM;
			console.log('Create problem with url: ' + url);
			const response = await apiClient.post<Problem>(url, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	updateProblem: async (id: string, request: UpdateProblemRequest): Promise<Problem> => {
		try {
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}/${id}`;
			console.log('Update problem with url: ' + url);
			const response = await apiClient.put<Problem>(url, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	deleteProblem: async (id: string): Promise<void> => {
		try {
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}/${id}`;
			console.log('Delete problem with url: ' + url);
			await apiClient.delete(url);
		} catch (error) {
			throw error;
		}
	},
	//================================ Comment =======================================
	getCommentsByProblemId: async (problemId: string): Promise<ProblemComment[]> => {
		try {
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}/${problemId}/comments`;
			console.log('Fetching all comments with url: ' + url);
			const response = await apiClient.get<ProblemComment[]>(url);
			return response;
		} catch (error) {
			throw error;
		}
	},
	createProblemComment: async (problemId: string, request: CreateProblemCommentRequest): Promise<ProblemComment> => {
		try {
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}/${problemId}/comments`;
			console.log('Create problem comment with url: ' + url);
			const response = await apiClient.post<ProblemComment>(url, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	updateProblemComment: async (problemId: string, commentId: string, request: UpdateProblemCommentRequest): Promise<ProblemComment> => {
		try {
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}/${problemId}/comments/${commentId}`;
			console.log('Update problem comment with url: ' + url);
			const response = await apiClient.post<ProblemComment>(url, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	deleteProblemComment: async (problemId: string, commentId: string): Promise<void> => {
		try {
			const url = `${API_CONFIG.API_END_POINT.PROBLEM}/${problemId}/comments/${commentId}`;
			console.log('Delete problem with url: ' + url);
			await apiClient.delete(url);
		} catch (error) {
			throw error;
		}
	},
	//================================ Reaction =======================================
}