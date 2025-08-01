import { PostService } from "@/lib/services/post.service";
import { CreatePostRequest, Post, UpdatePostRequest } from "@/types/post";
import { useState } from "react";

interface PostFormData {
	title: string;
	content: string;
	thumbnail: string;
	topics: string;
	images: { url: string, order: number }[];
}

const initialFormData: PostFormData = {
	title: "",
	content: "",
	thumbnail: "",
	topics: "",
	images: []
}

export function usePost() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<PostFormData>(initialFormData);

	const handleFormDataChange = (field: keyof PostFormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (error) clearError();
	}

	const handleResetFormData = () => {
		setFormData(initialFormData)
	}

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const validateImageFile = (file: File): boolean => {
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		const maxSize = 5 * 1024 * 1024; // 5MB

		if (!validTypes.includes(file.type)) {
			setError('Invalid file type. Please select JPG, PNG, GIF, or WebP image.');
			return false;
		}

		if (file.size > maxSize) {
			setError('File size too large. Maximum size is 5MB.');
			return false;
		}

		return true;
	};

	const handleThumbnailAdd = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file && validateImageFile(file)) {
				try {
					const base64 = await convertToBase64(file);
					setFormData(prev => ({ ...prev, thumbnail: base64 }));
					clearError();
				} catch (error) {
					setError('Failed to process image');
				}
			}
		};
		input.click();
	};

	const handleThumbnailRemove = () => {
		setFormData(prev => ({ ...prev, thumbnail: "" }));
	};

	const handleImageAdd = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.multiple = true;
		input.onchange = async (e) => {
			const files = Array.from((e.target as HTMLInputElement).files || []);
			
			if (files.length === 0) return;

			// Validate all files first
			const validFiles = files.filter(file => validateImageFile(file));
			if (validFiles.length === 0) return;

			try {
				const newImages = await Promise.all(
					validFiles.map(async (file, index) => {
						const base64 = await convertToBase64(file);
						return {
							url: base64,
							order: formData.images.length + index + 1
						};
					})
				);

				setFormData(prev => ({
					...prev,
					images: [...prev.images, ...newImages]
				}));
				clearError();
			} catch (error) {
				setError('Failed to process one or more images');
			}
		};
		input.click();
	};

	const handleImageRemove = (index: number) => {
		setFormData(prev => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index).map((img, i) => ({
				...img,
				order: i + 1
			}))
		}));
	};

	const handleCreatePost = async (request: CreatePostRequest) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await PostService.createPost(request);
			return response;
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to create post";
			setError(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}

	const handleUpdatePost = async (id: string, request: UpdatePostRequest) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await PostService.updatePost(id, request);
			return response;
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to update post";
			setError(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}

	const handleDeletePost = async (postId: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await PostService.deletePost(postId);
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to delete post";
			setError(errMsg);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}

	const handleResetPost = () => {
		setError(null);
	}

	const clearError = () => {
		setError(null);
	}

	return {
		// states
		formData,
		setFormData,
		isLoading,
		error,
		// actions
		handleFormDataChange,
		handleResetFormData,
		handleThumbnailAdd,
		handleThumbnailRemove,
		handleImageAdd,
		handleImageRemove,
		handleCreatePost,
		handleUpdatePost,
		handleDeletePost,
		handleResetPost,
		clearError
	}
}