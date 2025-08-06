'use client'
import { Button } from "../ui/button"
import { Loader2, MoreHorizontal } from "lucide-react"
import { Post } from "@/types/post";
import { useAuthContext } from "@/contexts/auth-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { usePost } from "@/hooks/use-post";
import { usePostContext } from "@/contexts/post-context";

interface PostCardHeaderActionProps {
	post: Post;
}

export default function PostCardHeaderActions({ post }: PostCardHeaderActionProps) {

	const { user } = useAuthContext();

	const { openEditModal } = usePostContext();

	const { isLoading, handleDeletePost, handleCopyLink } = usePost();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} size={"icon"}>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{/* <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Hidden</DropdownMenuItem> */}
				<DropdownMenuItem onClick={() => handleCopyLink(post)}>Copy Link</DropdownMenuItem>
				{user && user.id == post.author.id && (
					<>
						<DropdownMenuItem onClick={() => openEditModal(post)}>Edit</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleDeletePost(post.id)}>
							{isLoading ? (
								<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting...</>
							) : (
								<>Delete</>
							)}
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}