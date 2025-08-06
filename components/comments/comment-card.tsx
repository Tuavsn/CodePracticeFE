import { PostComment } from "@/types/post";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import CommentCardFooterActions from "./comment-card-footer-actions";
import CommentCardHeaderActions from "./comment-card-header-actions";
import ContentDisplay from "../content-display";

interface CommentCardProps {
  comment: PostComment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card className="rounded-none border-none shadow-none p-4">
      <div className="flex space-x-3">
        {/* Avatar */}
        <Avatar className="rounded-lg h-12 w-12">
          <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
          <AvatarFallback>{comment.author.email}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="space-x-2">
              <Link
                className="font-semibold hover:underline hover:text-[#0476D0]"
                href={`/profile/${comment.author.id}`}>
                {comment.author.username}
              </Link>
              <div className="text-sm text-muted-foreground">
                {formatDate(comment.createdAt)}
                {comment.createdAt !== comment.updatedAt && " (Edited)"}
              </div>
            </div>
            {/* Action Buttons (Edit | Delete | Report) */}
            <CommentCardHeaderActions comment={comment} />
          </div>
          {/* Content */}
          <ContentDisplay content={comment.content} />
          {/* Footer */}
          <CommentCardFooterActions comment={comment} />
        </div>
      </div>
    </Card>
  )
}