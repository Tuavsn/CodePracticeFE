'use client'
import { useAuthStore } from "@/store/use-auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useComment } from "@/hooks/use-comment";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import('@/components/text-editor'), { ssr: false })

interface CommentInputProps {
	postId?: string;
	problemId?: string;
}

export default function CommentInput({ postId, problemId }: CommentInputProps) {

	const { user } = useAuthStore();

	const { isLoading, formData, handleFormDataChange, handleSubmit } = useComment({postId, problemId});

	if (!user) return (<></>)

	useEffect(() => {

	}, [formData])

	return (
		<div className="flex space-x-4">
			{/* User Avatar */}
			<Avatar className="rounded-lg h-15 w-15">
				<AvatarImage src={user.avatar} alt={user.username} />
				<AvatarFallback>{user.email}</AvatarFallback>
			</Avatar>
			{/* Input Form */}
			<form onSubmit={handleSubmit} className="flex-1 space-y-4">
				<div>
					<TextEditor
						data={formData.content}
						setData={(value: string) => handleFormDataChange('content', value)}
					/>
				</div>
				<div className="mt-2 flex justify-end">
					<Button type="submit" className="bg-black hover:bg-gray-800 text-white font-medium px-6" disabled={!formData.content.trim() || isLoading} >
						{isLoading ? "Submitting..." : "Submit Comment"}
					</Button>
				</div>
			</form>
		</div>
	)
}