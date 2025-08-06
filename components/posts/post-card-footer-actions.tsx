'use client'

import { Heart, MessageCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Post } from "@/types/post";

interface PostCardFooterActionProps {
	post: Post;
}

export default function PostCardFooterActions({ post }: PostCardFooterActionProps) {
	return (
		<div className="w-full flex items-center justify-between">
			{/* Post action buttons (Like, Comment & Share) */}
			<div className="flex items-center space-x-4">
				{/* Like Button */}
				{/* <Button variant={'ghost'}>
					<Heart className="h-4 w-4" />
					{post.postReactions ? post.postReactions.length : 0}
				</Button>
				Comment Button */}
				{/* <Button variant={'ghost'}>
					<MessageCircle className="h-4 w-4" />
					{post.postComments ? post.postComments.length : 0}
				</Button> */}
				{/* Share Button */}
				{/* <Button variant={'ghost'}>
                <Share />
                Share Post
                </Button> */}
			</div>
			{/* Bookmark button */}
			{/* <Button variant={'ghost'}>
                <Bookmark className="h-4 w-4" />
            </Button> */}
		</div>
	)
}