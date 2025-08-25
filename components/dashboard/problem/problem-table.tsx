'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/date-utils"
import { Problem } from "@/types/problem"
import { Code2, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { Progress } from "./progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ProblemTableProps {
  problems: Problem[]
  onEdit: (problem: Problem) => void
  onDelete: (id: string) => void
  onView: (problem: Problem) => void
  loading?: boolean
}

export default function ProblemTable({ problems, onEdit, onDelete, onView, loading }: ProblemTableProps) {
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const handleDelete = async (id: string) => {
		setDeletingId(id)
		await onDelete(id)
		setDeletingId(null)
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "EASY":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
			case "MEDIUM":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
			case "HARD":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PUBLISHED":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
			case "DRAFT":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
			case "ARCHIVED":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
		}
	}

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Problems</CardTitle>
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
				<CardTitle>Problems ({problems.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Difficulty</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead>Acceptance</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="w-[70px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{problems.map((problem) => {
							const acceptanceRate =
								problem.totalSubmissions > 0
									? Math.round((problem.totalAcceptedSubmissions / problem.totalSubmissions) * 100)
									: 0

							return (
								<TableRow key={problem.id}>
									<TableCell>
										<div className="flex items-center space-x-3">
											<div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
												<Code2 className="h-4 w-4 text-primary" />
											</div>
											<div>
												<div className="font-medium">{problem.title}</div>
												<div className="text-sm text-muted-foreground">{problem.description.substring(0, 60)}...</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{problem.tags.slice(0, 2).map((tag) => (
												<Badge key={tag} variant="secondary" className="text-xs">
													{tag}
												</Badge>
											))}
											{problem.tags.length > 2 && (
												<Badge variant="outline" className="text-xs">
													+{problem.tags.length - 2}
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="flex items-center justify-between text-sm">
												<span>{acceptanceRate}%</span>
												<span className="text-muted-foreground">
													{problem.totalAcceptedSubmissions}/{problem.totalSubmissions}
												</span>
											</div>
											<Progress value={acceptanceRate} className="h-1" />
										</div>
									</TableCell>
									<TableCell>
										<Badge className={getStatusColor(problem.status || "DRAFT")}>{problem.status || "DRAFT"}</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(problem.createdAt)}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => onView(problem)}>
													<Eye className="mr-2 h-4 w-4" />
													View
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => onEdit(problem)}>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDelete(problem.id)}
													disabled={deletingId === problem.id}
													className="text-red-600"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													{deletingId === problem.id ? "Deleting..." : "Delete"}
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
				{problems.length === 0 && (
					<div className="text-center py-8 text-muted-foreground">
						No problems found. Create your first coding problem to get started.
					</div>
				)}
			</CardContent>
		</Card>
	)
}