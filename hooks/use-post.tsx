import { PostService } from "@/lib/services/post.service";
import { stringToSlug } from "@/lib/string-utils";
import { usePostStore } from "@/store/use-post-store";
import { CreatePostRequest, Post, UpdatePostRequest } from "@/types/post";
import React, { useEffect } from "react";
import { toast } from "sonner";

export function usePost() {
  const {
    // states
    formData,
    posts,
    selectedPost,
    reactionedPosts,
    commentedPosts,
    loading,
    error,
    filters,
    isOpen,
    // actions
    setPosts,
    setFormData,
    setLoading,
    setSelectedPost,
    setError,
    setFilters,
    clearFormData,
    clearFilters,
    addPost,
    updatePost,
    deletePost,
    reactToPost,
    openCreateModal,
    openEditModal,
    closeModal,
    getFilteredPosts,
  } = usePostStore();

  useEffect(() => {
    if (selectedPost) {
      setFormData('title', selectedPost.title);
      setFormData('content', selectedPost.content);
      setFormData('thumbnail', selectedPost.thumbnail || "");
      setFormData('topics', selectedPost.topics || []);
      setFormData('images', selectedPost.images || []);
    } else {
      clearFormData();
    }
  }, [selectedPost])

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
          setFormData('thumbnail', base64);
          clearError();
        } catch (error) {
          setError('Failed to process image');
        }
      }
    };
    input.click();
  };

  const handleThumbnailRemove = () => {
    setFormData('thumbnail', "");
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

        setFormData('images', formData.images.concat(newImages).sort((a, b) => a.order - b.order));

        clearError();
      } catch (error) {
        setError('Failed to process one or more images');
      }
    };
    input.click();
  };

  const handleImageRemove = (index: number) => {
    if (index < 0 || index >= formData.images.length) return;
    setFormData('images', formData.images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      order: i + 1
    })));
  };

  const handleFetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const paginatedPosts = await PostService.getPosts({ page: filters.page, size: filters.size, sort: filters.sort, search: filters.search });
      setPosts(paginatedPosts.content);
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to fetch posts";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const handleCreatePost = async (request: CreatePostRequest) => {
    setLoading(true)
    setError(null);
    try {
      const newPost = await PostService.createPost(request);
      toast.success("Post created successfully");
      addPost(newPost);
      clearFormData();
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to create post";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const handleEditPost = async (id: string, request: UpdatePostRequest) => {
    setLoading(true);
    setError(null);
    try {
      await PostService.updatePost(id, request);
      toast.success("Post updated successfully");
      updatePost(id, {
        ...request,
      });
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to update post";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const handleRemovePost = async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
      await PostService.deletePost(postId);
      toast.success("Post deleted successfully");
      deletePost(postId);
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to delete post";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = (post: Post) => {
    if (!post.id && !post.title) return;
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const link = `${baseUrl}/posts/${stringToSlug(post.title)}-${post.id}`;
      navigator.clipboard.writeText(link);
      clearError();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to copy link";
      setError(errMsg);
      throw error;
    }
  }

  const handleViewPost = (post: Post) => {
    if (!post.id && !post.title) return;

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const link = `${baseUrl}/posts/${stringToSlug(post.title)}-${post.id}`;
      window.open(link, "_blank"); // mở tab mới
      clearError();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to open post";
      setError(errMsg);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please enter post title and post content");
      return;
    }

    try {
      const request = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        thumbnail: formData.thumbnail.trim(),
        images: formData.images,
        topics: formData.topics
      };

      if (!selectedPost) {
        await handleCreatePost(request as CreatePostRequest);
      } else {
        await handleEditPost(selectedPost.id, request as UpdatePostRequest);
      }
    } catch (error) {
      toast.error(selectedPost ? 'Create failed' : 'Update failed')
    }
  }

  const handleLikePost = async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
      await PostService.reactionPost(postId, 'LIKE');
      toast.success("Post liked successfully");
      reactToPost(postId, 'like');
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to create post";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const handleDislikePost = async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
      await PostService.reactionPost(postId, 'DISLIKE');
      toast.success("Post disliked successfully");
      reactToPost(postId, 'dislike');
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to create post";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const clearError = () => {
    setError(null);
  }

  return {
    // states
    posts,
    selectedPost,
    reactionedPosts,
    commentedPosts,
    formData,
    loading,
    error,
    filters,
    isOpen,
    // actions
    setFormData,
    setSelectedPost,
    clearFormData,
    handleThumbnailAdd,
    handleThumbnailRemove,
    handleImageAdd,
    handleImageRemove,
    handleFetchPosts,
    handleCreatePost,
    handleEditPost,
    handleRemovePost,
    handleLikePost,
    handleDislikePost,
    handleSubmit,
    handleCopyLink,
    handleViewPost,
    clearError,
    openCreateModal,
    openEditModal,
    closeModal
  }
}