import { Card } from "../ui/card";
import CommentCard from "./comment-card";
import { MessageCircle } from "lucide-react";
import { CommentService } from "@/lib/services/comment.service";
import CommentInput from "./comment-input";

interface CommentListProps {
  postId: string;
}

export default async function CommentList({ postId }: CommentListProps) {

  const comments = await CommentService.getCommentsByPostId(postId);

  const sortedComments = comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      <Card className="rounded-none border-0 shadow-none">
        <h2 className="flex gap-2 items-center text-lg font-semibold"><MessageCircle className="h-6 w-6" />({comments.length}) Discussion</h2>
        {/* Add Comment Form */}
        <CommentInput postId={postId} />
        {/* Comments */}
        {sortedComments.map((comment) => (
          <CommentCard comment={comment} key={comment.id} />
        ))}
        {/* No Comments Found */}
        {sortedComments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No Comment Found!!!</p>
          </div>
        )}
      </Card>
    </div>
  )
}