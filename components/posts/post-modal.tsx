'use client'
import { usePost } from "@/hooks/use-post";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit, ImageIcon, Loader2, Plus, Upload, X } from "lucide-react";
import { usePostContext } from "@/contexts/post-context";
import dynamic from "next/dynamic";

const TextEditor = dynamic(() => import('@/components/text-editor'), { ssr: false })

export default function PostModal() {
  const { isOpen, mode, closeModal } = usePostContext();

  const {
    isLoading,
    error,
    formData,
    handleFormDataChange,
    handleResetFormData,
    handleThumbnailAdd,
    handleThumbnailRemove,
    handleImageAdd,
    handleImageRemove,
    handleSubmit,
    clearError
  } = usePost();

  const isCreateMode = mode === 'create';
  const modalTitle = isCreateMode ? 'Create Post' : 'Update Post';
  const submitText = isCreateMode ? 'Create' : 'Update';
  const submitLoadingText = isCreateMode ? 'Creating...' : 'Updating...';

  const handleCancel = () => {
    closeModal();
    handleResetFormData();
    if (error) clearError();
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} >
      <DialogContent size="xl" className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-scroll pr-2 -mr-2">
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
                  <Button
                    type="button"
                    onClick={handleThumbnailRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          {/* Content section */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Content <span className="text-red-500">*</span>
            </Label>
            <TextEditor
              data={formData.content}
              setData={(value: string) => handleFormDataChange('content', value)}
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
              <div className="mt-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative inline-block space-x-3">
                    <img
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      className="w-48 h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
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