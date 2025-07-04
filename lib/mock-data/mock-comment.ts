import { PostComment } from "@/types/post";
import { mockUsers } from "./mock-user";
import { User } from "@/types/user";

export const mockComments: Partial<PostComment>[] = [
  {
    id: "1",
    content: "Great post! Very helpful for beginners.",
    user: mockUsers[1] as User,
    // postId: "1",
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
    // likes: 5,
  },
  {
    id: "2",
    content: "Thanks for sharing this. Could you elaborate on the server components part?",
    user: mockUsers[0] as User,
    // postId: "1",
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
    // likes: 3,
  },
]