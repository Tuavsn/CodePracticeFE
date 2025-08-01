import { Post } from "@/types/post";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bookmark, Edit, Heart, MessageCircle, Share } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";
import CommentList from "../comments/comment-list";
import ContentDisplay from "../content-display";
import Link from "next/link";

interface PostDetailProps {
	post: Post;
	isLiked?: boolean;
	isCommentd?: boolean;
	handleLike?: () => void;
}

export default function ({
	post,
	isLiked,
	isCommentd,
	handleLike,
}: PostDetailProps) {

	return (
		<article>
			<Card className="p-8 mb-8 border-0 gap-2 shadow-2xl">
				{/* Post Header */}
				<div className="flex items-center justify-between">
					{/* Author Info */}
					<div className="flex items-center space-x-4">
						<Avatar className="h-12 w-12">
							<AvatarImage src={post.author.avatar || '/placeholder.svg'} alt={post.author.username} />
							<AvatarFallback>{post.author.email}</AvatarFallback>
						</Avatar>
						<div>
							<Link href={`/profile/${post.author.id}`} className="font-semibold text-lg hover:underline hover:text-[#0476D0]">
								{post.author.username}
							</Link>
							<p className="text-sm text-muted-foreground">
								{formatDate(post.createdAt as string)}
								{post.updatedAt !== post.createdAt && " (updated)"}
							</p>
						</div>
					</div>
					{/* Edit Button */}
					<Button variant={"outline"} size={"sm"} className="cursor-pointer">
						<Edit className="h-4 w-4 mr-2" />
						Edit
					</Button>
				</div>
				{/* Post Title */}
				<h1 className="text-3xl font-bold">{post.title}</h1>
				{/* Post Tags */}
				<div className="flex flex-wrap gap-2">
					{post.topics.map((topic, index) => (
						<Badge key={index} variant={"secondary"}>
							#{topic}
						</Badge>
					))}
				</div>
				{/* Content With Images */}
				<div className="prose prose-lg max-w-none">
					{post.images && (
						post.images.map((image, index) => (
							<Image
								key={index}
								src={image.url}
								alt={image.url}
								width={0}
								height={0}
								sizes="100vw"
								className="w-full h-auto rounded-lg mb-6"
							/>
						))
					)}
					{/* Content Text */}
					<ContentDisplay content={post.content} />
				</div>
				{/* Post Actions */}
				<div className="flex items-center justify-between pt-6 border-t">
					<div className="flex items-center space-x-6">
						{/* Like Button */}
						<Button variant={"ghost"} className="cursor-pointer" onClick={handleLike}>
							<Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
							{post.postReactions ? post.postReactions.length : 0} Like
						</Button>
						{/* Comment Button */}
						<Button variant={"ghost"} className="cursor-pointer">
							<MessageCircle className="h-4 w-4" />
							{post.postComments ? post.postComments.length : 0} Comments
						</Button>
						{/* Share Button */}
						<Button variant={"ghost"} className="cursor-pointer">
							<Share className="h-4 w-4" />
							Share
						</Button>
					</div>
					<Button variant={"ghost"} className="cursor-pointer">
						<Bookmark className="h-4 w-4" />
					</Button>
				</div>
				{/* Comment Sections */}
				<div id="comments">
					<CommentList postId={post.id} />
				</div>
			</Card>
		</article>
	)
}
