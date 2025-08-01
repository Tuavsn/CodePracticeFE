'use client'
import { useProblem } from "@/hooks/use-problem";
import { CreateProblemRequest, Problem, UpdateProblemRequest, PROBLEM_COMPLEXITY } from "@/types/problem"
import { SubmissionLanguage } from "@/types/global";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Edit, Loader2, Plus, X, Code, HelpCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProblemModalProps {
	mode: 'create' | 'update';
	problem?: Problem;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function ProblemModal({ mode, problem, trigger, open: controlledOpen, onOpenChange }: ProblemModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);

	const router = useRouter();

	const {
		isLoading,
		error,
		formData,
		setFormData,
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
		clearError
	} = useProblem();

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setIsOpen = onOpenChange || setInternalOpen;

	const isCreateMode = mode === 'create';
	const modalTitle = isCreateMode ? 'Create Problem' : 'Update Problem';
	const submitText = isCreateMode ? 'Create' : 'Update';
	const submitLoadingText = isCreateMode ? 'Creating...' : 'Updating...';

	const validateForm = (): boolean => {
		if (!formData.title.trim()) {
			toast.error("Please enter problem title");
			return false;
		}
		if (!formData.description.trim()) {
			toast.error("Please enter problem description");
			return false;
		}
		if (formData.examples.some(ex => !ex.input.trim() || !ex.output.trim())) {
			toast.error("Please fill in all example inputs and outputs");
			return false;
		}
		if (formData.constraints.some(constraint => !constraint.trim())) {
			toast.error("Please fill in all constraints or remove empty ones");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			if (mode === 'create') {
				const request: CreateProblemRequest = {
					title: formData.title.trim(),
					description: formData.description.trim(),
					difficulty: formData.difficulty,
					tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
					constraints: formData.constraints.filter(constraint => constraint.trim()),
					examples: formData.examples.filter(ex => ex.input.trim() && ex.output.trim()),
					codeTemplates: formData.codeTemplates,
					hints: formData.hints.filter(hint => hint.trim())
				};
				await handleCreateProblem(request);
				toast.success("Problem created successfully");
			} else {
				if (!problem?.id) return;
				const request: UpdateProblemRequest = {
					title: formData.title.trim(),
					description: formData.description.trim(),
					difficulty: formData.difficulty,
					tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
					constraints: formData.constraints.filter(constraint => constraint.trim()),
					examples: formData.examples.filter(ex => ex.input.trim() && ex.output.trim()),
					codeTemplates: formData.codeTemplates,
					hints: formData.hints.filter(hint => hint.trim())
				};
				await handleUpdateProblem(problem.id, request);
				toast.success("Problem updated successfully");
			}
			setIsOpen(false);
			handleResetFormData();
			router.refresh();
		} catch (error) {
			toast.error(mode === 'create' ? 'Create failed' : 'Update failed')
		}
	}

	const handleCancel = () => {
		setIsOpen(false);
		handleResetFormData();
		if (error) clearError();
	}

	const handleOpen = () => {
		setIsOpen(true);
		if (error) clearError();
	}

	useEffect(() => {
		if (mode === 'update' && problem) {
			setFormData({
				title: problem.title,
				description: problem.description,
				difficulty: problem.difficulty,
				tags: Array.isArray(problem.tags) ? problem.tags.join(', ') : problem.tags,
				constraints: problem.constraints.length > 0 ? problem.constraints : [""],
				examples: problem.examples.length > 0 ? problem.examples : [{ input: "", output: "", explanation: "" }],
				codeTemplates: problem.codeTemplates,
				hints: problem.hints.length > 0 ? problem.hints : [""]
			})
		} else {
			handleResetFormData();
		}
	}, [mode, problem])

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-gray-900">
						{modalTitle}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<Tabs defaultValue="basic" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="basic">Basic Info</TabsTrigger>
							<TabsTrigger value="examples">Examples</TabsTrigger>
							<TabsTrigger value="templates">Code Templates</TabsTrigger>
							<TabsTrigger value="hints">Hints</TabsTrigger>
						</TabsList>

						<TabsContent value="basic" className="space-y-4">
							{/* Title */}
							<div className="space-y-2">
								<Label htmlFor="title" className="text-sm font-medium text-gray-700">
									Title <span className="text-red-500">*</span>
								</Label>
								<Input
									id="title"
									type="text"
									placeholder="Enter problem title..."
									value={formData.title}
									onChange={(e) => handleFormDataChange("title", e.target.value)}
									className="w-full"
									disabled={isLoading}
								/>
							</div>

							{/* Description */}
							<div className="space-y-2">
								<Label htmlFor="description" className="text-sm font-medium text-gray-700">
									Description <span className="text-red-500">*</span>
								</Label>
								<Textarea
									id="description"
									placeholder="Enter problem description..."
									value={formData.description}
									onChange={(e) => handleFormDataChange("description", e.target.value)}
									className="w-full min-h-[120px] resize-none"
									disabled={isLoading}
								/>
							</div>

							{/* Difficulty & Tags */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium text-gray-700">
										Difficulty <span className="text-red-500">*</span>
									</Label>
									<Select
										value={formData.difficulty}
										onValueChange={(value) => handleFormDataChange("difficulty", value as keyof typeof PROBLEM_COMPLEXITY)}
										disabled={isLoading}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select difficulty" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="EASY">Easy</SelectItem>
											<SelectItem value="MEDIUM">Medium</SelectItem>
											<SelectItem value="HARD">Hard</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="tags" className="text-sm font-medium text-gray-700">
										Tags
									</Label>
									<Input
										id="tags"
										type="text"
										placeholder="array, dynamic-programming, graph"
										value={formData.tags}
										onChange={(e) => handleFormDataChange("tags", e.target.value)}
										className="w-full"
										disabled={isLoading}
									/>
								</div>
							</div>

							{/* Constraints */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label className="text-sm font-medium text-gray-700">
										Constraints <span className="text-red-500">*</span>
									</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleConstraintAdd}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add
									</Button>
								</div>
								<div className="space-y-2">
									{formData.constraints.map((constraint, index) => (
										<div key={index} className="flex items-center gap-2">
											<Input
												placeholder={`Constraint ${index + 1}`}
												value={constraint}
												onChange={(e) => handleConstraintChange(index, e.target.value)}
												disabled={isLoading}
											/>
											{formData.constraints.length > 1 && (
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => handleConstraintRemove(index)}
													disabled={isLoading}
												>
													<X className="h-4 w-4" />
												</Button>
											)}
										</div>
									))}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="examples" className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium text-gray-700">
									Examples <span className="text-red-500">*</span>
								</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleExampleAdd}
									disabled={isLoading}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add Example
								</Button>
							</div>
							<div className="space-y-4">
								{formData.examples.map((example, index) => (
									<Card key={index}>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Example {index + 1}
											</CardTitle>
											{formData.examples.length > 1 && (
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => handleExampleRemove(index)}
													disabled={isLoading}
												>
													<X className="h-4 w-4" />
												</Button>
											)}
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="grid grid-cols-2 gap-3">
												<div>
													<Label className="text-xs text-gray-600">Input *</Label>
													<Textarea
														placeholder="Input"
														value={example.input}
														onChange={(e) => handleExampleChange(index, "input", e.target.value)}
														className="h-20 resize-none text-sm"
														disabled={isLoading}
													/>
												</div>
												<div>
													<Label className="text-xs text-gray-600">Output *</Label>
													<Textarea
														placeholder="Output"
														value={example.output}
														onChange={(e) => handleExampleChange(index, "output", e.target.value)}
														className="h-20 resize-none text-sm"
														disabled={isLoading}
													/>
												</div>
											</div>
											<div>
												<Label className="text-xs text-gray-600">Explanation (Optional)</Label>
												<Textarea
													placeholder="Explanation"
													value={example.explanation || ""}
													onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
													className="h-16 resize-none text-sm"
													disabled={isLoading}
												/>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="templates" className="space-y-4">
							<Label className="text-sm font-medium text-gray-700">
								Code Templates
							</Label>
							<div className="space-y-4">
								{formData.codeTemplates.map((template, index) => (
									<Card key={template.language}>
										<CardHeader>
											<CardTitle className="text-sm font-medium flex items-center">
												<Code className="h-4 w-4 mr-2" />
												{template.language}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Textarea
												value={template.code}
												onChange={(e) => handleCodeTemplateChange(template.language as SubmissionLanguage, e.target.value)}
												className="min-h-[120px] font-mono text-sm"
												disabled={isLoading}
											/>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="hints" className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium text-gray-700">
									Hints (Optional)
								</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleHintAdd}
									disabled={isLoading}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add Hint
								</Button>
							</div>
							<div className="space-y-2">
								{formData.hints.map((hint, index) => (
									<div key={index} className="flex items-start gap-2">
										<HelpCircle className="h-4 w-4 mt-3 text-gray-400" />
										<Textarea
											placeholder={`Hint ${index + 1}`}
											value={hint}
											onChange={(e) => handleHintChange(index, e.target.value)}
											className="min-h-[60px] resize-none"
											disabled={isLoading}
										/>
										{formData.hints.length > 1 && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => handleHintRemove(index)}
												disabled={isLoading}
												className="mt-2"
											>
												<X className="h-4 w-4" />
											</Button>
										)}
									</div>
								))}
							</div>
						</TabsContent>
					</Tabs>

					{error && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<div className="flex justify-end gap-3 pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={isLoading}
							className="px-6"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className="bg-black hover:bg-gray-800 text-white font-medium px-6"
						>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									{submitLoadingText}
								</>
							) : (
								<>
									{isCreateMode ? <Plus className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
									{submitText}
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}