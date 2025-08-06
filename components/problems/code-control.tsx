'use client'
import { CheckCircle, Clock, Download, Moon, PlayCircle, RotateCcw, Sun } from "lucide-react"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { SUBMISSION_LANGUAGE, SubmissionLanguage } from "@/types/global"

interface CodeControlProps {
	isRunning: boolean
	isSubmitting: boolean
	language: SubmissionLanguage
	theme: 'vs-light' | 'vs-dark'
	handleRunCode: () => void
	handleSubmit: () => void
	handleDownload: () => void
	handleResetCode: () => void
	handleToggleTheme: () => void
	handleLanguageChange: (language: SubmissionLanguage) => void
}

export default function CodeControl({
	isRunning,
	isSubmitting,
	language,
	theme,
	handleRunCode,
	handleSubmit,
	handleDownload,
	handleResetCode,
	handleToggleTheme,
	handleLanguageChange
}: CodeControlProps) {

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

	return (
		<div className={`p-4 border-b flex items-center justify-end gap-2 flex-shrink-0 ${themeClasses.border} ${themeClasses.mutedBg}`}>
			<div className="flex items-center gap-4">
				<Select value={language} onValueChange={(value: SubmissionLanguage) => handleLanguageChange(value)}>
					<SelectTrigger className={`w-[140px] ${themeClasses.background} ${themeClasses.text} ${themeClasses.border}`}>
						<SelectValue>{SUBMISSION_LANGUAGE[language]}</SelectValue>
					</SelectTrigger>
					<SelectContent className={`${themeClasses.cardBg} ${themeClasses.border}`}>
						{Object.entries(SUBMISSION_LANGUAGE).map(([key, label]) => (
							<SelectItem
								key={key}
								value={key}
								className={`${themeClasses.text} hover:${themeClasses.mutedBg} focus:${themeClasses.mutedBg}`}
							>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex gap-2">
				{/* Run */}
				{/* <Button
					variant="outline"
					onClick={handleRunCode}
					disabled={isRunning}
					className={`gap-2 ${themeClasses.background} ${themeClasses.text} ${themeClasses.border} hover:${themeClasses.mutedBg} disabled:opacity-50`}
				>
					{isRunning ? (
						<>
							<Clock className="h-4 w-4 animate-spin" />
							<span className={themeClasses.text}>Running...</span>
						</>
					) : (
						<>
							<PlayCircle className="h-4 w-4" />
							<span className={themeClasses.text}>Run</span>
						</>
					)}
				</Button> */}

				{/* Submit */}
				<Button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className={`gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 disabled:opacity-50 disabled:bg-blue-600`}
				>
					{isSubmitting ? (
						<>
							<Clock className="h-4 w-4 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							<CheckCircle className="h-4 w-4" />
							Submit
						</>
					)}
				</Button>

				{/* Reset */}
				<Button
					variant="outline"
					onClick={handleResetCode}
					className={`gap-2 ${themeClasses.background} ${themeClasses.text} ${themeClasses.border} hover:opacity-80`}
				>
					<RotateCcw className="h-4 w-4" />
					<span className={themeClasses.text}>Reset</span>
				</Button>

				{/* Save to file */}
				<Button
					variant="outline"
					onClick={handleDownload}
					className={`gap-2 ${themeClasses.background} ${themeClasses.text} ${themeClasses.border} hover:opacity-80`}
				>
					<Download className="h-4 w-4" />
					<span className={themeClasses.text}>Save to file</span>
				</Button>

				{/* Toggle Theme */}
				<Button
					variant="ghost"
					onClick={handleToggleTheme}
					className={`gap-2 ${themeClasses.text} hover:${themeClasses.mutedBg}`}
				>
					{theme === "vs-dark" ? (
						<>
							<Sun className="h-4 w-4" />
							<span className={themeClasses.text}>Light</span>
						</>
					) : (
						<>
							<Moon className="h-4 w-4" />
							<span className={themeClasses.text}>Dark</span>
						</>
					)}
				</Button>
			</div>
		</div>
	)
}