import { User } from "@/types/user";
import { apiClient } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";
import { Post, PostComment } from "@/types/post";

export interface UserRequest {

}

export const UserService = {
  // getPersonalProfile: async(): Promise<User> {
  //   try {
      
  //   } catch (error) {

  //   }
  // },
  // updatePersonalProfile: async(id: string): Promise<User> {
  //   try {

  //   } catch (error) {

  //   }
  // },
  // getPersonalPosts: async(): Promise<Post[]> {

  // },
  // getPersonalComments: async(): Promise<PostComment[]> {

  // },
  // gerProfile: async(id: string): Promise<User> {
  //   try {
  //     const response = await apiClient.get<User>(`${API_CONFIG.API_END_POINT.USER}/profile?id=${id}`);
  //   } catch (error) {

  //   }
  // },
}