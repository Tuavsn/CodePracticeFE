import { PostComment } from "@/types/post";
import { ProblemComment } from "@/types/problem";
import { useState } from "react";

export function useComment() {
	const [comment, setComment] = useState<PostComment | ProblemComment | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createComment = async () => {

	}

	const updateComment = async () => {

	}

	const deleteComment = async () => {

	}

	const resetComment = () => {

	}

	const clearError = () => {

	}

	return {
		// states
		comment,
		isLoading,
		error,
		// actions
		createComment,
		updateComment,
		deleteComment,
		resetComment,
		clearError
	}
}