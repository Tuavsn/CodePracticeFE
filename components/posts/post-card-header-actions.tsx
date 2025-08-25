'use client'
import { Button } from "../ui/button"
import { Loader2, MoreHorizontal } from "lucide-react"
import { Post } from "@/types/post";
import { useAuthStore } from "@/store/use-auth-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { usePost } from "@/hooks/use-post";

interface PostCardHeaderActionProps {
	post: Post;
}

export default function PostCardHeaderActions({ post }: PostCardHeaderActionProps) {

	const { user } = useAuthStore();

	const {
		loading: isLoading,
		openEditModal,
		handleRemovePost,
		handleCopyLink
	} = usePost();

	const handleEdit = (post: Post) => {
		openEditModal(post);
	}

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
						<DropdownMenuItem onClick={() => handleEdit(post)}>Edit</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleRemovePost(post.id)}>
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