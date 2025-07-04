import { ReactNode } from "react"

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div id="dashboard-layout" className="min-h-screen">
			{children}
		</div>
	)
}