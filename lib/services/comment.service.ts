import { CreatePostCommentRequest, PostComment, UpdatePostCommentRequest } from "@/types/post";
import { CreateProblemCommentRequest, ProblemComment, UpdateProblemCommentRequest } from "@/types/problem";
import { API_CONFIG } from "../api/api-config";
import { apiClient } from "../api/api-client";

export const CommentService = {
	// Post
	getCommentsByPostId: async (postId: string): Promise<PostComment[]> => {
		try {
			console.log(`Fetching all comments with postId: ${postId}` + API_CONFIG.API_END_POINT.POST);
			const response = await apiClient.get<PostComment[]>(
				`${API_CONFIG.API_END_POINT.POST}/${postId}/comments`,
				// {
				// 	cache: true,
				// 	cacheTTL: 5 * 60 * 1000
				// }
			)
			return response;
		} catch (error) {
			throw error;
		}
	},
	createPostComment: async (request: CreatePostCommentRequest): Promise<PostComment> => {
		try {
			console.log(`Create post comment: ${JSON.stringify(request)}` + API_CONFIG.API_END_POINT.POST);
			const response = await apiClient.post<PostComment>(`${API_CONFIG.API_END_POINT.POST}/comments`, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	updatePostComment: async (id: string, request: UpdatePostCommentRequest): Promise<PostComment> => {
		try {
			console.log(`Update post comment: ${JSON.stringify(request)}` + API_CONFIG.API_END_POINT.POST);
			const response = await apiClient.post<PostComment>(`${API_CONFIG.API_END_POINT.POST}/comments/${id}`, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	deletePostComment: async (id: string): Promise<void> => {
		try {
			console.log(`Delete post with id: ${id}` + API_CONFIG.API_END_POINT.POST);
			await apiClient.delete(`${API_CONFIG.API_END_POINT.POST}/comments/${id}`);
		} catch (error) {
			throw error;
		}
	},
	// Problem
	getCommentsByProblemId: async (problemId: string): Promise<ProblemComment[]> => {
		try {
			console.log(`Fetching all comments with problemId: ${problemId}` + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.get<ProblemComment[]>(
				`${API_CONFIG.API_END_POINT.PROBLEM}/${problemId}/comments`,
				{
					cache: true,
					cacheTTL: 5 * 60 * 1000
				}
			)
			return response;
		} catch (error) {
			throw error;
		}
	},
	createProblemComemnt: async (request: CreateProblemCommentRequest): Promise<ProblemComment> => {
		try {
			console.log(`Create problem comment: ${JSON.stringify(request)}` + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.post<ProblemComment>(`${API_CONFIG.API_END_POINT.PROBLEM}/comments`, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	updateProblemComment: async (id: string, request: UpdateProblemCommentRequest): Promise<ProblemComment> => {
		try {
			console.log(`Update problem comment: ${JSON.stringify(request)}` + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.post<ProblemComment>(`${API_CONFIG.API_END_POINT.PROBLEM}/comments/${id}`, request);
			return response;
		} catch (error) {
			throw error;
		}
	},
	deleteProblemComment: async (id: string): Promise<void> => {
		try {
			console.log(`Delete problem with id: ${id}` + API_CONFIG.API_END_POINT.PROBLEM);
			await apiClient.delete(`${API_CONFIG.API_END_POINT.PROBLEM}/comments/${id}`);
		} catch (error) {
			throw error;
		}
	},
}