'use client'
import { usePost } from "@/hooks/use-post";
import { CreatePostRequest, Post, UpdatePostRequest } from "@/types/post"
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Edit, ImageIcon, Loader2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PostModalProps {
  mode: 'create' | 'update';
  post?: Post;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PostModal({ mode, post, trigger, open: controlledOpen, onOpenChange }: PostModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const router = useRouter();

  const {
    isLoading,
    error,
    formData,
    setFormData,
    handleFormDataChange,
    handleResetFormData,
    handleThumbnailAdd,
    handleThumbnailRemove,
    handleImageAdd,
    handleImageRemove,
    handleCreatePost,
    handleUpdatePost,
    clearError
  } = usePost();

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const isCreateMode = mode === 'create';
  const modalTitle = isCreateMode ? 'Create Post' : 'Update Post';
  const submitText = isCreateMode ? 'Create' : 'Update';
  const submitLoadingText = isCreateMode ? 'Creating...' : 'Updating...';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please enter post title and post content");
      return;
    }

    try {
      if (mode === 'create') {
        const request: CreatePostRequest = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          thumbnail: formData.thumbnail.trim(),
          images: formData.images,
          topics: formData.topics.split(',').map(topic => topic.trim()).filter(topic => topic)
        };
        await handleCreatePost(request);
        toast.success("Post created successfully");
      } else {
        if (!post?.id) return;
        const request: UpdatePostRequest = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          thumbnail: formData.thumbnail.trim(),
          images: formData.images,
          topics: formData.topics.split(',').map(topic => topic.trim()).filter(topic => topic)
        };
        await handleUpdatePost(post.id, request);
        toast.success("Post updated successfully");
      }
      setIsOpen(false);
      handleResetFormData();
      router.refresh();
    } catch (error) {
      toast.error(mode === 'create' ? 'Create failed' : 'Update failed')
    }
  }

  const handleCancel = () => {
    setIsOpen(false);
    handleResetFormData();
    if (error) clearError();
  }

  const handleOpen = () => {
    setIsOpen(true);
    if (error) clearError();
  }

  useEffect(() => {
    if (mode === 'update' && post) {
      setFormData({
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail,
        topics: Array.isArray(post.topics) ? post.topics.join(', ') : post.topics,
        images: post.images
      })
    } else {
      handleResetFormData();
    }
  }, [mode, post])

  return (
    <Dialog open={open} onOpenChange={setIsOpen} >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title section */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title..."
              value={formData.title}
              onChange={(e) => handleFormDataChange("title", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          {/* Thumbnail section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Thumbnail
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleThumbnailAdd}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {formData.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
              </Button>
              <span className="text-xs text-gray-500">
                (Max 1 image, 5MB)
              </span>
            </div>

            {formData.thumbnail && (
              <div className="mt-3">
                <div className="relative inline-block">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-32 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleThumbnailRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Content section */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Enter Post Content..."
              value={formData.content}
              onChange={(e) => handleFormDataChange("content", e.target.value)}
              className="w-full min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>
          {/* Topic section */}
          <div className="space-y-2">
            <Label htmlFor="topics" className="text-sm font-medium text-gray-700">
              Topics (Optional)
            </Label>
            <Input
              id="topics"
              type="text"
              placeholder="Enter Topics, split by comma (Ex: javascript, react, programming)"
              value={formData.topics}
              onChange={(e) => handleFormDataChange("topics", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Use topics to help others easily find your post.
            </p>
          </div>
          {/* Images section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Images (Optional)
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImageAdd}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Add Images
              </Button>
              <span className="text-xs text-gray-500">
                ({formData.images.length} Images, 5MB each)
              </span>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      #{image.order}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
              className="bg-black hover:bg-gray-800 text-white font-medium px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {submitLoadingText}
                </>
              ) : (
                <>
                  {isCreateMode ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {submitText}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}