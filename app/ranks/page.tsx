import ContainerLayout from "@/components/layout/container-layout";
import { UserService } from "@/lib/services/user.service";
import { ACHIEVEMENT } from "@/types/user";
import { Award, Crown, Medal, Trophy, Star } from "lucide-react";
import React from "react";

const getAchievementColor = (achievement: keyof typeof ACHIEVEMENT) => {
	switch (achievement) {
		case 'EXPERT': return 'text-slate-700';
		case 'INTERMEDIATE': return 'text-slate-600';
		case 'BEGINNER': return 'text-amber-600';
		default: return 'text-gray-400';
	}
};

const getAchievementIcon = (achievement: keyof typeof ACHIEVEMENT) => {
	switch (achievement) {
		case 'EXPERT': return Crown;
		case 'INTERMEDIATE': return Star;
		case 'BEGINNER': return Trophy;
		default: return Award;
	}
};

// Elegant Medal Component with sophisticated design
const ElegantMedal = ({ rank, className = "" }: { rank: number; className?: string }) => {
	const getColors = () => {
		switch (rank) {
			case 1: return { primary: '#D4AF37', secondary: '#B8860B', accent: '#FFD700' };
			case 2: return { primary: '#C0C0C0', secondary: '#A8A8A8', accent: '#E8E8E8' };
			case 3: return { primary: '#CD7F32', secondary: '#B8860B', accent: '#DEB887' };
			default: return { primary: '#E5E7EB', secondary: '#D1D5DB', accent: '#F3F4F6' };
		}
	};

	const colors = getColors();

	return (
		<div className={`relative ${className}`}>
			<svg viewBox="0 0 80 100" className="w-full h-full">
				<defs>
					<linearGradient id={`medal-grad-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 1 }} />
						<stop offset="50%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
					</linearGradient>
					<linearGradient id={`ribbon-grad-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 0.8 }} />
						<stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 0.9 }} />
					</linearGradient>
				</defs>

				{/* Ribbon */}
				<path
					d="M30 10 L50 10 L50 45 L40 40 L30 45 Z"
					fill={`url(#ribbon-grad-${rank})`}
					stroke={colors.secondary}
					strokeWidth="0.5"
				/>

				{/* Medal Circle */}
				<circle
					cx="40"
					cy="65"
					r="22"
					fill={`url(#medal-grad-${rank})`}
					stroke={colors.secondary}
					strokeWidth="1"
				/>

				{/* Inner Circle */}
				<circle
					cx="40"
					cy="65"
					r="18"
					fill="none"
					stroke={colors.secondary}
					strokeWidth="1"
					opacity="0.6"
				/>

				{/* Medal Number */}
				<text
					x="40"
					y="72"
					textAnchor="middle"
					fontSize="16"
					fontWeight="bold"
					fill={colors.secondary}
				>
					{rank}
				</text>

				{/* Decorative stars */}
				<circle cx="40" cy="52" r="1.5" fill={colors.secondary} opacity="0.7" />
				<circle cx="32" cy="58" r="1" fill={colors.secondary} opacity="0.5" />
				<circle cx="48" cy="58" r="1" fill={colors.secondary} opacity="0.5" />

				{/* Highlight */}
				<ellipse cx="35" cy="60" rx="8" ry="4" fill="rgba(255,255,255,0.3)" />
			</svg>
		</div>
	);
};

export default async function RankingPage() {
	const users = await UserService.getRankList();
	const sortedUsers = users.sort((a, b) => b.totalSubmissionPoint - a.totalSubmissionPoint);
	const topThree = sortedUsers.slice(0, 3);

	const renderHeader = () => {
		return (
			<div className="text-center mb-10">
				<div className="inline-flex items-center gap-3 text-slate-500 mb-6">
					<div className="w-8 h-px bg-slate-300"></div>
					<h2 className="text-xs font-semibold tracking-[0.15em] uppercase">Excellence</h2>
					<div className="w-8 h-px bg-slate-300"></div>
				</div>
				<h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-3 tracking-tight">
					Developer Rankings
				</h1>
				<p className="text-lg text-slate-600 font-normal">Recognition of outstanding contributions</p>
			</div>
		)
	}

	const renderTop3 = () => {
		return (
			<div className="mb-16">
				<div className="flex items-end justify-center gap-6 mb-12">
					{/* Second Place */}
					{topThree[1] && (
						<div className="text-center group">
							<div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
								<img
									src={topThree[1].avatar}
									alt={topThree[1].username}
									className="w-16 h-16 rounded-xl mx-auto mb-4 border border-slate-200"
								/>
								<h3 className="font-medium text-lg text-slate-900 mb-2">{topThree[1].username}</h3>
								<div className="flex items-center justify-center gap-2 mb-3">
									{React.createElement(getAchievementIcon(topThree[1].achievement), {
										className: `w-4 h-4 ${getAchievementColor(topThree[1].achievement)}`
									})}
									<span className="text-xs font-medium text-slate-600">{topThree[1].achievement}</span>
								</div>
								<div className="text-xl font-semibold text-slate-900">{topThree[1].totalSubmissionPoint}</div>
								<div className="text-xs text-slate-500 mt-1">points</div>
							</div>
							<div className="flex flex-col items-center mt-4">
								<div className="w-12 h-16 mb-2">
									<ElegantMedal rank={2} className="w-full h-full" />
								</div>
							</div>
						</div>
					)}

					{/* First Place */}
					{topThree[0] && (
						<div className="text-center group">
							<div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
								<img
									src={topThree[0].avatar}
									alt={topThree[0].username}
									className="w-20 h-20 rounded-xl mx-auto mb-4 border-2 border-amber-200"
								/>
								<h3 className="font-medium text-xl text-slate-900 mb-2">{topThree[0].username}</h3>
								<div className="flex items-center justify-center gap-2 mb-3">
									{React.createElement(getAchievementIcon(topThree[0].achievement), {
										className: `w-5 h-5 ${getAchievementColor(topThree[0].achievement)}`
									})}
									<span className="text-sm font-medium text-slate-600">{topThree[0].achievement}</span>
								</div>
								<div className="text-2xl font-semibold text-slate-900">{topThree[0].totalSubmissionPoint}</div>
								<div className="text-xs text-slate-500 mt-1">points</div>
							</div>
							<div className="flex flex-col items-center mt-6">
								<div className="w-16 h-20 mb-3">
									<ElegantMedal rank={1} className="w-full h-full" />
								</div>
							</div>
						</div>
					)}

					{/* Third Place */}
					{topThree[2] && (
						<div className="text-center group">
							<div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
								<img
									src={topThree[2].avatar}
									alt={topThree[2].username}
									className="w-16 h-16 rounded-xl mx-auto mb-4 border border-slate-200"
								/>
								<h3 className="font-medium text-lg text-slate-900 mb-2">{topThree[2].username}</h3>
								<div className="flex items-center justify-center gap-2 mb-3">
									{React.createElement(getAchievementIcon(topThree[2].achievement), {
										className: `w-4 h-4 ${getAchievementColor(topThree[2].achievement)}`
									})}
									<span className="text-xs font-medium text-slate-600">{topThree[2].achievement}</span>
								</div>
								<div className="text-xl font-semibold text-slate-900">{topThree[2].totalSubmissionPoint}</div>
								<div className="text-xs text-slate-500 mt-1">points</div>
							</div>
							<div className="flex flex-col items-center mt-4">
								<div className="w-12 h-16 mb-2">
									<ElegantMedal rank={3} className="w-full h-full" />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}
	const renderRankingList = () => {
		return (
			<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
				<div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white/50">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 bg-slate-900 rounded-lg">
							<Trophy className="h-4 w-4 text-white" />
						</div>
						<h2 className="text-xl font-medium text-slate-900">Complete Rankings</h2>
					</div>
					<p className="text-sm text-slate-600">Performance leaderboard</p>
				</div>

				<div className="divide-y divide-slate-100">
					{sortedUsers.map((user, index) => (
						<div
							key={user.id}
							className={`p-5 hover:bg-slate-50/50 transition-colors duration-200 ${index < 3 ? 'bg-gradient-to-r from-slate-50/30 to-white/30' : ''
								}`}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium ${index === 0 ? 'bg-amber-500 text-white' :
										index === 1 ? 'bg-slate-400 text-white' :
											index === 2 ? 'bg-amber-600 text-white' :
												'bg-slate-100 text-slate-700'
										}`}>
										{index + 1}
									</div>
									<img
										src={user.avatar}
										alt={user.username}
										className="w-12 h-12 rounded-lg border border-slate-200"
									/>
									<div>
										<h3 className="font-medium text-slate-900 mb-1">{user.username}</h3>
										<p className="text-sm text-slate-600">{user.bio}</p>
									</div>
								</div>
								<div className="text-right">
									<div className="flex items-center gap-2 justify-end mb-2">
										{React.createElement(getAchievementIcon(user.achievement), {
											className: `w-4 h-4 ${getAchievementColor(user.achievement)}`
										})}
										<span className="text-xs font-medium text-slate-600">{user.achievement}</span>
									</div>
									<div className="text-lg font-semibold text-slate-900">{user.totalSubmissionPoint}</div>
									<div className="text-xs text-slate-500">points</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}
	return (
		<ContainerLayout>
			{/* Header - Refined Typography */}
			{renderHeader()}

			{/* Podium - Sophisticated Design */}
			{renderTop3()}

			{/* Full Ranking List - Clean & Professional */}
			{renderRankingList()}
		</ContainerLayout>
	);
}