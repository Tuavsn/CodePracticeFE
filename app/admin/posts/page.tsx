'use client'

import PostTable from "@/components/dashboard/post/post-table";
import DashboardLayout from "@/components/layout/dashboard-layout";
import PostModal from "@/components/posts/post-modal";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/use-post"
import { Plus } from "lucide-react";
import { useEffect } from "react";

export default function AdminPostPage() {
	const {
		posts,
		loading,
		error,
		filters,
		handleFetchPosts,
		openCreateModal,
		openEditModal,
		handleRemovePost,
		handleViewPost
	} = usePost();

	useEffect(() => {
		handleFetchPosts();
	}, [filters]);

	return (
		<DashboardLayout>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Posts</h2>
					<p className="text-muted-foreground">Manage your blog posts and articles</p>
				</div>
				<Button onClick={() => openCreateModal()}>
					<Plus className="mr-2 h-4 w-4" />
					Create Post
				</Button>
			</div>

			{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
			{/* 
					<PostFilter
						filters={filters}
						onFiltersChange={(newFilters) => setFilters(newFilters)}
						onClearFilters={clearFilters}
					/> */}

			<PostTable
				posts={posts}
				onEdit={openEditModal}
				onDelete={handleRemovePost}
				onView={handleViewPost}
				loading={loading}
			/>
			<PostModal />
		</DashboardLayout >
	)
}