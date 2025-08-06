import { BaseObject } from "./global";
import { User } from "./user";

export interface Post extends BaseObject {
  author: User;
  title: string;
  thumbnail: string;
  content: string;
  topics: string[];
  images: {
    url: string,
    order: number
  }[];
  postComments: PostComment[];
  postReactions: PostReaction[];
  status: (keyof typeof POST_STATUS);
}

export type CreatePostRequest = Pick<Post, 'title' | 'thumbnail' | 'content' | 'topics' | 'images'>;

export type UpdatePostRequest = Partial<CreatePostRequest>;

export interface PostReaction extends BaseObject {
  author: User;
  reaction: (keyof typeof POST_REACTION);
}

export interface PostComment extends BaseObject {
  parentId: string;
  postId: string;
  author: User;
  content: string;
  commentReactions: CommentReaction[];
}

export type CreatePostCommentRequest = Pick<PostComment, 'content' | 'postId'>;

export type UpdatePostCommentRequest = Partial<CreatePostCommentRequest>;

export interface CommentReaction extends BaseObject {
  author: User;
  reaction: (keyof typeof COMMENT_REACTION);
}

export const POST_REACTION = {
  LIKE: 'Like',
  DISLIKE: 'Dislike'
}

export const NOTIFICATION_STATUS = {
  READ: 'Read',
  UNREAD: 'Unread'
}

export const POST_STATUS = {
  ATIVE: 'Active',
  CLOSED: 'Closed'
}

// Comment
export const COMMENT_REACTION = {
  LIKE: 'Like',
  DISLIKE: 'Dislike'
}