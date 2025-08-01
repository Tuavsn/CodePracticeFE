import { PostComment } from "@/types/post";
import { ProblemComment } from "@/types/problem";
import { API_CONFIG } from "../api/api-config";
import { apiClient } from "../api/api-client";

export const CommentService = {
	getCommentsByPostId: async (postId: string): Promise<PostComment[]> => {
		try {
			console.log(`Fetching all comments with postId: ${postId}` + API_CONFIG.API_END_POINT.POST);
			const response = await apiClient.get<PostComment[]>(
				`${API_CONFIG.API_END_POINT.POST}/${postId}/comments`,
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
	getCommentsByProblemId: async (problemId: string): Promise<ProblemComment[]> => {
		try {
			console.log(`Fetching all comments with problemId: ${problemId}` + API_CONFIG.API_END_POINT.PROBLEM);
			const response = await apiClient.get<PostComment[]>(
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
	}
}