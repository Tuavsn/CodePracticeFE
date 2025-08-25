'use client'
import ContentDisplay from "@/components/content-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/date-utils";
import { useAuthStore } from "@/store/use-auth-store";
import { Post } from "@/types/post";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

interface PostTableProps {
	posts: Post[]
	onEdit: (post: Post) => void
	onDelete: (id: string) => void
	onView: (post: Post) => void
	loading?: boolean
}

export default function PostTable({ posts, onEdit, onDelete, onView, loading }: PostTableProps) {
	const { user } = useAuthStore();

	const [deletingId, setDeletingId] = useState<string | null>(null)

	const handleDelete = async (id: string) => {
		setDeletingId(id)
		await onDelete(id)
		setDeletingId(null)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
			case "CLOSED":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
		}
	}

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Posts</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Posts ({posts.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Author</TableHead>
							<TableHead>Topics</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="w-[70px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{posts.map((post) => (
							<TableRow key={post.id}>
								<TableCell>
									<div className="flex items-center space-x-3">
										<img
											src={post.thumbnail || "/placeholder.svg"}
											alt={post.title}
											className="h-10 w-10 rounded object-cover"
										/>
										<div>
											<div className="font-medium">{post.title}</div>
											<div className="text-sm text-muted-foreground"><ContentDisplay content={post.content.substring(0, 60)} /></div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center space-x-2">
										<Avatar className="h-8 w-8">
											<AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.username} />
											<AvatarFallback>{post.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
										</Avatar>
										<div>
											<div className="text-sm font-medium">{post.author.username}</div>
											<div className="text-xs text-muted-foreground">{post.author.email}</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{post.topics.slice(0, 2).map((topic) => (
											<Badge key={topic} variant="secondary" className="text-xs">
												{topic}
											</Badge>
										))}
										{post.topics.length > 2 && (
											<Badge variant="outline" className="text-xs">
												+{post.topics.length - 2}
											</Badge>
										)}
									</div>
								</TableCell>
								<TableCell>
									<Badge className={getStatusColor(post.status)}>{post.status}</Badge>
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{formatDate(post.createdAt)}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onView(post)}>
												<Eye className="mr-2 h-4 w-4" />
												View
											</DropdownMenuItem>
											{user && user.id == post.author.id && (
												<>
													<DropdownMenuItem onClick={() => onEdit(post)}>
														<Edit className="mr-2 h-4 w-4" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDelete(post.id)}
														disabled={deletingId === post.id}
														className="text-red-600"
													>
														<Trash2 className="mr-2 h-4 w-4" />
														{deletingId === post.id ? "Deleting..." : "Delete"}
													</DropdownMenuItem>
												</>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{posts.length === 0 && (
					<div className="text-center py-8 text-muted-foreground">
						No posts found. Create your first post to get started.
					</div>
				)}
			</CardContent>
		</Card>
	)
}