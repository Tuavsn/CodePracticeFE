import { ProblemService } from "@/lib/services/problem.service";
import { CreateProblemRequest, Problem, UpdateProblemRequest, ProblemExample, ProblemCodeTemplate, PROBLEM_COMPLEXITY, DEFAULT_CODE_BASE } from "@/types/problem";
import { SubmissionLanguage } from "@/types/global";
import { useState } from "react";

interface ProblemFormData {
	title: string;
	description: string;
	difficulty: keyof typeof PROBLEM_COMPLEXITY;
	tags: string;
	constraints: string[];
	examples: ProblemExample[];
	codeTemplates: ProblemCodeTemplate[];
	hints: string[];
}

const initialFormData: ProblemFormData = {
	title: "",
	description: "",
	difficulty: "EASY",
	tags: "",
	constraints: [""],
	examples: [{ input: "", output: "", explanation: "" }],
	codeTemplates: Object.entries(DEFAULT_CODE_BASE).map(([language, code]) => ({
		language: language as SubmissionLanguage,
		code
	})),
	hints: [""]
}

export function useProblem() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<ProblemFormData>(initialFormData);

	const handleFormDataChange = (field: keyof ProblemFormData, value: string | keyof typeof PROBLEM_COMPLEXITY) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (error) clearError();
	}

	const handleResetFormData = () => {
		setFormData(initialFormData)
	}

	// Constraint handlers
	const handleConstraintChange = (index: number, value: string) => {
		setFormData(prev => ({
			...prev,
			constraints: prev.constraints.map((constraint, i) => i === index ? value : constraint)
		}));
		if (error) clearError();
	}

	const handleConstraintAdd = () => {
		setFormData(prev => ({
			...prev,
			constraints: [...prev.constraints, ""]
		}));
	}

	const handleConstraintRemove = (index: number) => {
		setFormData(prev => ({
			...prev,
			constraints: prev.constraints.filter((_, i) => i !== index)
		}));
	}

	// Example handlers
	const handleExampleChange = (index: number, field: keyof ProblemExample, value: string) => {
		setFormData(prev => ({
			...prev,
			examples: prev.examples.map((example, i) =>
				i === index ? { ...example, [field]: value } : example
			)
		}));
		if (error) clearError();
	}

	const handleExampleAdd = () => {
		setFormData(prev => ({
			...prev,
			examples: [...prev.examples, { input: "", output: "", explanation: "" }]
		}));
	}

	const handleExampleRemove = (index: number) => {
		setFormData(prev => ({
			...prev,
			examples: prev.examples.filter((_, i) => i !== index)
		}));
	}

	// Code template handlers
	const handleCodeTemplateChange = (language: SubmissionLanguage, code: string) => {
		setFormData(prev => ({
			...prev,
			codeTemplates: prev.codeTemplates.map(template =>
				template.language === language ? { ...template, code } : template
			)
		}));
		if (error) clearError();
	}

	// Hint handlers
	const handleHintChange = (index: number, value: string) => {
		setFormData(prev => ({
			...prev,
			hints: prev.hints.map((hint, i) => i === index ? value : hint)
		}));
		if (error) clearError();
	}

	const handleHintAdd = () => {
		setFormData(prev => ({
			...prev,
			hints: [...prev.hints, ""]
		}));
	}

	const handleHintRemove = (index: number) => {
		setFormData(prev => ({
			...prev,
			hints: prev.hints.filter((_, i) => i !== index)
		}));
	}

	const handleCreateProblem = async (request: CreateProblemRequest) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await ProblemService.createProblem(request);
			return response;
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : "Failed to create problem";
			setError(errMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}

	const handleUpdateProblem = async (id: string, request: UpdateProblemRequest) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await ProblemService.updateProblem(id, request);
			return response;
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : "Failed to update problem";
			setError(errMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}

	const handleDeleteProblem = async (problemId: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await ProblemService.deleteProblem(problemId);
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : "Failed to delete problem";
			setError(errMsg);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}

	const handleResetProblem = () => {
		setError(null);
	}

	const clearError = () => {
		setError(null);
	}

	return {
		// states
		formData,
		setFormData,
		isLoading,
		error,
		// actions
		handleFormDataChange,
		handleResetFormData,
		handleConstraintChange,
		handleConstraintAdd,
		handleConstraintRemove,
		handleExampleChange,
		handleExampleAdd,
		handleExampleRemove,
		handleCodeTemplateChange,
		handleHintChange,
		handleHintAdd,
		handleHintRemove,
		handleCreateProblem,
		handleUpdateProblem,
		handleDeleteProblem,
		handleResetProblem,
		clearError
	}
}