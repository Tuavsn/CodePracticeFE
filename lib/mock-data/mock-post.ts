import { Post, POST_STATUS } from "@/types/post";
import { mockUsers } from "./mock-user";
import { User } from "@/types/user";

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    content: "Next.js 14 brings amazing new features includingNext.js 14 brings amazing new features includingNext.js 14 brings amazing new features includingNext.js 14 brings amazing new features includingNext.js 14 brings amazing new features includingNext.js 14 brings amazing new features includingNext.js 14 brings amazing new features including...",
    user: mockUsers[0] as User,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    status: POST_STATUS.ATIVE,
    postImages: [
      { imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh0ToWI22HYMc0shiLaaOSYNCPRc9c-MqaWw&s" }
    ],
    postComments: [],
    postReactions: [],
    tags: [
      { title: "nextjs" },
      { title: "react" },
      { title: "javascript" }
    ]
  },
  {
    id: "2",
    title: "Best Practices for React Components",
    content: "Here are some best practices when building React componentsHere are some best practices when building React componentsHere are some best practices when building React componentsHere are some best practices when building React componentsHere are some best practices when building React componentsHere are some best practices when building React components...",
    user: mockUsers[1] as User,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    status: POST_STATUS.CLOSED,
    postImages: [
      { imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh0ToWI22HYMc0shiLaaOSYNCPRc9c-MqaWw&s" }
    ],
    postComments: [],
    postReactions: [],
    tags: [
      { title: "react" },
      { title: "components" },
      { title: "best-practices" }
    ]
  }
];