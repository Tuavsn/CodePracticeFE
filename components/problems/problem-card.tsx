'use client'
import { Problem } from "@/types/problem";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Users, TrendingUp, PlayCircle } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { Button } from "../ui/button";
import { stringToSlug } from "@/lib/string-utils";
import { getDifficultyColor } from "@/lib/utils";

interface ProblemCardProps {
	problem: Problem;
}

export default function ProblemCard({
	problem,
}: ProblemCardProps) {

	return (
		<Link key={problem.id} href={`/problems/${stringToSlug(problem.title)}-${problem.id}`} className="block">
			<Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group cursor-pointer rounded-sm shadow-2xl border-0 bg-white dark:bg-gray-900">
				{/* Compact Header */}
				<CardHeader className="pb-2 pt-3">
					<div className="flex items-center justify-between">
						<Badge className={`${getDifficultyColor(problem.difficulty)} text-xs px-2 py-0.5`}>
							{problem.difficulty}
						</Badge>
						<span className="text-xs text-muted-foreground">
							<b>Published Time:</b> {formatDate(problem.createdAt)}
						</span>
					</div>
				</CardHeader>

				{/* Optimized Content */}
				<CardContent className="pt-0 flex flex-col h-full space-y-3">
					{/* Problem title and description */}
					<h3 className="font-semibold text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
						{problem.title}
					</h3>
					<p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
						{problem.description}
					</p>

					{/* Compact Tags */}
					<div className="flex flex-wrap gap-1">
						{problem.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant={"secondary"} className="text-xs px-1.5 py-0.5 h-5">
								#{tag}
							</Badge>
						))}
						{problem.tags.length > 3 && (
							<Badge variant={"secondary"} className="text-xs px-1.5 py-0.5 h-5">
								+{problem.tags.length - 3}
							</Badge>
						)}
					</div>

					{/* Compact Stats */}
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<div className="flex items-center gap-3">
							<div className="flex items-center">
								<Users className="h-3.5 w-3.5 mr-1 text-blue-500" />
								<span>{problem.totalSubmissions?.toLocaleString()}</span>
							</div>
							<div className="flex items-center">
								<TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
								<span>{problem.totalAcceptedSubmissions}%</span>
							</div>
						</div>
					</div>

					{/* Bottom Action - pushed to bottom */}
					<div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800 mt-auto">
					{/* TODO */}
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}