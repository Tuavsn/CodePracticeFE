'use client'
import { BarChart3, Code2, FileText, LayoutDashboard, Menu, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"

const sidebarItems = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Posts",
		href: "/admin/posts",
		icon: FileText,
	},
	{
		title: "Problems",
		href: "/admin/problems",
		icon: Code2,
	},
	{
		title: "Users",
		href: "/admin/users",
		icon: Users,
	},
	{
		title: "Analytics",
		href: "/admin/analytics",
		icon: BarChart3,
	},
	{
		title: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
]

interface SidebarProps {
	className?: string
}

export function Sidebar({ className }: SidebarProps) {
	const pathname = usePathname()

	return (
		<div className={cn("pb-12", className)}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
					<div className="space-y-1">
						{sidebarItems.map((item) => (
							<Button
								key={item.href}
								variant={pathname === item.href ? "secondary" : "ghost"}
								className="w-full justify-start"
								asChild
							>
								<Link href={item.href}>
									<item.icon className="mr-2 h-4 w-4" />
									{item.title}
								</Link>
							</Button>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export function MobileSidebar() {
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
				>
					<Menu className="h-6 w-6" />
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="pr-0">
				<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
					<Sidebar />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}