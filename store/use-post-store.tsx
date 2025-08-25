import { Post, UpdatePostRequest } from "@/types/post";
import { create } from "zustand";

interface PostFormData {
	title: string;
	content: string;
	thumbnail: string;
	topics: string[];
	images: { url: string, order: number }[];
}

interface PostState {
	formData: PostFormData;
	posts: Post[];
	reactionedPosts: Record<string, 'like' | 'dislike' | null>;
	commentedPosts: Record<string, boolean>;
	selectedPost: Post | null;
	loading: boolean;
	error: string | null;
	filters: {
		page: number;
		size: number;
		sort: 'asc' | 'desc';
		topics: string[];
		search: string;
	}
	isOpen: boolean;
}

interface PostAction {
	// CRUD Operations
	setPosts: (posts: Post[]) => void;
	addPost: (post: Post) => void;
	updatePost: (id: string, updates: UpdatePostRequest) => void;
	deletePost: (id: string) => void;

	// Post interactions
	reactToPost: (id: string, reaction: 'like' | 'dislike' | null) => void;

	// Selection
	setSelectedPost: (post: Post | null) => void;

	// Loading State
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// Filters
	setFilters: (filters: Partial<PostState['filters']>) => void;
	clearFilters: () => void;

	// Computed getters
	getFilteredPosts: () => Post[];

	// Modal State
	setFormData: (field: keyof PostFormData, value: any) => void;
	updateFormDataArray: (field: 'topics' | 'images', value: any[]) => void;
	addFormDataArrayItem: (field: 'topics' | 'images', item: any) => void;
	removeFormDataArrayItem: (field: 'topics' | 'images', index: number) => void;
	clearFormData: () => void;
	openCreateModal: () => void;
	openEditModal: (post: Post) => void;
	closeModal: () => void;
}

type PostStore = PostState & PostAction;

const initialFormData: PostFormData = {
	title: "",
	content: "",
	thumbnail: "",
	topics: [],
	images: []
}

const initialState: PostState = {
	formData: initialFormData,
	posts: [],
	reactionedPosts: {},
	commentedPosts: {},
	selectedPost: null,
	loading: false,
	error: null,
	filters: {
		page: 0,
		size: 5,
		sort: 'desc',
		topics: [],
		search: '',
	},
	isOpen: false,
}

export const usePostStore = create<PostStore>()(
	(set, get) => ({
		...initialState,
		
		// CRUD Operations
		setPosts: (posts) => set({ posts }),
		addPost: (post) => set((state) => ({
			posts: [post, ...state.posts],
		})),
		updatePost: (id, updates) => set((state) => ({
			posts: state.posts.map(post => (post.id === id ? { ...post, ...updates } : post)),
			selectedPost: state.selectedPost?.id === id ? { ...state.selectedPost, ...updates } : state.selectedPost
		})),
		deletePost: (id) => set((state) => ({
			posts: state.posts.filter(post => post.id !== id),
			selectedPost: state.selectedPost?.id === id ? null : state.selectedPost
		})),

		// Post interactions
		reactToPost: (id, reaction) => set((state) => ({
			reactionedPosts: { ...state.reactionedPosts, [id]: reaction }
		})),

		// Selection
		setSelectedPost: (post) => set({ selectedPost: post }),

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
		getFilteredPosts: () => {
			const { posts, filters } = get();
			return posts.filter(post => {
				const matchesTopic = post.topics === filters.topics || filters.topics.length === 0;
				const matchesSearch = post.title.includes(filters.search) || post.content.includes(filters.search);
				return matchesTopic && matchesSearch;
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
			selectedPost: null,
			formData: initialFormData,
			loading: false,
			error: null
		}),
		openEditModal: (post: Post) => set({
			isOpen: true,
			selectedPost: post,
			formData: { ...initialFormData, ...post },
			loading: false,
			error: null
		}),
		closeModal: () => set({
			isOpen: false,
			selectedPost: null,
			formData: initialFormData,
			loading: false,
			error: null
		}),
	})
)