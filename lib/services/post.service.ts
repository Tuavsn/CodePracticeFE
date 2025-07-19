import { Post } from "@/types/post";
import { apiClient } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";

export const PostService = {
  getPosts: async(): Promise<Post[]> => {
    try {
      const response = await apiClient.get<Post[]>(
        `${API_CONFIG.API_END_POINT.POST}`,
        {
          cache: true,
          cacheTTL: 5 * 60 * 1000
        }
      );
      return response;
    } catch (error) {
      throw error
    }
  },
  getPostById: async(id: string): Promise<Post> => {
    try {
      const response = await apiClient.get<Post>(
        `${API_CONFIG.API_END_POINT.POST}/${id}`,
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
  // createPost: async(): Promise<Post> {
  //   try {

  //   } catch (error) {

  //   }
  // },
  // updatePost: async(): Promise<Post> {
  //   try {

  //   } catch (error) {

  //   }
  // },
  // deletePost: async(): Promise<void> {
  //   try {

  //   } catch (error) {

  //   }
  // }
}