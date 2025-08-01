import { CreatePostRequest, Post, UpdatePostRequest } from "@/types/post";
import { apiClient } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";

export const PostService = {
  getPosts: async (): Promise<Post[]> => {
    try {
      console.log("Fetching posts with url:" + API_CONFIG.API_END_POINT.POST)
      const response = await apiClient.get<Post[]>(
        `${API_CONFIG.API_END_POINT.POST}`,
        // {
        //   cache: true,
        //   cacheTTL: 5 * 60 * 1000
        // }
      );
      return response;
    } catch (error) {
      throw error
    }
  },
  getPostById: async (id: string): Promise<Post> => {
    try {
      console.log(`Fetching post with id: ${id} ` + API_CONFIG.API_END_POINT.POST);
      const response = await apiClient.get<Post>(
        `${API_CONFIG.API_END_POINT.POST}/${id}`,
        // {
        //   cache: true,
        //   cacheTTL: 10 * 60 * 1000
        // }
      );
      return response;
    } catch (error) {
      throw error
    }
  },
  createPost: async(request: CreatePostRequest): Promise<Post> => {
    try {
      console.log(`Create post: ${JSON.stringify(request)}` + API_CONFIG.API_END_POINT.POST);
      const response = await apiClient.post<Post>(`${API_CONFIG.API_END_POINT.POST}`, request);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updatePost: async(id: string, request: UpdatePostRequest): Promise<Post> => {
    try {
      console.log(`Update post: ${JSON.stringify(request)} with id: ${id}` + API_CONFIG.API_END_POINT.POST);
      const response = await apiClient.put<Post>(`${API_CONFIG.API_END_POINT.POST}/${id}`, request);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deletePost: async(id: string): Promise<void> => {
    try {
      console.log(`Delete post with id: ${id}` + API_CONFIG.API_END_POINT.POST);
      await apiClient.delete(`${API_CONFIG.API_END_POINT.POST}/${id}`);
    } catch (error) {
      throw error;
    }
  }
}