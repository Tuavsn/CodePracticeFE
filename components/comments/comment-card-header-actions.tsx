'use client'
import { PostComment } from "@/types/post";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useComment } from "@/hooks/use-comment";
import { useAuthContext } from "@/contexts/auth-context";

interface CommentCardHeaderActionProps {
    comment: PostComment;
}

export default function CommentCardHeaderActions({ comment }: CommentCardHeaderActionProps) {

    const { user } = useAuthContext();

    const { handleDeleteComment, handleFormDataChange } = useComment();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {user && user.id === comment.author.id && (
                    <>
                        {/* <DropdownMenuItem onClick={() => handleFormDataChange('content', comment.content)}>Edit</DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => handleDeleteComment(comment.id, 'post')}>Delete</DropdownMenuItem>
                    </>
                )}
                {/* <DropdownMenuItem>Report</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}