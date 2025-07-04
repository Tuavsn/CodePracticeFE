import { BaseObject } from "./global";
import { User } from "./user";

export interface Post extends BaseObject {
  user: User;
  title: string;
  content: string;
  status: (keyof typeof POST_STATUS);
  postImages: {
    imageURL: string
  }[];
  postComments: PostComment[];
  postReactions: PostReaction[];
  tags: {
    title: string;
  }[]
}

export interface PostReaction extends BaseObject {
  user: User;
  reaction: (keyof typeof POST_REACTION);
}

export interface PostComment extends BaseObject {
  user: User;
  content: string;
  commentReactions: CommentReaction[];
}

export interface CommentReaction extends BaseObject {
  user: User;
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