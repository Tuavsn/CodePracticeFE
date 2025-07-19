import { DEFAULT_CODE_BASE, SubmissionLanguage } from "@/types/problem";
import { useRef, useState } from "react";

export const ACTIVE_TAB = {
    PROBLEM: 'problem',
    OUTPUT: 'output'
}

export function useEditor() {
    const editorRef = useRef<any>(null);
    const [language, setLanguage] = useState<SubmissionLanguage>("cpp");
    const [code, setCode] = useState<string | undefined>(DEFAULT_CODE_BASE[language]);
    const [theme, setTheme] = useState<'vs-light' | 'vs-dark'>('vs-light')
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<typeof ACTIVE_TAB[keyof typeof ACTIVE_TAB]>(ACTIVE_TAB.PROBLEM);

    const handleLanguageChange = (language: SubmissionLanguage) => {
        setLanguage(language);
        setCode(DEFAULT_CODE_BASE[language]);
    }

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    }

    const handleRunCode = async () => {
        setIsRunning(true);
        setActiveTab(ACTIVE_TAB.OUTPUT);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mockResults = [
            {
                input: "nums = [2,7,11,15], target = 9",
                expected: "[0,1]",
                actual: "[0,1]",
                status: "passed",
                runtime: "68ms",
                memory: "42.1MB",
            },
            {
                input: "nums = [3,2,4], target = 6",
                expected: "[1,2]",
                actual: "[1,2]",
                status: "passed",
                runtime: "72ms",
                memory: "41.8MB",
            },
            {
                input: "nums = [3,3], target = 6",
                expected: "[0,1]",
                actual: "[0,1]",
                status: "passed",
                runtime: "65ms",
                memory: "42.3MB",
            },
        ]

        setTestResults(mockResults);
        setIsRunning(false);
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setActiveTab(ACTIVE_TAB.OUTPUT);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const submissionResult = {
            status: "Accepted",
            runtime: "68ms",
            memory: "42.1MB",
            testsPassed: "3/3",
        }

        setTestResults([submissionResult])
        setIsSubmitting(false)
    }

    const handleDownloading = () => {
        const languageExtensions: Record<SubmissionLanguage, string> = {
            c: "c",
            cpp: "cpp",
            python: "py",
            java: "java",
            javascript: "js",
            csharp: "cs",
        };

        const ext = languageExtensions[language] || "txt";
        const blob = new Blob([code ?? ""], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `my_code.${ext}`;
        link.click();
        URL.revokeObjectURL(url);
    }

    const handleToggleTheme = () => {
        setTheme(theme === 'vs-light' ? 'vs-dark' : 'vs-light');
    }

    const handleReset = () => {
        setCode(DEFAULT_CODE_BASE[language]);
        setTestResults([]);
    }

    return {
        editorRef,
        language, setLanguage,
        code, setCode,
        theme, handleToggleTheme,
        isRunning, isSubmitting,
        testResults, activeTab, setActiveTab,
        handleEditorDidMount,
        handleLanguageChange,
        handleRunCode,
        handleSubmit,
        handleDownloading,
        handleReset
    }
}