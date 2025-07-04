import { ReactNode } from "react"

interface FullScreenLayoutProps {
	children: ReactNode;
}

export default function FullscreenLayout({ children }: FullScreenLayoutProps) {
	return (
		<div id="fullscreen-layout" className="min-h-screen">
			{children}
		</div>
	)
}