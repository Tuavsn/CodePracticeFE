'use client'
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { PostComment } from "@/types/post";

interface CommentCardFooterActionProps {
    comment: PostComment;
}

export default function CommentCardFooterActions({ comment }: CommentCardFooterActionProps) {
    return (
        <div className="flex items-center space-x-4">
            {/* <Button
                variant={"ghost"}
                size="sm"
                className={`h-6 text-xs`}
            >
                <Heart className="h-3 w-3" />
                {comment.commentReactions ? comment.commentReactions.length : 0}
            </Button>
            <Button
                variant={"ghost"}
                size="sm"
                className="h-6 text-xs"
            >
                <MessageCircle className="h-3 w-3" />
                Reply
            </Button> */}
        </div>
    )
}