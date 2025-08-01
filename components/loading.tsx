"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingOverlay() {
	const [progress, setProgress] = useState(0);

	const renderLogo = () => {
		return (
			<div className="flex items-center justify-center gap-6">
				{/* Icon */}
				<div className="relative p-6 bg-black rounded-2xl shadow-lg">
					<Zap className="h-10 w-10 text-white" />
				</div>

				{/* Text */}
				<div className="text-center">
					<h1 className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight">
						CodeJudge
					</h1>
					<div className="flex items-center justify-center gap-3 text-black">
						<div className="w-8 h-px bg-black/60"></div>
						<span className="text-xs font-medium tracking-widest uppercase">
							Elite Coding Platform
						</span>
						<div className="w-8 h-px bg-black/60"></div>
					</div>
				</div>
			</div>
		)
	}

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(timer);
					return 100;
				}
				return prev + 10;
			});
		}, 50);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
			{/* Logo */}
			<div className="animate-fade-in-up">
				{renderLogo()}
			</div>

			<h2 className="mt-8 text-xl">Loading...</h2>
			
			{/* Gray progress bar */}
			<div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mt-8 shadow-inner">
				<div
					className="h-full bg-gray-600 transition-all duration-200"
					style={{ width: `${progress}%` }}
				></div>
			</div>
		</div>
	);
}
