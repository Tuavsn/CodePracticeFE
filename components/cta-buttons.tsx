import { MessageCircle, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export type CTAButtonsType = "code" | "rank" | "post";

interface ButtonConfig {
	type: CTAButtonsType;
}

interface CTAButtonProps {
	buttons: ButtonConfig[];
}

const buttonMap: Record<CTAButtonsType, { label: string; icon: React.ReactElement; className: string; href: string; varient?: "outline" | "link" | "default" | "destructive" | "secondary" | "ghost" | null | undefined }> = {
	code: {
		label: 'Start Coding',
		icon: <Target className="h-4 w-4" />,
		className:
			'group px-8 py-6 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200',
		href: "/problems",
	},
	post: {
		label: 'Discuss',
		icon: <MessageCircle className="h-4 w-4 text-blue-400" />,
		className:
			'group px-8 py-6 rounded-lg text-base font-medium transform hover:scale-105 transition-all duration-200',
		href: "/posts",
		varient: 'outline'
	},
	rank: {
		label: 'Leaderboard',
		icon: <Trophy className="h-4 w-4 text-yellow-400" />,
		className:
			'group px-8 py-6 bg-transparent border border-gray-300 text-black rounded-lg text-base font-medium hover:bg-gray-50 transform hover:scale-105 transition-all duration-200',
		href: "/ranks",
		varient: 'outline'
	},
}

export default function CTAButtons({ buttons }: CTAButtonProps) {
	return (
		<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
			{buttons.slice(0, 3).map((btn) => {
				const config = buttonMap[btn.type];
				return (
					<Link key={btn.type} href={config.href}>
						<Button variant={config.varient ? config.varient : 'default'} className={`${config.className} cursor-pointer`}>
							<div className="flex items-center gap-3">
								{config.icon}
								{config.label}
							</div>
						</Button>
					</Link>
				);
			})}
		</div>
	)
}