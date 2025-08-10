import { CreatePostCommentRequest, CreatePostRequest, Post, PostComment, PostReaction, UpdatePostCommentRequest, UpdatePostRequest } from "@/types/post";
import { apiClient, FilterParams, PaginationData, PaginationParams } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";
import { CommentReaction } from "@/types/problem";


export const PostService = {
  //================================ Post =======================================
  getPosts: async (
    params: PaginationParams & FilterParams
  ): Promise<PaginationData<Post[]>> => {
    try {
      const defaultParams: Required<PaginationParams & FilterParams> = {
        page: 0,
        size: 5,
        sort: "desc",
        tags: [],
        search: "",
      };

      const finalParams = { ...defaultParams, ...params };

      const queryObject: Record<string, string> = {
        page: finalParams.page.toString(),
        size: finalParams.size.toString(),
        sortDir: finalParams.sort,
      };

      if (finalParams.tags.length > 0) {
        queryObject.tags = finalParams.tags.join(",");
      }

      if (finalParams.search) {
        queryObject.title = finalParams.search;
      }

      const queryParams = new URLSearchParams(queryObject);
      const url = `${API_CONFIG.API_END_POINT.POST}?${queryParams.toString()}`;
      console.log('Fetching posts with url: ' + url)
      const response = await apiClient.getWithPaginated<Post[]>(url);
      return response;
    } catch (error) {
      throw error
    }
  },
  getPostById: async (postId: string): Promise<Post> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}`;
      console.log('Fetching post with url: ' + url);
      const response = await apiClient.get<Post>(url);
      return response;
    } catch (error) {
      throw error
    }
  },
  createPost: async (request: CreatePostRequest): Promise<Post> => {
    try {
      const url = API_CONFIG.API_END_POINT.POST;
      console.log('Create post with url: ' + url);
      const response = await apiClient.post<Post>(url, request);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updatePost: async (postId: string, request: UpdatePostRequest): Promise<Post> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}`;
      console.log('Update post with url: ' + url);
      const response = await apiClient.put<Post>(url, request);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deletePost: async (postId: string): Promise<void> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}`;
      console.log('Delete post with url: ' + url);
      await apiClient.delete(url);
    } catch (error) {
      throw error;
    }
  },
  //================================ Comment =======================================
  getCommentsByPostId: async (postId: string): Promise<PostComment[]> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}/comments`;
      console.log('Fetching all comments with url: ' + url);
      const response = await apiClient.get<PostComment[]>(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  createPostComment: async (postId: string, request: CreatePostCommentRequest): Promise<PostComment> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}/comments`;
      console.log('Create post comment with url: ' + url);
      const response = await apiClient.post<PostComment>(url, request);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updatePostComment: async (postId: string, commentId: string, request: UpdatePostCommentRequest): Promise<PostComment> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}/comments/${commentId}`;
      console.log('Update post comment with url: ' + url);
      const response = await apiClient.post<PostComment>(url, request);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deletePostComment: async (postId: string, commentId: string): Promise<void> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}/comments/${commentId}`;
      console.log('Delete post with url: ' + url);
      await apiClient.delete(url);
    } catch (error) {
      throw error;
    }
  },
  //================================ Reaction =======================================
  reactionPost: async (postId: string, type: PostReaction): Promise<void> => {
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}/reactions?${type}`;
      console.log(`${type} post with url: ` + url);
      await apiClient.post<Post>(url)
    } catch (error) {
      throw error;
    }
  },
  reactionComment: async (postId: string, commentId: string, type: CommentReaction): Promise<void> => {
    // TODO
    try {
      const url = `${API_CONFIG.API_END_POINT.POST}/${postId}/comments/${commentId}/reactions?`;
      console.log(`${type} comment with url: ` + url);
    } catch (error) {
      throw error;
    }
  }
}