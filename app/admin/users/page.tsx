import DashboardLayout from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const mockUsers = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    avatar: "/diverse-user-avatars.png",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15T10:00:00Z",
    postsCount: 12,
    problemsSolved: 45,
  },
  {
    id: "2",
    username: "janesmith",
    email: "jane@example.com",
    avatar: "/female-user-avatar.png",
    role: "user",
    status: "active",
    lastLogin: "2024-01-14T15:30:00Z",
    postsCount: 8,
    problemsSolved: 23,
  },
  {
    id: "3",
    username: "mikejohnson",
    email: "mike@example.com",
    avatar: "/male-user-avatar.png",
    role: "user",
    status: "inactive",
    lastLogin: "2024-01-10T09:15:00Z",
    postsCount: 5,
    problemsSolved: 12,
  },
]

export default function AdminUserPage() {
	return (
		<DashboardLayout>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Users</h2>
					<p className="text-muted-foreground">Manage user accounts and permissions</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Users ({mockUsers.length})</CardTitle>
					<CardDescription>A list of all users in the system</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Posts</TableHead>
								<TableHead>Problems Solved</TableHead>
								<TableHead>Last Login</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center space-x-3">
											<Avatar className="h-10 w-10">
												<AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
												<AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{user.username}</div>
												<div className="text-sm text-muted-foreground">{user.email}</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
									</TableCell>
									<TableCell>{user.postsCount}</TableCell>
									<TableCell>{user.problemsSolved}</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{new Date(user.lastLogin).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</DashboardLayout>
	)
}