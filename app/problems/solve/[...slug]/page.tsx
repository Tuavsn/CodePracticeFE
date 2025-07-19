'use client'
import FullscreenLayout from "@/components/layout/fullscreen-layout";
import CodeControl from "@/components/problems/code-control";
import Editor from "@/components/problems/monaco-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "@/hooks/use-editor";
import { useProblem } from "@/hooks/use-problem";
import { mockProblems } from "@/lib/mock-data/mock-problem";
import { Problem } from "@/types/problem";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProblemSolvePage() {
	const params = useParams();

	const problemId = params.id as string;

	const [problem, setProblem] = useState<Problem>(mockProblems[0]);

	const {
		language,
		code, setCode,
		theme, handleToggleTheme,
		testResults,
		activeTab, setActiveTab,
		isRunning,
		isSubmitting,
		handleSubmit,
		handleRunCode,
		handleDownloading,
		handleReset,
		handleLanguageChange,
		handleEditorDidMount
	} = useEditor();

	const {
		getDifficultyColor
	} = useProblem();

	// Theme classes based on theme variable (matching vs-dark Monaco theme)
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

	const renderBackButton = () => {
		return (
			<Button variant={"link"} asChild className={`cursor-pointer ${themeClasses.text}`}>
				<Link href={`/problems/${problemId}`}>
					<ArrowLeft className="h-4 w-4 mr-1" />
					Go Back
				</Link>
			</Button>
		)
	}

	const renderTopBar = () => {
		return (
			<div className={`border-b p-4 ${themeClasses.border} ${themeClasses.background}`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						{/* Back button */}
						{renderBackButton()}
						{/* Problem Info */}
						<div className="flex items-center space-x-2">
							<h1 className={`font-semibold ${themeClasses.text}`}>{problem.title}</h1>
							<Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const renderProblemInfo = () => {
		return (
			<TabsContent value="problem" className="mt-4">
				<div className="space-y-4">
					<div>
						<h3 className={`font-semibold mb-2 ${themeClasses.text}`}>Mô tả</h3>
						<p className={`text-sm leading-relaxed whitespace-pre-line ${themeClasses.text}`}>{problem.description}</p>
					</div>

					{problem.constraints && (
						<div>
							<h3 className={`font-semibold mb-2 ${themeClasses.text}`}>Ràng buộc</h3>
							<ul className="text-sm space-y-1">
								{problem.constraints.map((constraint, index) => (
									<li key={index} className="flex items-start">
										<span className={`mr-2 ${themeClasses.muted}`}>•</span>
										<code className={`text-xs ${themeClasses.mutedBg} ${themeClasses.text} px-1 rounded`}>{constraint}</code>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</TabsContent>
		)
	}

	const renderProblemExamples = () => {
		return (
			<TabsContent value="examples" className="mt-4">
				<div className="space-y-4">
					{problem.examples?.map((example, index) => (
						<div key={index} className={`border rounded-lg p-4 ${themeClasses.border} ${themeClasses.cardBg}`}>
							<h4 className={`font-semibold mb-3 ${themeClasses.text}`}>Ví dụ {index + 1}:</h4>
							<div className="space-y-2 text-sm">
								<div>
									<span className={`font-medium ${themeClasses.text}`}>Input: </span>
									<code className={`${themeClasses.mutedBg} ${themeClasses.text} px-2 py-1 rounded`}>{example.input}</code>
								</div>
								<div>
									<span className={`font-medium ${themeClasses.text}`}>Output: </span>
									<code className={`${themeClasses.mutedBg} ${themeClasses.text} px-2 py-1 rounded`}>{example.output}</code>
								</div>
								{example.explanation && (
									<div>
										<span className={`font-medium ${themeClasses.text}`}>Giải thích: </span>
										<span className={themeClasses.muted}>{example.explanation}</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</TabsContent>
		)
	}

	const renderSubmissionResults = () => {
		return (
			<TabsContent value="output" className="mt-4">
				<div className="space-y-4">
					{testResults.length === 0 ? (
						<p className={`text-sm ${themeClasses.muted}`}>Chưa có kết quả. Hãy chạy code để xem kết quả.</p>
					) : (
						testResults.map((result, index) => (
							<div key={index} className={`border rounded-lg p-4 ${themeClasses.border} ${themeClasses.cardBg}`}>
								{result.status === "Accepted" ? (
									<div className="space-y-2">
										<div className={`flex items-center ${themeClasses.success}`}>
											<CheckCircle className="h-5 w-5 mr-2" />
											<span className="font-semibold">Accepted</span>
										</div>
										<div className="grid grid-cols-3 gap-4 text-sm">
											<div>
												<span className={themeClasses.muted}>Runtime: </span>
												<span className={`font-medium ${themeClasses.text}`}>{result.runtime}</span>
											</div>
											<div>
												<span className={themeClasses.muted}>Memory: </span>
												<span className={`font-medium ${themeClasses.text}`}>{result.memory}</span>
											</div>
											<div>
												<span className={themeClasses.muted}>Tests: </span>
												<span className={`font-medium ${themeClasses.text}`}>{result.testsPassed}</span>
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className={`text-sm font-medium ${themeClasses.text}`}>Test case {index + 1}</span>
											{result.status === "passed" ? (
												<CheckCircle className={`h-4 w-4 ${themeClasses.success}`} />
											) : (
												<XCircle className={`h-4 w-4 ${themeClasses.error}`} />
											)}
										</div>
										<div className="text-xs space-y-1">
											<div>
												<span className={themeClasses.muted}>Input: </span>
												<code className={`${themeClasses.mutedBg} ${themeClasses.text} px-1 rounded`}>{result.input}</code>
											</div>
											<div>
												<span className={themeClasses.muted}>Expected: </span>
												<code className={`${themeClasses.mutedBg} ${themeClasses.text} px-1 rounded`}>{result.expected}</code>
											</div>
											<div>
												<span className={themeClasses.muted}>Actual: </span>
												<code className={`${themeClasses.mutedBg} ${themeClasses.text} px-1 rounded`}>{result.actual}</code>
											</div>
											<div className={`flex gap-4 ${themeClasses.text}`}>
												<span>
													<Clock className="h-3 w-3 inline mr-1" />
													{result.runtime}
												</span>
												<span>💾 {result.memory}</span>
											</div>
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
			</TabsContent>
		)
	}

	const renderLeftPanel = () => {
		return (
			<ResizablePanel defaultSize={40} minSize={30}>
				<div className={`h-full overflow-auto p-6 ${themeClasses.background}`}>
					<Tabs value={activeTab} onValueChange={setActiveTab} className={isDark ? 'dark' : ''}>
						<TabsList className={`grid w-full grid-cols-3 ${themeClasses.mutedBg} ${themeClasses.border}`}>
							<TabsTrigger className={`cursor-pointer data-[state=active]:${themeClasses.cardBg} data-[state=active]:${themeClasses.text}`} value="problem">Đề bài</TabsTrigger>
							<TabsTrigger className={`cursor-pointer data-[state=active]:${themeClasses.cardBg} data-[state=active]:${themeClasses.text}`} value="examples">Ví dụ</TabsTrigger>
							<TabsTrigger className={`cursor-pointer data-[state=active]:${themeClasses.cardBg} data-[state=active]:${themeClasses.text}`} value="output">Kết quả</TabsTrigger>
						</TabsList>
						{/* Problem Information */}
						{renderProblemInfo()}
						{/* Problem Examples */}
						{renderProblemExamples()}
						{/* SubmissionResults */}
						{renderSubmissionResults()}
					</Tabs>
				</div>
			</ResizablePanel>
		)
	}

	const renderRightPanel = () => {
		return (
			<ResizablePanel defaultSize={60} minSize={40}>
				<div className={`h-full flex flex-col ${themeClasses.editorBg}`}>
					{/* Editor Header */}
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
					{/* Editor */}
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
		)
	}

	const renderMainContent = () => {
		return (
			<ResizablePanelGroup direction="horizontal" className="h-[calc(100%-5rem)]">
				{/* Left Panel - Problem Description */}
				{renderLeftPanel()}
				{/* Resize Bar */}
				<ResizableHandle withHandle />
				{/* Right Panel - Code Editor */}
				{renderRightPanel()}
			</ResizablePanelGroup>
		)
	}

	return (
		<FullscreenLayout>
			<div className={`h-[calc(100vh-4rem)] ${themeClasses.background}`}>
				{/* Top Bar */}
				{renderTopBar()}
				{/* Main Content */}
				{renderMainContent()}
			</div>
		</FullscreenLayout>
	)
}