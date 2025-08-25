import { MobileSidebar } from "./sidebar";
import { UserNav } from "./user-nav";

export default function DashboardHeader() {
	return (
		<div className="border-b">
			<div className="flex h-16 items-center px-4">
				<MobileSidebar />
				<div className="ml-auto flex items-center space-x-4">
					<UserNav />
				</div>
			</div>
		</div>
	)
}