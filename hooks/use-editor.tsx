import { SUBMISSION_LANGUAGE } from "@/types/problem";
import { useRef, useState } from "react";

export const ACTIVE_TAB = {
    PROBLEM: 'problem',
    OUTPUT: 'output'
}

export function useEditor() {
    const editorRef = useRef<any>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<typeof SUBMISSION_LANGUAGE[keyof typeof SUBMISSION_LANGUAGE]>(SUBMISSION_LANGUAGE.CPP);
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<typeof ACTIVE_TAB[keyof typeof ACTIVE_TAB]>(ACTIVE_TAB.PROBLEM);

    const handleLanguageChange = (language: typeof SUBMISSION_LANGUAGE[keyof typeof SUBMISSION_LANGUAGE]) => {
        setSelectedLanguage(language)
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

    const handleReset = () => {
        setCode('');
        setTestResults([]);
    }

    // const getDifficultyColor = (difficulty: string) => {
    //     switch 
    // }

    return {
        editorRef,
        selectedLanguage, setSelectedLanguage,
        code, setCode,
        isRunning, isSubmitting,
        testResults, activeTab,
        handleEditorDidMount,
        handleLanguageChange,
        handleRunCode,
        handleSubmit,
        handleReset
    }
}