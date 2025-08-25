'use client'
import { useProblem } from "@/hooks/use-problem";
import { PROBLEM_COMPLEXITY } from "@/types/problem"
import { SubmissionLanguage } from "@/types/global";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Edit, Loader2, Plus, X, Code, HelpCircle, TestTube, Eye, EyeOff } from "lucide-react";

// Available programming languages
const AVAILABLE_LANGUAGES: { value: SubmissionLanguage; label: string }[] = [
	{ value: 'JAVASCRIPT', label: 'JavaScript' },
	{ value: 'PYTHON', label: 'Python' },
	{ value: 'JAVA', label: 'Java' },
	{ value: 'CPP', label: 'C++' },
	{ value: 'C', label: 'C' },
	{ value: 'CSHARP', label: 'C#' }
];

export default function ProblemModal() {
	const {
		isOpen,
		closeModal,
		loading: isLoading,
		error,
		formData,
		setFormData,
		clearFormData,
		selectedProblem,
		handleConstraintChange,
		handleConstraintAdd,
		handleConstraintRemove,
		handleExampleChange,
		handleExampleAdd,
		handleExampleRemove,
		handleCodeTemplateChange,
		handleCodeTemplateAdd,
		handleCodeTemplateRemove,
		handleTestCaseChange,
		handleTestCaseAdd,
		handleTestCaseRemove,
		handleHintChange,
		handleHintAdd,
		handleHintRemove,
		handleSubmit,
		handleParseJsonToFormData,
		handleFormatJson,
		clearError
	} = useProblem();

	const isCreateMode = selectedProblem === null;
	const modalTitle = isCreateMode ? 'Create Problem' : 'Update Problem';
	const submitText = isCreateMode ? 'Create' : 'Update';
	const submitLoadingText = isCreateMode ? 'Creating...' : 'Updating...';

	const handleCancel = () => {
		closeModal();
		clearFormData();
		if (error) clearError();
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			handleCancel();
		}
	}

	// Get available languages for code templates (not already added)
	const getAvailableLanguagesForTemplates = () => {
		const existingLanguages = formData.codeTemplates.map(t => t.language);
		return AVAILABLE_LANGUAGES.filter(lang => !existingLanguages.includes(lang.value));
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-gray-900">
						{modalTitle}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<Tabs defaultValue="basic" className="w-full">
						<TabsList className="grid w-full grid-cols-5">
							<TabsTrigger value="basic">Basic Info</TabsTrigger>
							<TabsTrigger value="examples">Examples</TabsTrigger>
							<TabsTrigger value="templates">Code Templates</TabsTrigger>
							<TabsTrigger value="testcases">Test Cases</TabsTrigger>
							<TabsTrigger value="hints">Hints</TabsTrigger>
						</TabsList>

						<TabsContent value="basic" className="space-y-4">
							{/* Import Json */}
							<div className="space-y-2">
								<Label htmlFor="json" className="text-sm font-medium text-gray-700">
									Json <span className="text-red-500">*</span>
								</Label>
								{/* <Input
									id="json"
									type="text"
									placeholder="Enter json format ..."
									value={formData.json}
									onChange={(e) => setFormData("title", e.target.value)}
									className="w-full"
									disabled={isLoading}
								/> */}
							</div>

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
									onChange={(e) => setFormData("title", e.target.value)}
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
									onChange={(e) => setFormData("description", e.target.value)}
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
										onValueChange={(value) => setFormData("difficulty", value as keyof typeof PROBLEM_COMPLEXITY)}
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
										onChange={(e) => setFormData("tags", e.target.value)}
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
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium text-gray-700">
									Code Templates
								</Label>
								<div className="flex items-center gap-2">
									<Select
										onValueChange={(language) => handleCodeTemplateAdd(language as SubmissionLanguage)}
										disabled={isLoading || getAvailableLanguagesForTemplates().length === 0}
									>
										<SelectTrigger className="w-48">
											<SelectValue placeholder="Add template..." />
										</SelectTrigger>
										<SelectContent>
											{getAvailableLanguagesForTemplates().map((lang) => (
												<SelectItem key={lang.value} value={lang.value}>
													<Code className="h-4 w-4 mr-2 inline" />
													{lang.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{formData.codeTemplates.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<Code className="h-12 w-12 mx-auto mb-3 text-gray-300" />
									<p className="text-sm">No code templates added yet</p>
									<p className="text-xs text-gray-400">Use the dropdown above to add templates</p>
								</div>
							) : (
								<div className="space-y-4">
									{formData.codeTemplates.map((template, index) => (
										<Card key={template.language}>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium flex items-center">
													<Code className="h-4 w-4 mr-2" />
													{AVAILABLE_LANGUAGES.find(l => l.value === template.language)?.label || template.language}
												</CardTitle>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => handleCodeTemplateRemove(template.language as SubmissionLanguage)}
													disabled={isLoading}
												>
													<X className="h-4 w-4" />
												</Button>
											</CardHeader>
											<CardContent>
												<Textarea
													value={template.code}
													onChange={(e) => handleCodeTemplateChange(template.language as SubmissionLanguage, e.target.value)}
													className="min-h-[120px] font-mono text-sm"
													placeholder={`Enter ${template.language} code template...`}
													disabled={isLoading}
												/>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</TabsContent>

						<TabsContent value="testcases" className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium text-gray-700">
									Test Cases (Optional)
								</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleTestCaseAdd}
									disabled={isLoading}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add Test Case
								</Button>
							</div>

							{formData.sampleTests.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<TestTube className="h-12 w-12 mx-auto mb-3 text-gray-300" />
									<p className="text-sm">No test cases added yet</p>
									<p className="text-xs text-gray-400">Test cases help validate solution correctness</p>
								</div>
							) : (
								<div className="space-y-4">
									{formData.sampleTests.map((testCase, index) => (
										<Card key={index}>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium flex items-center">
													<TestTube className="h-4 w-4 mr-2" />
													Test Case {index + 1}
													{/* {testCase.isHidden && (
														<span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
															Hidden
														</span>
													)} */}
												</CardTitle>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => handleTestCaseRemove(index)}
													disabled={isLoading}
												>
													<X className="h-4 w-4" />
												</Button>
											</CardHeader>
											<CardContent className="space-y-3">
												<div className="grid grid-cols-2 gap-3">
													<div>
														<Label className="text-xs text-gray-600">Input *</Label>
														<Textarea
															placeholder="Test input"
															value={testCase.input}
															onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
															className="h-20 resize-none text-sm font-mono"
															disabled={isLoading}
														/>
													</div>
													<div>
														<Label className="text-xs text-gray-600">Expected Output *</Label>
														<Textarea
															placeholder="Expected output"
															value={testCase.output}
															onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
															className="h-20 resize-none text-sm font-mono"
															disabled={isLoading}
														/>
													</div>
												</div>
												{/* <div className="flex items-center space-x-2">
													<Checkbox
														id={`hidden-${index}`}
														checked={testCase.isHidden}
														onCheckedChange={(checked) => handleTestCaseChange(index, "isHidden", checked as boolean)}
														disabled={isLoading}
													/>
													<Label
														htmlFor={`hidden-${index}`}
														className="text-sm text-gray-600 flex items-center cursor-pointer"
													>
														{testCase.isHidden ? (
															<EyeOff className="h-4 w-4 mr-1" />
														) : (
															<Eye className="h-4 w-4 mr-1" />
														)}
														Hidden from students
													</Label>
												</div> */}
											</CardContent>
										</Card>
									))}
								</div>
							)}
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

							{formData.hints.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
									<p className="text-sm">No hints added yet</p>
									<p className="text-xs text-gray-400">Hints help guide students toward the solution</p>
								</div>
							) : (
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
							)}
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
							disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
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