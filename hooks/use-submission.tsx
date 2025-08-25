'use client'
import { ProblemService } from "@/lib/services/problem.service";
import { SubmissionService } from "@/lib/services/submission.service";
import { SubmissionLanguage } from "@/types/global";
import { DEFAULT_CODE_BASE, Problem } from "@/types/problem";
import { Result, SubmitSolution, Submission, RunSolution, RunResponse } from "@/types/submission";
import { useCallback, useEffect, useRef, useState } from "react";

interface useEditorProps {
	problemId: string;
}

export function useEditor({ problemId }: useEditorProps) {
	const editorRef = useRef<any>(null);

	// Problem states
	const [problem, setProblem] = useState<Problem | null>(null);
	const [isLoadingProblem, setIsLoadingProblem] = useState(true);
	const [problemError, setProblemError] = useState<string | null>(null);

	// Editor states
	const [language, setLanguage] = useState<SubmissionLanguage>("CPP");
	const [code, setCode] = useState<string | undefined>("");
	const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<RunResponse | null>(null);
	const [theme, setTheme] = useState<'vs-light' | 'vs-dark'>('vs-light');

	// Action states
	const [isLoading, setIsLoading] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Data states
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [results, setResults] = useState<Record<string, Result[]>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch problem khi component mount
	useEffect(() => {
		const fetchProblem = async () => {
			if (!problemId) {
				setProblemError("Invalid problem ID");
				setIsLoadingProblem(false);
				return;
			}

			try {
				setIsLoadingProblem(true);
				setProblemError(null);
				const response = await ProblemService.getProblemById(problemId);
				setProblem(response);
			} catch (error) {
				console.error("Failed to fetch problem:", error);
				setProblemError(error instanceof Error ? error.message : "Failed to load problem");
			} finally {
				setIsLoadingProblem(false);
			}
		};

		fetchProblem();
	}, [problemId]);

	// Initialize code when problem loads or language changes
	useEffect(() => {
		if (!problem) return;

		const getInitialCode = () => {
			const templateCode = problem.codeTemplates?.find(t => t.language === language)?.code;
			return templateCode || DEFAULT_CODE_BASE[language] || "";
		};

		setCode(getInitialCode());
	}, [problem, language]);

	// Fetch submissions when problem loads
	useEffect(() => {
		if (problem) {
			handleFetchSubmissions();
		}
	}, [problem]);

	const handleFetchSubmissions = useCallback(async () => {
		if (!problem) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await SubmissionService.getSubmissions(problem.id);
			setSubmissions(response);
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to fetch submissions";
			setError(errMsg);
		} finally {
			setIsLoading(false);
		}
	}, [problem]);

	const handleFetchResults = useCallback(async (submissionId: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await SubmissionService.getResultBySubmission(submissionId);

			// Store results with submission ID for mapping
			setResults(prev => ({
				...prev,
				[submissionId]: response
			}));
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to fetch results";
			setError(errMsg);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleLanguageChange = useCallback((newLanguage: SubmissionLanguage) => {
		setLanguage(newLanguage);
	}, []);

	const handleEditorDidMount = useCallback((editor: any) => {
		editorRef.current = editor;
	}, []);

	const handleRunCode = useCallback(async () => {
		if (!problem || !code) return;

		setIsRunning(true);
		setError(null);

		try {

			const solution: RunSolution = {
				code: code,
				language: language,
        input: input
			};

			const response = await SubmissionService.runSolution(solution);
      console.log("Run response:", response);
      setOutput(response);
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to run code";
			setError(errMsg);
		} finally {
			setIsRunning(false);
		}
	}, [problem, code, input, language]);

	const handleSubmit = useCallback(async () => {
		if (!problem || !code) return;

		setIsSubmitting(true);
		setError(null);
		
		try {

			const solution: SubmitSolution = {
				problemId: problem.id,
				code: code,
				language: language
			};

			const response = await SubmissionService.submitSolution(solution);
			setSubmissions(prev => [response, ...prev]);
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : "Failed to submit solution";
			setError(errMsg);
		} finally {
			setIsSubmitting(false);
		}
	}, [problem, code, language]);

	const handleDownloading = useCallback(() => {
		if (!problem) return;

		const languageExtensions: Record<SubmissionLanguage, string> = {
			C: "c",
			CPP: "cpp",
			PYTHON: "py",
			JAVA: "java",
			JAVASCRIPT: "js",
			CSHARP: "cs",
		};

		const ext = languageExtensions[language] || "txt";
		const blob = new Blob([code || ""], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${problem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-solution.${ext}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, [problem, code, language]);

	const handleToggleTheme = useCallback(() => {
		setTheme(prev => prev === 'vs-light' ? 'vs-dark' : 'vs-light');
	}, []);

	const handleReset = useCallback(() => {
		if (!problem) return;

		// Reset về code template hoặc default
		const templateCode = problem.codeTemplates?.find(t => t.language === language)?.code;
		const defaultCode = templateCode || DEFAULT_CODE_BASE[language] || "";
		setCode(defaultCode);
		setError(null);
	}, [problem, language]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		// Problem states
		problem,
		isLoadingProblem,
		problemError,

		// Editor states
		editorRef,
		language,
		setLanguage,
		code,
		setCode,
    input,
    setInput,
    output,
    setOutput,
		theme,
		handleToggleTheme,

		// Action states
		isLoading,
		isRunning,
		isSubmitting,

		// Data states
		submissions,
		results,
		error,

		// Actions
		handleFetchSubmissions,
		handleFetchResults,
		handleEditorDidMount,
		handleLanguageChange,
		handleRunCode,
		handleSubmit,
		handleDownloading,
		handleReset,
		clearError
	};
}