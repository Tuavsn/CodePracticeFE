'use client'

import { MessageSquare, Plus } from "lucide-react"
import { Button } from "../ui/button"
import PostModal from "./post-modal"
import { useAuthStore } from "@/store/use-auth-store"
import { usePost } from "@/hooks/use-post"

export default function PostCreateSection() {

	const { user } = useAuthStore();

	const { openCreateModal } = usePost();

	return (
		<>
			{/* Create Button */}
			{user && (
				<div className="mb-8">
					<div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-gray-200 rounded-full">
								<MessageSquare className="h-6 w-6 text-gray-800" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">Share your ideas</h3>
								<p className="text-sm text-gray-600">Create a new post to discuss with the community</p>
							</div>
						</div>
						{/* Create Post button */}
						<Button
							className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
							onClick={openCreateModal}
						>
							<Plus className="h-4 w-4 mr-2" />
							Create Post
						</Button>
					</div>
				</div>
			)}
			{/* Post Modal */}
			<PostModal />
		</>
	)
}