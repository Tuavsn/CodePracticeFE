import { ReactNode } from "react"
import Header from "../header";
import SmallerMainLogo from "../main-logo-smaller";

interface ContainerLayoutProps {
	children: ReactNode;
}

export default function ContainerLayout({ children }: ContainerLayoutProps) {
	return (
		<div id="container-layout" className="min-h-screen bg-white">
			{/* Header */}
			<Header />
			{/* Subtle background pattern */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]"></div>
				<div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,0.01)_50%,transparent_51%)] bg-[length:100px_100px]"></div>
			</div>
			<div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
				{/* Header section - smaller than homepage */}
				<SmallerMainLogo />
				{children}
			</div>
		</div>
	)
}