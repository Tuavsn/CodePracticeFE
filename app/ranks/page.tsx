import ContainerLayout from "@/components/layout/container-layout";
import { Award, Crown, Medal, Trophy, Star } from "lucide-react";
import React from "react";

const ROLE = {
	ADMIN: 'ADMIN',
	USER: 'USER',
	MODERATOR: 'MODERATOR'
};

const ACHIEVEMENT = {
	BRONZE: 'BRONZE',
	SILVER: 'SILVER',
	GOLD: 'GOLD',
	PLATINUM: 'PLATINUM',
	DIAMOND: 'DIAMOND'
};

const ACCOUNT_STATUS = {
	ACTIVE: 'ACTIVE',
	INACTIVE: 'INACTIVE',
	BANNED: 'BANNED'
};

const ACCOUNT_PROVIDER = {
	LOCAL: 'LOCAL',
	GOOGLE: 'GOOGLE',
	FACEBOOK: 'FACEBOOK'
};

interface User {
	id: string;
	username: string;
	role: keyof typeof ROLE;
	email: string;
	avatar: string;
	phone: string;
	address: string;
	achievement: keyof typeof ACHIEVEMENT;
	totalSubmissionPoint: number;
	status: keyof typeof ACCOUNT_STATUS;
	authProvider: keyof typeof ACCOUNT_PROVIDER;
	devices: {
		info: string;
		ip: string;
		expireAt: Date;
		lastLoginTime: Date;
	}[];
	bio: string;
}

const mockUsers: User[] = [
	{
		id: '1',
		username: 'AlexCoder',
		role: 'USER',
		email: 'alex@example.com',
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234567',
		address: 'Hà Nội, Việt Nam',
		achievement: 'DIAMOND',
		totalSubmissionPoint: 15420,
		status: 'ACTIVE',
		authProvider: 'GOOGLE',
		devices: [],
		bio: 'Passionate full-stack developer'
	},
	{
		id: '2',
		username: 'SarahTech',
		role: 'USER',
		email: 'sarah@example.com',
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234568',
		address: 'TP.HCM, Việt Nam',
		achievement: 'PLATINUM',
		totalSubmissionPoint: 14850,
		status: 'ACTIVE',
		authProvider: 'LOCAL',
		devices: [],
		bio: 'Frontend specialist & UI/UX enthusiast'
	},
	{
		id: '3',
		username: 'MikeDevOps',
		role: 'MODERATOR',
		email: 'mike@example.com',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234569',
		address: 'Đà Nẵng, Việt Nam',
		achievement: 'GOLD',
		totalSubmissionPoint: 13990,
		status: 'ACTIVE',
		authProvider: 'FACEBOOK',
		devices: [],
		bio: 'DevOps engineer & cloud architecture expert'
	},
	{
		id: '4',
		username: 'JennyAI',
		role: 'USER',
		email: 'jenny@example.com',
		avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234570',
		address: 'Hải Phòng, Việt Nam',
		achievement: 'GOLD',
		totalSubmissionPoint: 12750,
		status: 'ACTIVE',
		authProvider: 'GOOGLE',
		devices: [],
		bio: 'AI researcher & machine learning expert'
	},
	{
		id: '5',
		username: 'RyanMobile',
		role: 'USER',
		email: 'ryan@example.com',
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234571',
		address: 'Cần Thơ, Việt Nam',
		achievement: 'SILVER',
		totalSubmissionPoint: 11200,
		status: 'ACTIVE',
		authProvider: 'LOCAL',
		devices: [],
		bio: 'Mobile app developer (iOS & Android)'
	},
	{
		id: '6',
		username: 'EmmaData',
		role: 'USER',
		email: 'emma@example.com',
		avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234572',
		address: 'Nha Trang, Việt Nam',
		achievement: 'SILVER',
		totalSubmissionPoint: 10800,
		status: 'ACTIVE',
		authProvider: 'GOOGLE',
		devices: [],
		bio: 'Data scientist & analytics expert'
	},
	{
		id: '7',
		username: 'TomBackend',
		role: 'USER',
		email: 'tom@example.com',
		avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234573',
		address: 'Huế, Việt Nam',
		achievement: 'BRONZE',
		totalSubmissionPoint: 9500,
		status: 'ACTIVE',
		authProvider: 'LOCAL',
		devices: [],
		bio: 'Backend developer & API architect'
	},
	{
		id: '8',
		username: 'LisaDesign',
		role: 'USER',
		email: 'lisa@example.com',
		avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
		phone: '+84901234574',
		address: 'Vũng Tàu, Việt Nam',
		achievement: 'BRONZE',
		totalSubmissionPoint: 8750,
		status: 'ACTIVE',
		authProvider: 'FACEBOOK',
		devices: [],
		bio: 'UI/UX designer & creative director'
	}
];

const getAchievementColor = (achievement: keyof typeof ACHIEVEMENT) => {
	switch (achievement) {
		case 'DIAMOND': return 'text-slate-700';
		case 'PLATINUM': return 'text-slate-600';
		case 'GOLD': return 'text-amber-600';
		case 'SILVER': return 'text-gray-500';
		case 'BRONZE': return 'text-amber-700';
		default: return 'text-gray-400';
	}
};

const getAchievementIcon = (achievement: keyof typeof ACHIEVEMENT) => {
	switch (achievement) {
		case 'DIAMOND': return Crown;
		case 'PLATINUM': return Star;
		case 'GOLD': return Trophy;
		case 'SILVER': return Medal;
		case 'BRONZE': return Award;
		default: return Award;
	}
};

const formatPoints = (points: number) => {
	return points.toLocaleString('vi-VN');
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

export default function RankingPage() {
	const sortedUsers = [...mockUsers].sort((a, b) => b.totalSubmissionPoint - a.totalSubmissionPoint);
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
								<div className="text-xl font-semibold text-slate-900">{formatPoints(topThree[1].totalSubmissionPoint)}</div>
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
								<div className="text-2xl font-semibold text-slate-900">{formatPoints(topThree[0].totalSubmissionPoint)}</div>
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
								<div className="text-xl font-semibold text-slate-900">{formatPoints(topThree[2].totalSubmissionPoint)}</div>
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
									<div className="text-lg font-semibold text-slate-900">{formatPoints(user.totalSubmissionPoint)}</div>
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