import { Progress } from "@/components/dashboard/problem/progress"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Eye, FileText, TrendingDown, TrendingUp, Users } from "lucide-react"

const analyticsData = {
  overview: {
    totalViews: 125430,
    totalUsers: 2345,
    totalPosts: 1234,
    totalProblems: 567,
    growthRate: 12.5,
  },
  topPosts: [
    { title: "Getting Started with React Hooks", views: 15420, engagement: 85 },
    { title: "Advanced TypeScript Patterns", views: 12350, engagement: 78 },
    { title: "Building Scalable APIs", views: 9870, engagement: 72 },
  ],
  topProblems: [
    { title: "Two Sum", attempts: 5000, successRate: 64 },
    { title: "Binary Tree Traversal", attempts: 3500, successRate: 45 },
    { title: "Dynamic Programming", attempts: 2800, successRate: 32 },
  ],
  userActivity: {
    dailyActiveUsers: 1250,
    weeklyActiveUsers: 5600,
    monthlyActiveUsers: 18900,
  },
}

export default function AdminAnalyticsPage() {
	return (
		<DashboardLayout>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
					<p className="text-muted-foreground">Track performance and user engagement</p>
				</div>
			</div>

			{/* Overview Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground flex items-center">
							<TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{analyticsData.overview.growthRate}% from
							last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">
							{analyticsData.userActivity.dailyActiveUsers} daily active
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Posts</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analyticsData.overview.totalPosts.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Published content</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Problems</CardTitle>
						<Code2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analyticsData.overview.totalProblems.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Coding challenges</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{/* Top Posts */}
				<Card>
					<CardHeader>
						<CardTitle>Top Performing Posts</CardTitle>
						<CardDescription>Posts with highest engagement this month</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{analyticsData.topPosts.map((post, index) => (
							<div key={index} className="space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium leading-none">{post.title}</p>
									<p className="text-sm text-muted-foreground">{post.views.toLocaleString()} views</p>
								</div>
								<div className="flex items-center space-x-2">
									<Progress value={post.engagement} className="flex-1" />
									<span className="text-xs text-muted-foreground">{post.engagement}%</span>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Top Problems */}
				<Card>
					<CardHeader>
						<CardTitle>Popular Problems</CardTitle>
						<CardDescription>Most attempted coding problems</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{analyticsData.topProblems.map((problem, index) => (
							<div key={index} className="space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium leading-none">{problem.title}</p>
									<p className="text-sm text-muted-foreground">{problem.attempts.toLocaleString()} attempts</p>
								</div>
								<div className="flex items-center space-x-2">
									<Progress value={problem.successRate} className="flex-1" />
									<span className="text-xs text-muted-foreground">{problem.successRate}% success</span>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* User Activity */}
			<Card>
				<CardHeader>
					<CardTitle>User Activity</CardTitle>
					<CardDescription>Active user metrics across different time periods</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<p className="text-sm font-medium">Daily Active Users</p>
							<p className="text-2xl font-bold">{analyticsData.userActivity.dailyActiveUsers.toLocaleString()}</p>
							<p className="text-xs text-muted-foreground flex items-center">
								<TrendingUp className="h-3 w-3 mr-1 text-green-500" />
								+5.2% from yesterday
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Weekly Active Users</p>
							<p className="text-2xl font-bold">
								{analyticsData.userActivity.weeklyActiveUsers.toLocaleString()}
							</p>
							<p className="text-xs text-muted-foreground flex items-center">
								<TrendingUp className="h-3 w-3 mr-1 text-green-500" />
								+8.1% from last week
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Monthly Active Users</p>
							<p className="text-2xl font-bold">
								{analyticsData.userActivity.monthlyActiveUsers.toLocaleString()}
							</p>
							<p className="text-xs text-muted-foreground flex items-center">
								<TrendingDown className="h-3 w-3 mr-1 text-red-500" />
								-2.3% from last month
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</DashboardLayout>
	)
}