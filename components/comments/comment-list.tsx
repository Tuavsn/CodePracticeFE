import { Card } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "../ui/textarea";
import CommentCard from "./comment-card";
import { MessageCircle } from "lucide-react";
import { CommentService } from "@/lib/services/comment.service";

interface CommentListProps {
  postId: string;
}

export default async function CommentList({ postId }: CommentListProps) {
  const comments = await CommentService.getCommentsByPostId(postId);

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No Comments Found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-none border-0 shadow-none">
        <h2 className="flex gap-2 items-center text-2xl font-bold"><MessageCircle className="h-6 w-6" />Discussion ({comments.length})</h2>
        {/* Add Comment Form */}
        <div className="flex space-x-4">
          {/* User Avatar */}
          <Avatar className="rounded-lg h-15 w-15">
            {/* <AvatarImage src={mockUsers[0].avatar || '/placeholder.svg'} alt={mockUsers[0].username} />
            <AvatarFallback>{mockUsers[0].email}</AvatarFallback> */}
          </Avatar>
          {/* Input Form */}
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="Write your comment..."
              // value={newComment}
              // onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              {/* <Button disabled={!newComment.trim() || isSubmitting} >
                {isSubmitting ? "Submitting..." : "Submit Comment"}
              </Button> */}
            </div>
          </div>
        </div>
        {/* Comments */}
        {comments.map((comment) => (
          <CommentCard comment={comment} key={comment.id} />
        ))}
        {/* No Comments Found */}
        {comments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No Comment Found!!!</p>
          </div>
        )}
      </Card>
    </div>
  )
}