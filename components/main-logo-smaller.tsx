import { Zap } from "lucide-react";
import Link from "next/link";

export default function SmallerMainLogo() {
	return (
		<div className="mb-12 relative">
			<div className="relative flex items-center justify-center mb-8">
				<Link href={"/"}>
					<div className="flex items-center justify-center gap-4">
						<div className="relative p-4 bg-black rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
							<Zap className="h-6 w-6 text-white" />
						</div>
						<div className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight">
								CodeJudge
							</h1>
							<div className="flex items-center justify-center gap-2 text-gray-600">
								<div className="w-6 h-px bg-gray-300"></div>
								<span className="text-xs font-medium tracking-widest uppercase">Elite Coding Platform</span>
								<div className="w-6 h-px bg-gray-300"></div>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</div>
	)
}