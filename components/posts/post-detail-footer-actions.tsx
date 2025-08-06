'use client'
import { Edit, Heart, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Post } from "@/types/post";
import { usePost } from "@/hooks/use-post";
import { usePostContext } from "@/contexts/post-context";
import { useAuthContext } from "@/contexts/auth-context";

interface PostDetailFooterActionsProps {
    post: Post;
}

export default function PostDetailFooterActions({ post }: PostDetailFooterActionsProps) {

    const { user } = useAuthContext();

    const { openEditModal } = usePostContext();

    const { handleLikePost, handleDislikePost } = usePost();

    return (
        <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-6">
                {/* Like Button */}
                {/* <Button variant={"ghost"} onClick={() => handleLikePost}>
                    <Heart className={`h-4 w-4 ${true ? 'fill-current text-red-500' : ''}`} />
                    {post.postReactions ? post.postReactions.length : 0} Like
                </Button> */}
                {/* Comment Button */}
                {/* <Button variant={"ghost"}>
                    <MessageCircle className="h-4 w-4" />
                    {post.postComments ? post.postComments.length : 0} Comments
                </Button> */}
                {/* Share Button */}
                {/* <Button variant={"ghost"}>
                    <Share className="h-4 w-4" />
                    Share
                </Button> */}
                {/* Edit Button */}
                {user && user.id == post.author.id && (
                    <Button variant={"ghost"} onClick={() => openEditModal(post)}>
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                )}
            </div>
            {/* <Button variant={"ghost"}>
                <Bookmark className="h-4 w-4" />
            </Button> */}
        </div>
    )
}