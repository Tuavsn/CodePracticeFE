import { PostComment } from "@/types/post";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";

interface CommentCardProps {
  comment: PostComment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
}

export default function CommentCard({ comment, onLike, onReply }: CommentCardProps) {
  return (
    <Card className="rounded-none border-none shadow-none p-4">
      <div className="flex space-x-3">
        {/* Avatar */}
        <Avatar className="rounded-lg h-12 w-12">
          <AvatarImage src={comment.user.avatar || '/placeholder.svg'} alt={comment.user.username} />
          <AvatarFallback>{comment.user.email}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="space-x-2">
              <Link
                className="font-semibold hover:underline hover:text-[#0476D0]"
                href={`/profile/${comment.user.id}`}>
                {comment.user.username}
              </Link>
              <div className="text-sm text-muted-foreground">
                {formatDate(comment.createdAt as string)}
                {comment.createdAt !== comment.updatedAt && " (Edited)"}
              </div>
            </div>
            {/* Action Buttons (Edit | Delete | Report) */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"ghost"} size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Content */}
          <p className="text-sm leading-relaxed">{comment.content}</p>
          {/* Footer */}
          <div className="flex items-center space-x-4">
            <Button
              variant={"ghost"}
              size="sm"
              className={`h-6 text-xs`}
            >
              <Heart className="h-3 w-3" />
              0
              {/* {comment.commentReactions.length > 0 && comment.commentReactions.length} */}
            </Button>
            <Button
              variant={"ghost"}
              size="sm"
              className="h-6 text-xs"
            >
              <MessageCircle className="h-3 w-3" />
              Reply
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}