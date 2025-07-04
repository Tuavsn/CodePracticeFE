'use client'
import { Problem } from "@/types/problem";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { useProblem } from "@/hooks/use-problem";
import { Clock, Heart, MessageCircle, TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { formatDate } from "@/lib/date-utils";
import { Button } from "../ui/button";
import { stringToSlug } from "@/lib/string-utils";

interface ProblemCardProps {
	problem: Problem;
	onLike?: (problemId: string) => void;
}

export default function ProblemCard({
	problem,
	onlike
}: ProblemCardProps) {
	const {
		getDifficultyColor
	} = useProblem();

	return (
		<Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group cursor-pointer overflow-hidden rounded-sm shadow-2xl border-0 bg-white dark:bg-gray-900">
			{/* Header */}
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex flex-wrap items-center gap-2">
						<Badge className={`${getDifficultyColor(problem.difficulty)} text-xs px-2 py-1`}>
							{problem.difficulty}
						</Badge>
					</div>
				</div>
			</CardHeader>
			
			{/* Content */}
			<CardContent className="pt-0 flex flex-col h-full">
				{/* Problem title and description */}
				<Link href={`/problems/${stringToSlug(problem.title)}?id=${problem.id}`} className="block mb-4">
					<h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
						{problem.title}
					</h3>
					<p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
						{problem.description}
					</p>
				</Link>
				
				{/* Tags */}
				<div className="flex flex-wrap items-center gap-1.5 mb-4">
					{problem.tags.slice(0, 2).map((tag) => (
						<Badge key={tag} variant={"secondary"} className="text-xs px-2 py-1 hover:bg-secondary/80 transition-colors">
							#{tag}
						</Badge>
					))}
					{problem.tags.length > 2 && (
						<Badge variant={"secondary"} className="text-xs px-2 py-1">
							+{problem.tags.length - 2}
						</Badge>
					)}
				</div>
				
				{/* Stats */}
				<div className="grid grid-cols-2 gap-3 mb-4 text-sm">
					<div className="flex items-center text-muted-foreground">
						<Users className="h-4 w-4 mr-1.5 text-blue-500" />
						<span className="font-medium">{problem.submissionCount.toLocaleString()}</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<TrendingUp className="h-4 w-4 mr-1.5 text-green-500" />
						<span className="font-medium">{problem.acceptanceRate}%</span>
					</div>
				</div>
				
				{/* Author */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-2">
						<Avatar className="rounded-lg h-6 w-6 overflow-hidden">
							<AvatarImage 
								src={problem.author.avatar || "/placeholder.svg"} 
								alt={problem.author.username}
								className="h-full w-full object-cover"
							/>
							<AvatarFallback className="text-xs bg-gray-100 dark:bg-gray-800 h-full w-full flex items-center justify-center">
								{problem.author.username[0].toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm text-muted-foreground font-medium">
							{problem.author.username}
						</span>
						<span className="text-xs text-muted-foreground">•</span>
						<span className="text-xs text-muted-foreground">
							{formatDate(problem.createdAt as string)}
						</span>
					</div>
				</div>
				
				{/* Action buttons - pushed to bottom */}
				<div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
					<div className="flex items-center space-x-2">
						<Button 
							variant="ghost" 
							size="sm" 
							className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2"
						>
							<Heart className="h-4 w-4 mr-1 fill-current" />
							<span className="text-xs">0</span>
						</Button>

						<Button 
							variant="ghost" 
							size="sm" 
							asChild
							className="text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 px-2"
						>
							<Link href={`/problems/${problem.id}#comments`}>
								<MessageCircle className="h-4 w-4 mr-1" />
								<span className="text-xs">{problem.commentCount}</span>
							</Link>
						</Button>
					</div>

					<Button 
						size="sm" 
						asChild
						className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 text-sm"
					>
						<Link href={`/problems/${problem.id}/solve`}>
							<Clock className="h-4 w-4 mr-1.5" />
							Giải
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}