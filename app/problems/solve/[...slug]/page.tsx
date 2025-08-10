'use client'
import FullscreenLayout from "@/components/layout/fullscreen-layout";
import LoadingOverlay from "@/components/loading";
import CodeControl from "@/components/problems/code-control";
import Editor from "@/components/problems/monaco-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/contexts/auth-context";
import { useEditor } from "@/hooks/use-submission";
import { formatDate } from "@/lib/date-utils";
import { getDifficultyColor } from "@/lib/utils";
import { Result, Submission } from "@/types/submission";
import { ACHIEVEMENT, User } from "@/types/user";
import { ArrowLeft, CheckCircle, Clock, XCircle, ChevronDown, ChevronRight, Trophy, AlertCircle, Loader2, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Submission Item Component - Di chuyển ra ngoài component chính
interface SubmissionItemProps {
	submission: Submission;
	index: number;
	themeClasses: any;
	onFetchResults: (submissionId: string) => Promise<void>;
	results: Result[];
	loadingSubmissionIds: Set<string>;
}

function SubmissionItem({
	submission,
	index,
	themeClasses,
	onFetchResults,
	results,
	loadingSubmissionIds
}: SubmissionItemProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [hasLoadedResults, setHasLoadedResults] = useState(false);

	const isLoading = loadingSubmissionIds.has(submission.id)

	const getStatusIcon = () => {
		switch (submission.result) {
			case "ACCEPTED":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "WRONG_ANSWER":
				return <XCircle className="h-4 w-4 text-red-500" />;
			case "TIME_LIMIT":
				return <Clock className="h-4 w-4 text-yellow-500" />;
			case "STACK_OVERFLOW":
				return <AlertCircle className="h-4 w-4 text-orange-500" />;
			default:
				return <Clock className="h-4 w-4 text-gray-500" />;
		}
	};

	const getStatusText = () => {
		switch (submission.result) {
			case "ACCEPTED":
				return "Accepted";
			case "WRONG_ANSWER":
				return "Wrong Answer";
			case "STACK_OVERFLOW":
				return "Time Limit Exceeded";
			default:
				return "Unknown";
		}
	};

	const getStatusColor = () => {
		switch (submission.result) {
			case "ACCEPTED":
				return "text-green-600 dark:text-green-400";
			case "WRONG_ANSWER":
				return "text-red-600 dark:text-red-400";
			case "STACK_OVERFLOW":
				return "text-yellow-600 dark:text-yellow-400";
			default:
				return "text-red-600 dark:text-red-400";
		}
	};

	const handleToggleExpand = async () => {
		if (!isExpanded && !hasLoadedResults && submission.id) {
			await onFetchResults(submission.id);
			setHasLoadedResults(true);
		}
		setIsExpanded(!isExpanded);
	};

	const isAccepted = submission.result === "ACCEPTED";

	return (
		<div className={`border rounded-lg transition-all duration-200 hover:shadow-sm ${themeClasses.border} ${themeClasses.cardBg}`}>
			{/* Header - Always visible */}
			<div
				className="p-4 cursor-pointer select-none"
				onClick={handleToggleExpand}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						{/* Expand/Collapse Icon */}
						{isExpanded ? (
							<ChevronDown className={`h-4 w-4 ${themeClasses.muted} transition-transform`} />
						) : (
							<ChevronRight className={`h-4 w-4 ${themeClasses.muted} transition-transform`} />
						)}

						{/* Status Icon & Text */}
						<div className="flex items-center space-x-2">
							{getStatusIcon()}
							<span className={`font-medium text-sm ${getStatusColor()}`}>
								{getStatusText()}
							</span>
						</div>

						{/* Score Badge for accepted solutions */}
						{isAccepted && submission.score && (
							<div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
								<Trophy className="h-3 w-3 text-green-600 dark:text-green-400" />
								<span className="text-xs font-semibold text-green-700 dark:text-green-300">
									{submission.score}
								</span>
							</div>
						)}
					</div>

					<div className="flex items-center space-x-4 text-xs">
						{/* Performance Metrics */}
						{submission.time && (
							<div className={`flex items-center space-x-1 ${themeClasses.muted}`}>
								<Clock className="h-3 w-3" />
								<span>{submission.time} s</span>
							</div>
						)}
						{submission.memory && (
							<div className={`flex items-center space-x-1 ${themeClasses.muted}`}>
								<span>💾</span>
								<span>{submission.memory} kb</span>
							</div>
						)}

						{/* Timestamp */}
						{submission.createdAt && (
							<span className={themeClasses.muted}>
								{formatDate(submission.createdAt)}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Expanded Content */}
			{isExpanded && (
				<div className={`border-t px-4 pb-4 ${themeClasses.border}`}>
					{isLoading ? (
						<div className="flex items-center justify-center py-4">
							<Loader2 className={`h-4 w-4 animate-spin mr-2 ${themeClasses.muted}`} />
							<span className={`text-sm ${themeClasses.muted}`}>Loading test results...</span>
						</div>
					) : results.length > 0 ? (
						<div className="mt-3 space-y-2">
							<h4 className={`font-medium text-sm ${themeClasses.text} mb-2`}>
								Test Cases ({results.length})
							</h4>
							{results.map((result, resultIndex) => (
								<div
									key={resultIndex}
									className={`border rounded p-3 text-xs ${themeClasses.border} ${themeClasses.mutedBg}`}
								>
									<div className="flex items-center justify-between mb-2">
										<span className={`font-medium ${themeClasses.text}`}>
											Test Case {resultIndex + 1}
										</span>
										<div className="flex items-center space-x-2">
											{result.result === "ACCEPTED" ? (
												<CheckCircle className="h-3 w-3 text-green-500" />
											) : (
												<XCircle className="h-3 w-3 text-red-500" />
											)}
											<span className={`text-xs ${result.result === "ACCEPTED" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
												{result.result === "ACCEPTED" ? "Accepted" : "Failed"}
											</span>
										</div>
									</div>

									{/* Test case details */}
									<div className="space-y-1">
										{/* Error output */}
										{result.error && (
											<div>
												<span className="font-medium text-red-600 dark:text-red-400">Error: </span>
												<code className="text-red-600 dark:text-red-400 bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">
													{result.error}
												</code>
											</div>
										)}

										{/* Performance */}
										<div className={`flex items-center space-x-3 pt-1 ${themeClasses.muted}`}>
											{result.time != null && (
												<span>
													<Clock className="h-3 w-3 inline mr-1" />
													{result.time} s
												</span>
											)}
											{result.memory != null && (
												<span>💾 {result.memory} kb</span>
											)}
											{result.point != null && (
												<span>🏆 {result.point} pts</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					) : isAccepted ? (
						<div className={`text-center py-4 ${themeClasses.success}`}>
							<Trophy className="h-6 w-6 mx-auto mb-2" />
							<p className="text-sm font-medium">All test cases passed!</p>
							{submission.score && (
								<p className="text-xs mt-1">Score: {submission.score}</p>
							)}
						</div>
					) : (
						<div className={`text-center py-4 ${themeClasses.muted}`}>
							<p className="text-sm">No detailed results available</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default function ProblemSolvePage() {
	const problemParams = useParams<{ slug: string }>().slug[0];
	const problemId = problemParams.split("-").pop();
	// const [activeTab, setActiveTab] = useState<'descriptions' | 'problems' | 'results' | 'run'>('descriptions')
	const [activeTab, setActiveTab] = useState<'descriptions' | 'problems' | 'results'>('descriptions')
	const [loadingSubmissionIds, setLoadingSubmissionIds] = useState<Set<string>>(new Set());
	const { user } = useAuthContext();

	// useEditor giờ sẽ handle tất cả logic liên quan đến problem
	const {
		// Problem states
		problem,
		isLoadingProblem,
		problemError,

		// Editor states
		language,
		code,
		setCode,
		theme,
		handleToggleTheme,
		submissions,
		results,
		isLoading,
		isRunning,
		isSubmitting,

		// Actions
		handleFetchSubmissions,
		handleFetchResults: originalHandleFetchResults,
		handleSubmit: originalHandleSubmit,
		handleRunCode,
		handleDownloading,
		handleReset,
		handleLanguageChange,
		handleEditorDidMount,
		clearError
	} = useEditor({ problemId: problemId! });

	const handleFetchResults = async (submissionId: string) => {
		setLoadingSubmissionIds(prev => new Set(prev).add(submissionId));
		try {
			await originalHandleFetchResults(submissionId);
		} finally {
			setLoadingSubmissionIds(prev => {
				const newSet = new Set(prev);
				newSet.delete(submissionId);
				return newSet;
			});
		}
	}

	const handleSubmit = async () => {
		if (!user) {
			toast.error("You need to be logged in to submit.");
		} else {
			await originalHandleSubmit();
			setActiveTab('results');
		}
	}

	// Theme classes
	const getThemeClasses = () => {
		const isDark = theme === 'vs-dark';
		return {
			background: isDark ? 'bg-[#1e1e1e]' : 'bg-white',
			text: isDark ? 'text-[#cccccc]' : 'text-gray-900',
			border: isDark ? 'border-[#3c3c3c]' : 'border-gray-200',
			muted: isDark ? 'text-[#6a9955]' : 'text-gray-600',
			mutedBg: isDark ? 'bg-[#2d2d30]' : 'bg-gray-100',
			cardBg: isDark ? 'bg-[#252526]' : 'bg-white',
			editorBg: isDark ? 'bg-[#1e1e1e]' : 'bg-white',
			accent: isDark ? 'text-[#569cd6]' : 'text-blue-600',
			success: isDark ? 'text-[#4ec9b0]' : 'text-green-600',
			error: isDark ? 'text-[#f44747]' : 'text-red-600',
			warning: isDark ? 'text-[#ffcc02]' : 'text-yellow-600'
		};
	};

	const themeClasses = getThemeClasses();
	const isDark = theme === 'vs-dark';

	// Loading state
	if (isLoadingProblem) {
		return (
			<LoadingOverlay />
		);
	}

	// Error state
	if (problemError || !problem) {
		return (
			<FullscreenLayout>
				<div className={`h-[calc(100vh-4rem)] flex items-center justify-center ${themeClasses.background}`}>
					<div className={`text-center ${themeClasses.text}`}>
						<div className={`text-red-500 mb-4`}>
							<XCircle className="h-12 w-12 mx-auto mb-2" />
							<p className="text-lg font-semibold">Error</p>
						</div>
						<p className={themeClasses.muted}>{problemError || "Problem not found"}</p>
						<Button variant="outline" className="mt-4" asChild>
							<Link href="/problems">Back to Problems</Link>
						</Button>
					</div>
				</div>
			</FullscreenLayout>
		);
	}

	const renderBackButton = () => (
		<Button variant={"link"} asChild className={`${themeClasses.text}`}>
			<Link href={`/problems/${problemParams}`}>
				<ArrowLeft className="h-4 w-4 mr-1" />
				Go Back
			</Link>
		</Button>
	);

	const renderTopBar = (user: Partial<User> | null) => {
		const achievementConfig = {
			[ACHIEVEMENT.BEGINNER]: {
				label: "Beginner",
				color: "text-gray-600",
				bgColor: "bg-gray-100"
			},
			[ACHIEVEMENT.INTERMEDIATE]: {
				label: "Intermediate",
				color: "text-gray-800",
				bgColor: "bg-gray-200"
			},
			[ACHIEVEMENT.EXPERT]: {
				label: "Expert",
				color: "text-white",
				bgColor: "bg-black"
			}
		};

		const achievement = user?.achievement ? achievementConfig[user.achievement] : achievementConfig[ACHIEVEMENT.BEGINNER];

		return (
			<div className={`border-b p-4 ${themeClasses.border} ${themeClasses.background}`}>
				<div className="flex items-center justify-between">
					<div className="flex-1 flex items-center space-x-4">
						{renderBackButton()}
						<div className="flex items-center space-x-2">
							<h1 className={`font-semibold ${themeClasses.text}`}>{problem.title}</h1>
							<Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
						</div>
					</div>
					{user && (
						<div className="flex items-center gap-4">
							<div className="relative">
								{user?.avatar ? (
									<Avatar className="h-12 w-12 rounded-md flex-shrink-0">
										<AvatarImage src={user.avatar} alt={user.username} />
										<AvatarFallback>{user.email}</AvatarFallback>
									</Avatar>
								) : (
									<div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
										<UserIcon className="h-6 w-6 text-white" />
									</div>
								)}
								<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
							</div>

							<div className="flex flex-col">
								<div className="flex items-center gap-2">
									<h3 className={`font-semibold ${themeClasses.text}`}>{user?.username}</h3>
									<span className={`px-2 py-1 rounded-full text-xs font-medium ${achievement.color} ${achievement.bgColor}`}>
										{achievement.label}
									</span>
								</div>
								<div className="flex items-center gap-3 text-sm text-gray-600">
									<div className="flex items-center gap-1">
										<Trophy className="h-3 w-3" />
										<span className={`${themeClasses.muted}`}>{user?.totalSubmissionPoint || 0} point</span>
									</div>
									<div className="w-1 h-1 bg-gray-400 rounded-full"></div>
									<span className={`${themeClasses.muted}`}>{user?.email}</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	};

	const renderProblemInfo = () => (
		<TabsContent value="descriptions" className="mt-4">
			<div className="space-y-4">
				<div>
					<h3 className={`font-semibold mb-2 text-lg ${themeClasses.text}`}>Description:</h3>
					<p className={`text-sm leading-relaxed whitespace-pre-line ${themeClasses.text}`}>{problem.description}</p>
				</div>
				<div>
					<h3 className={`font-semibold mb-2 text-lg ${themeClasses.text}`}>Constraints:</h3>
					<ul className="text-sm space-y-1">
						{problem.constraints.map((constraint, index) => (
							<li key={index} className="flex items-center">
								<span className={`mr-2 ${themeClasses.muted}`}>•</span>
								<code className={`text-xs ${themeClasses.mutedBg} ${themeClasses.text} px-1 rounded`}>{constraint}</code>
							</li>
						))}
					</ul>
				</div>
			</div>
		</TabsContent>
	);

	const renderProblemExamples = () => (
		<TabsContent value="examples" className="mt-4">
			<div className="space-y-4">
				{problem.examples.map((example, index) => (
					<div key={index} className={`border rounded-lg p-4 ${themeClasses.border} ${themeClasses.cardBg}`}>
						<h4 className={`font-semibold mb-3 text-lg ${themeClasses.text}`}>Example {index + 1}:</h4>
						<div className="space-y-2 text-sm">
							<div>
								<span className={`font-medium ${themeClasses.text}`}>Input: </span>
								<code className={`${themeClasses.mutedBg} ${themeClasses.text} block px-2 py-3 mt-1 rounded font-mono`}>{example.input}</code>
							</div>
							<div>
								<span className={`font-medium ${themeClasses.text}`}>Output: </span>
								<code className={`${themeClasses.mutedBg} ${themeClasses.text} block px-2 py-3 mt-1 rounded font-mono`}>{example.output}</code>
							</div>
							{example.explanation && (
								<div>
									<span className={`font-medium ${themeClasses.text}`}>Explanation: </span>
									<span className={themeClasses.muted}>{example.explanation}</span>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</TabsContent>
	);

	const renderSubmissionResults = () => (
		<TabsContent value="results" className="mt-4">
			<div className="space-y-3">
				{submissions.length === 0 ? (
					<div className={`text-center py-8 ${themeClasses.muted}`}>
						<div className="mb-2">📝</div>
						<p className="text-sm">Chưa có kết quả. Hãy chạy code để xem kết quả.</p>
					</div>
				) : (
					<div className="space-y-2">
						<h3 className={`font-semibold text-sm ${themeClasses.text} mb-3`}>
							Submissions ({submissions.length})
						</h3>
						{submissions.map((submission, index) => (
							<SubmissionItem
								key={submission.id || index}
								submission={submission}
								index={index}
								themeClasses={themeClasses}
								onFetchResults={handleFetchResults}
								results={results[submission.id] || []}
								loadingSubmissionIds={loadingSubmissionIds}
							/>
						))}
					</div>
				)}
			</div>
		</TabsContent>
	);

	const renderLeftPanel = () => (
		<ResizablePanel defaultSize={40} minSize={30}>
			<div className={`h-full overflow-auto p-6 ${themeClasses.background}`}>
				{/* Tabs */}
				{/* <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ('descriptions' | 'problems' | 'results' | 'run'))} className={isDark ? 'dark' : ''}> */}
				<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ('descriptions' | 'problems' | 'results'))} className={isDark ? 'dark' : ''}>
					<TabsList className={`grid w-full grid-cols-3 ${themeClasses.mutedBg} ${themeClasses.border}`}>
						<TabsTrigger className={`data-[state=active]:${themeClasses.cardBg} data-[state=active]:${themeClasses.text}`} value="descriptions">Description</TabsTrigger>
						<TabsTrigger className={`data-[state=active]:${themeClasses.cardBg} data-[state=active]:${themeClasses.text}`} value="examples">Examples</TabsTrigger>
						<TabsTrigger className={`data-[state=active]:${themeClasses.cardBg} data-[state=active]:${themeClasses.text}`} value="results">Results</TabsTrigger>
						{/* <TabsTrigger className={`data-[state=active]:${themeClasses.cardBg} data-[state=active]:${themeClasses.text}`} value="run">Run</TabsTrigger> */}
					</TabsList>
					{/* Tab content */}
					{renderProblemInfo()}
					{renderProblemExamples()}
					{renderSubmissionResults()}
				</Tabs>
			</div>
		</ResizablePanel>
	);

	const renderRightPanel = () => (
		<ResizablePanel defaultSize={60} minSize={40}>
			<div className={`h-full flex flex-col ${themeClasses.editorBg}`}>
				<CodeControl
					isRunning={isRunning}
					isSubmitting={isSubmitting}
					language={language}
					theme={theme}
					handleRunCode={handleRunCode}
					handleSubmit={handleSubmit}
					handleDownload={handleDownloading}
					handleResetCode={handleReset}
					handleToggleTheme={handleToggleTheme}
					handleLanguageChange={handleLanguageChange}
				/>
				<div className="flex-1">
					<Editor
						language={language.toLowerCase()}
						code={code}
						theme={theme}
						onEditorChange={setCode}
						onEditorMount={handleEditorDidMount}
					/>
				</div>
			</div>
		</ResizablePanel>
	);

	return (
		<FullscreenLayout>
			<div className={`h-[calc(100vh-4rem)] ${themeClasses.background}`}>
				{renderTopBar(user)}
				<ResizablePanelGroup direction="horizontal" className="h-[calc(100%-5rem)]">
					{renderLeftPanel()}
					<ResizableHandle withHandle />
					{renderRightPanel()}
				</ResizablePanelGroup>
			</div>
		</FullscreenLayout>
	);
}