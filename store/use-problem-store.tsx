import { Problem, UpdateProblemRequest, CreateProblemRequest, PROBLEM_COMPLEXITY, PROBLEM_STATUS, ProblemExample, ProblemCodeTemplate } from "@/types/problem";
import { SubmissionLanguageValue } from "@/types/global";
import { create } from "zustand";

interface ProblemFormData extends CreateProblemRequest {
	status: keyof typeof PROBLEM_STATUS;
}

interface ProblemState {
	formData: ProblemFormData;
	problems: Problem[];
	solvedProblems: Record<string, boolean>;
	favoritedProblems: Record<string, boolean>;
	reactionedProblems: Record<string, 'like' | 'dislike' | null>;
	selectedProblem: Problem | null;
	loading: boolean;
	error: string | null;
	filters: {
		page: number;
		size: number;
		sort: 'asc' | 'desc';
		difficulty: (keyof typeof PROBLEM_COMPLEXITY)[];
		tags: string[];
		search: string;
		status: (keyof typeof PROBLEM_STATUS)[];
		solved: boolean | null;
		favorited: boolean | null;
		languages: SubmissionLanguageValue[];
	};
	isOpen: boolean;
}

interface ProblemAction {
	// CRUD Operations
	setProblems: (problems: Problem[]) => void;
	addProblem: (problem: Problem) => void;
	updateProblem: (id: string, updates: UpdateProblemRequest) => void;
	deleteProblem: (id: string) => void;

	// Problem interactions
	markAsSolved: (id: string) => void;
	markAsUnsolved: (id: string) => void;
	toggleFavorite: (id: string) => void;
	reactToProblem: (id: string, reaction: 'like' | 'dislike' | null) => void;

	// Selection
	setSelectedProblem: (problem: Problem | null) => void;

	// Loading State
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// Filters
	setFilters: (filters: Partial<ProblemState['filters']>) => void;
	clearFilters: () => void;

	// Computed getters
	getFilteredProblems: () => Problem[];

	// Modal State
	setFormData: (field: keyof ProblemFormData, value: any) => void;
	updateFormDataArray: (field: 'tags' | 'constraints' | 'examples' | 'codeTemplates' | 'hints', value: any[]) => void;
	addFormDataArrayItem: (field: 'tags' | 'constraints' | 'examples' | 'codeTemplates' | 'hints', item: any) => void;
	removeFormDataArrayItem: (field: 'tags' | 'constraints' | 'examples' | 'codeTemplates' | 'hints', index: number) => void;
	clearFormData: () => void;
	openCreateModal: () => void;
	openEditModal: (problem: Problem) => void;
	closeModal: () => void;
}

type ProblemStore = ProblemState & ProblemAction;

const initialFormData: ProblemFormData = {
	title: "",
	description: "",
	difficulty: 'EASY',
	tags: [],
	constraints: [],
	examples: [],
	codeTemplates: [],
	sampleTests: [],
	hints: [],
	timeLimitSeconds: 1,
	memoryLimitMb: 256,
	totalScore: 0,
	status: 'DRAFT'
};

const initialState: ProblemState = {
	formData: initialFormData,
	problems: [],
	solvedProblems: {},
	favoritedProblems: {},
	reactionedProblems: {},
	selectedProblem: null,
	loading: false,
	error: null,
	filters: {
		page: 0,
		size: 10,
		sort: 'desc',
		difficulty: [],
		tags: [],
		search: '',
		status: [],
		solved: null,
		favorited: null,
		languages: [],
	},
	isOpen: false,
};

export const useProblemStore = create<ProblemStore>()(
	(set, get) => ({
		...initialState,

		// CRUD Operations
		setProblems: (problems) => set({ problems }),
		addProblem: (problem) => set((state) => ({
			problems: [problem, ...state.problems],
		})),
		updateProblem: (id, updates) => set((state) => ({
			problems: state.problems.map(problem => problem.id === id ? { ...problem, ...updates } : problem),
			selectedProblem: state.selectedProblem?.id === id ? { ...state.selectedProblem, ...updates } : state.selectedProblem
		})),
		deleteProblem: (id) => set((state) => ({
			problems: state.problems.filter(problem => problem.id !== id),
			selectedProblem: state.selectedProblem?.id === id ? null : state.selectedProblem,
		})),

		// Problem interactions
		markAsSolved: (id) => set((state) => ({
			solvedProblems: { ...state.solvedProblems, [id]: true }
		})),
		markAsUnsolved: (id) => set((state) => ({
			solvedProblems: { ...state.solvedProblems, [id]: false }
		})),
		toggleFavorite: (id) => set((state) => ({
			favoritedProblems: {
				...state.favoritedProblems,
				[id]: !state.favoritedProblems[id]
			}
		})),
		reactToProblem: (id, reaction) => set((state) => ({
			reactionedProblems: { ...state.reactionedProblems, [id]: reaction }
		})),

		// Selection
		setSelectedProblem: (problem) => set({ selectedProblem: problem }),

		// Loading State
		setLoading: (loading) => set({ loading }),
		setError: (error: string | null) => set({ error }),

		// Filters
		setFilters: (filters) => set((state) => ({
			filters: { ...state.filters, ...filters }
		})),
		clearFilters: () => set({
			filters: { ...initialState.filters }
		}),

		// Computed getters
		getFilteredProblems: () => {
			const { problems, filters, solvedProblems, favoritedProblems } = get();
			return problems.filter(problem => {
				const matchesDifficulty = filters.difficulty.length === 0 ||
					filters.difficulty.includes(problem.difficulty);
				const matchesTags = filters.tags.length === 0 ||
					filters.tags.some(tag => problem.tags.includes(tag));
				const matchesSearch = filters.search === '' ||
					problem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
					problem.description.toLowerCase().includes(filters.search.toLowerCase()) ||
					problem.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
				const matchesStatus = filters.status.length === 0 ||
					(problem.status && filters.status.includes(problem.status));
				const matchesSolved = filters.solved === null ||
					Boolean(solvedProblems[problem.id]) === filters.solved;
				const matchesFavorited = filters.favorited === null ||
					Boolean(favoritedProblems[problem.id]) === filters.favorited;
				const matchesLanguages = filters.languages.length === 0 ||
					filters.languages.some(lang =>
						problem.codeTemplates.some(template => template.language === lang)
					);

				return matchesDifficulty && matchesTags && matchesSearch &&
					matchesStatus && matchesSolved && matchesFavorited && matchesLanguages;
			}).sort((a, b) => {
				if (filters.sort === 'asc') {
					return a.createdAt.localeCompare(b.createdAt);
				}
				return b.createdAt.localeCompare(a.createdAt);
			});
		},

		// Modal State
		setFormData: (field, value) => set((state) => ({
			formData: { ...state.formData, [field]: value }
		})),
		updateFormDataArray: (field, value) => set((state) => ({
			formData: { ...state.formData, [field]: value }
		})),
		addFormDataArrayItem: (field, item) => set((state) => ({
			formData: {
				...state.formData,
				[field]: [...state.formData[field], item]
			}
		})),
		removeFormDataArrayItem: (field, index) => set((state) => ({
			formData: {
				...state.formData,
				[field]: state.formData[field].filter((_, i) => i !== index)
			}
		})),
		clearFormData: () => set({ formData: initialFormData }),
		openCreateModal: () => set({
			isOpen: true,
			selectedProblem: null,
			formData: initialFormData,
			loading: false,
			error: null
		}),
		openEditModal: (problem: Problem) => set({
			isOpen: true,
			selectedProblem: problem,
			formData: { ...initialFormData, ...problem },
			loading: false,
			error: null
		}),
		closeModal: () => set({
			isOpen: false,
			selectedProblem: null,
			formData: initialFormData,
			loading: false,
			error: null
		}),
	})
);