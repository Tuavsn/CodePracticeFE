import { CreatePostCommentRequest, PostComment, UpdatePostCommentRequest } from "@/types/post";
import { CreateProblemCommentRequest, ProblemComment, UpdateProblemCommentRequest } from "@/types/problem";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostService } from "@/lib/services/post.service";
import { ProblemService } from "@/lib/services/problem.service";

interface CommentFormData {
	content: string;
	parentId?: string;
}

const initialFormData: CommentFormData = {
	content: "",
	parentId: undefined
}

interface UseCommentProps {
	postId?: string;
	problemId?: string;
	editingComment?: PostComment | ProblemComment | null;
	mode?: 'create' | 'update' | 'reply';
}

export function useComment({ 
	postId,
	problemId,
	editingComment, 
	mode = 'create' 
}: UseCommentProps = {}) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<CommentFormData>(initialFormData);
	const router = useRouter();

	// Load editing comment data when in update mode
	useEffect(() => {
		if (mode === 'update' && editingComment) {
			setFormData({
				content: editingComment.content,
				parentId: editingComment.parentId || undefined
			});
		} else if (mode === 'reply' && editingComment) {
			setFormData({
				content: "",
				parentId: editingComment.id
			});
		} else {
			handleResetFormData();
		}
	}, [mode, editingComment]);

	const handleFormDataChange = (field: keyof CommentFormData, value: string | undefined) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (error) clearError();
	};

	const handleResetFormData = () => {
		setFormData(initialFormData);
	};

	const handleCreateComment = async (request: CreatePostCommentRequest | CreateProblemCommentRequest) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = ("postId" in request)
			  ? await PostService.createPostComment(request.postId, request)
			  : await ProblemService.createProblemComment(request.problemId, request);

			toast.success("Comment created successfully");
			handleResetFormData();
			router.refresh();
			return response;
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to create comment";
			setError(errMsg);
			toast.error(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateComment = async (id: string, request: UpdatePostCommentRequest | UpdateProblemCommentRequest) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = ("postId" in request)
			  ? await PostService.updatePostComment((request as UpdatePostCommentRequest).postId!, id, request)
			  : await ProblemService.updateProblemComment((request as UpdateProblemCommentRequest).problemId!, id, request);
			toast.success("Comment updated successfully");
			handleResetFormData();
			router.refresh();
			return response;
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to update comment";
			setError(errMsg);
			toast.error(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteComment = async (id: string, target: 'post' | 'problem') => {
		setIsLoading(true);
		setError(null);

		try {
			target === 'post' ? await PostService.deletePostComment('',id) : await ProblemService.deleteProblemComment('',id);
			toast.success("Comment deleted successfully");
			router.refresh();
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to delete comment";
			setError(errMsg);
			toast.error(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const handleLikeComment = async (commentId: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Uncomment khi có CommentService
			// const response = await CommentService.likeComment(commentId);
			
			// Mock like
			console.log("Liking comment:", commentId);
			toast.success("Comment liked");
			router.refresh();
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to like comment";
			setError(errMsg);
			toast.error(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const handleDislikeComment = async (commentId: string) => {
		setIsLoading(true);
		setError(null);

		try {
			// Uncomment khi có CommentService
			// const response = await CommentService.dislikeComment(commentId);
			
			// Mock dislike
			console.log("Disliking comment:", commentId);
			toast.success("Comment disliked");
			router.refresh();
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to dislike comment";
			setError(errMsg);
			toast.error(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.content.trim()) {
			toast.error("Please enter comment content");
			return;
		}

		try {
			const request = postId ? {
				postId: postId,
				content: formData.content
			} : {
				problemId: problemId!,
				content: formData.content
			}
			if (mode === 'create' || mode === 'reply') {
				await handleCreateComment(request);
			} else if (mode === 'update' && editingComment?.id) {
				await handleUpdateComment(editingComment.id, request);
			}
		} catch (error) {
			const action = mode === 'update' ? 'update' : 'create';
			toast.error(`Failed to ${action} comment`);
		}
	};

	const handleResetComment = () => {
		setError(null);
		handleResetFormData();
	};

	const clearError = () => {
		setError(null);
	};

	return {
		// states
		formData,
		isLoading,
		error,
		// actions
		handleFormDataChange,
		handleResetFormData,
		handleCreateComment,
		handleUpdateComment,
		handleDeleteComment,
		handleLikeComment,
		handleDislikeComment,
		handleSubmit,
		handleResetComment,
		clearError
	};
}