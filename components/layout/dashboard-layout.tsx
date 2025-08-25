import { Plus } from "lucide-react";
import { ReactNode } from "react"
import { Sidebar } from "../dashboard/sidebar";
import DashboardHeader from "../dashboard/header";
import ProtectedRoute from "../dashboard/protected-route";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<ProtectedRoute>
			<div id="dashboard-layout" className="flex min-h-screen">
				{/* Desktop Sidebar */}
				<div className="hidden w-64 border-r bg-gray-100/40 md:block dark:bg-gray-800/40">
					<div className="flex h-full max-h-screen flex-col gap-2">
						<div className="flex h-[60px] items-center border-b px-6">
							<div className="flex items-center gap-2 font-semibold">
								<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
									<Plus className="h-4 w-4" />
								</div>
								Dashboard
							</div>
						</div>
						<div className="flex-1 overflow-auto py-2">
							<Sidebar />
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex flex-1 flex-col">
					<DashboardHeader />
					<main className="flex-1 space-y-4 p-8 pt-6">
						{children}
					</main>
				</div>
			</div>
		</ProtectedRoute>
	)
}