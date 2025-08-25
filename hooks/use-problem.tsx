import { ProblemService } from "@/lib/services/problem.service";
import { stringToSlug } from "@/lib/string-utils";
import { useProblemStore } from "@/store/use-problem-store";
import { CreateProblemRequest, Problem, UpdateProblemRequest, ProblemExample, ProblemCodeTemplate, ProblemTestCase, DEFAULT_CODE_BASE } from "@/types/problem";
import { SubmissionLanguage } from "@/types/global";
import React, { useEffect } from "react";
import { toast } from "sonner";

export function useProblem() {
  const {
    // states
    formData,
    problems,
    selectedProblem,
    loading,
    error,
    filters,
    isOpen,
    // actions
    setProblems,
    setFormData,
    setLoading,
    setSelectedProblem,
    setError,
    setFilters,
    clearFormData,
    clearFilters,
    addProblem,
    updateProblem,
    deleteProblem,
    openCreateModal,
    openEditModal,
    closeModal,
    getFilteredProblems,
  } = useProblemStore();

  useEffect(() => {
    // Fetch problems if needed
  }, [problems.length, setProblems]);

  useEffect(() => {
    if (selectedProblem) {
      setFormData('title', selectedProblem.title);
      setFormData('description', selectedProblem.description);
      setFormData('difficulty', selectedProblem.difficulty);
      setFormData('tags', selectedProblem.tags?.join(', ') || '');
      setFormData('constraints', selectedProblem.constraints || [""]);
      setFormData('examples', selectedProblem.examples || [{ input: "", output: "", explanation: "" }]);
      setFormData('codeTemplates', selectedProblem.codeTemplates || []);
      setFormData('sampleTests', selectedProblem.sampleTests || []);
      setFormData('hints', selectedProblem.hints || [""]);
    } else {
      clearFormData();
    }
  }, [selectedProblem]);

  // Constraint handlers
  const handleConstraintChange = (index: number, value: string) => {
    const newConstraints = formData.constraints.map((constraint, i) =>
      i === index ? value : constraint
    );
    setFormData('constraints', newConstraints);
    clearError();
  };

  const handleConstraintAdd = () => {
    setFormData('constraints', [...formData.constraints, ""]);
  };

  const handleConstraintRemove = (index: number) => {
    if (index < 0 || index >= formData.constraints.length) return;
    setFormData('constraints', formData.constraints.filter((_, i) => i !== index));
  };

  // Example handlers
  const handleExampleChange = (index: number, field: keyof ProblemExample, value: string) => {
    const newExamples = formData.examples.map((example, i) =>
      i === index ? { ...example, [field]: value } : example
    );
    setFormData('examples', newExamples);
    clearError();
  };

  const handleExampleAdd = () => {
    setFormData('examples', [...formData.examples, { input: "", output: "", explanation: "" }]);
  };

  const handleExampleRemove = (index: number) => {
    if (index < 0 || index >= formData.examples.length) return;
    setFormData('examples', formData.examples.filter((_, i) => i !== index));
  };

  // Code template handlers
  const handleCodeTemplateChange = (language: SubmissionLanguage, code: string) => {
    const newCodeTemplates = formData.codeTemplates.map(template =>
      template.language === language ? { ...template, code } : template
    );
    setFormData('codeTemplates', newCodeTemplates);
    clearError();
  };

  const handleCodeTemplateAdd = (language: SubmissionLanguage) => {
    // Check if template for this language already exists
    const exists = formData.codeTemplates.some(template => template.language === language);
    if (exists) {
      toast.error(`Code template for ${language} already exists`);
      return;
    }

    const newTemplate: ProblemCodeTemplate = {
      language,
      code: getDefaultCodeTemplate(language)
    };

    setFormData('codeTemplates', [...formData.codeTemplates, newTemplate]);
    clearError();
  };

  const handleCodeTemplateRemove = (language: SubmissionLanguage) => {
    setFormData('codeTemplates', formData.codeTemplates.filter(template => template.language !== language));
  };

  // Test case handlers
  const handleTestCaseChange = (index: number, field: keyof ProblemTestCase, value: string | boolean) => {
    const newTestCases = formData.sampleTests.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setFormData('sampleTests', newTestCases);
    clearError();
  };

  const handleTestCaseAdd = () => {
    const newTestCase: ProblemTestCase = {
      input: "",
      output: "",
      point: 0
    };
    setFormData('sampleTests', [...formData.sampleTests, newTestCase]);
  };

  const handleTestCaseRemove = (index: number) => {
    if (index < 0 || index >= formData.sampleTests.length) return;
    setFormData('sampleTests', formData.sampleTests.filter((_, i) => i !== index));
  };

  // Hint handlers
  const handleHintChange = (index: number, value: string) => {
    const newHints = formData.hints.map((hint, i) =>
      i === index ? value : hint
    );
    setFormData('hints', newHints);
    clearError();
  };

  const handleHintAdd = () => {
    setFormData('hints', [...formData.hints, ""]);
  };

  const handleHintRemove = (index: number) => {
    if (index < 0 || index >= formData.hints.length) return;
    setFormData('hints', formData.hints.filter((_, i) => i !== index));
  };

  // Helper function to get default code template
  const getDefaultCodeTemplate = (language: SubmissionLanguage): string => {
    const templates = DEFAULT_CODE_BASE;

    return templates[language] || `// ${language} template\n// Your code here`;
  };

  const handleFetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const paginatedProblems = await ProblemService.getProblems({ page: filters.page, size: filters.size, sort: filters.sort, search: filters.search });
      setProblems(paginatedProblems.content);
      clearError();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to fetch problems";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateProblem = async (request: CreateProblemRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newProblem = await ProblemService.createProblem(request);
      toast.success("Problem created successfully");
      addProblem(newProblem);
      clearFormData();
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to create problem";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProblem = async (id: string, request: UpdateProblemRequest) => {
    setLoading(true);
    setError(null);
    try {
      await ProblemService.updateProblem(id, request);
      toast.success("Problem updated successfully");
      updateProblem(id, {
        ...request,
      });
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to update problem";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProblem = async (problemId: string) => {
    setLoading(true);
    setError(null);
    try {
      await ProblemService.deleteProblem(problemId);
      toast.success("Problem deleted successfully");
      deleteProblem(problemId);
      setError(null);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to delete problem";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (problem: Problem) => {
    if (!problem.id && !problem.title) return;
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const link = `${baseUrl}/problems/${stringToSlug(problem.title)}-${problem.id}`;
      navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
      clearError();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to copy link";
      setError(errMsg);
      toast.error(errMsg);
      throw error;
    }
  };

  const handleViewProblem = (problem: Problem) => {
    if (!problem.id && !problem.title) return;

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const link = `${baseUrl}/problems/${stringToSlug(problem.title)}-${problem.id}`;
      window.open(link, "_blank"); // mở tab mới
      clearError();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Failed to open problem";
      setError(errMsg);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please enter problem title and description");
      return;
    }

    // Validate examples
    const hasValidExample = formData.examples.some(
      example => example.input.trim() && example.output.trim()
    );
    if (!hasValidExample) {
      toast.error("Please provide at least one valid example");
      return;
    }

    // Validate constraints
    const validConstraints = formData.constraints.filter(c => c.trim());
    if (validConstraints.length === 0) {
      toast.error("Please provide at least one constraint");
      return;
    }

    // Validate test cases (optional but if provided, should be valid)
    const validTestCases = formData.sampleTests.filter(
      testCase => testCase.input.trim() && testCase.output.trim()
    );

    try {
      const request = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        tags: formData.tags,
        constraints: validConstraints,
        examples: formData.examples.filter(
          example => example.input.trim() || example.output.trim()
        ),
        codeTemplates: formData.codeTemplates,
        sampleTests: validTestCases,
        hints: formData.hints.filter(hint => hint.trim())
      };

      if (!selectedProblem) {
        await handleCreateProblem(request as CreateProblemRequest);
      } else {
        await handleEditProblem(selectedProblem.id, request as UpdateProblemRequest);
      }
    } catch (error) {
      toast.error(selectedProblem ? 'Update failed' : 'Create failed');
    }
  };

  const handleParseJsonToFormData = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);

      Object.keys(parsed).forEach((key) => {
        if (key in formData) {
          setFormData(key as keyof typeof formData, parsed[key]);
        }
      });

      clearError();
      toast.success("Imported data successfully");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Invalid JSON format";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleFormatJson = (jsonText: string): string => {
    try {
      const parsed = JSON.parse(jsonText);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonText;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // states
    problems,
    selectedProblem,
    formData,
    loading,
    error,
    filters,
    isOpen,
    // actions
    setFormData,
    setSelectedProblem,
    clearFormData,
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
    handleFetchProblems,
    handleCreateProblem,
    handleEditProblem,
    handleRemoveProblem,
    handleSubmit,
    handleCopyLink,
    handleViewProblem,
    handleParseJsonToFormData,
    handleFormatJson,
    clearError,
    openCreateModal,
    openEditModal,
    closeModal,
    getFilteredProblems
  };
}