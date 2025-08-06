import { Post } from "@/types/post";
import { create } from "zustand";

interface PostState {
    isOpen: boolean;
    mode: 'create' | 'update';
    editingPost: Post | null;
}

interface PostAction {
    openCreateModal: () => void;
    openEditModal: (post: Post) => void;
    closeModal: () => void;
    setMode: (mode: 'create' | 'update') => void;
}

type PostStore = PostState & PostAction;

const initialState: PostState = {
    isOpen: false,
    mode: 'create',
    editingPost: null,
}

export const usePostContext = create<PostStore>()(
    (set, get) => ({
        ...initialState,
        openCreateModal: () => set({
            isOpen: true,
            mode: 'create',
            editingPost: null
        }),
        openEditModal: (post: Post) => set({
            isOpen: true,
            mode: 'update',
            editingPost: post
        }),
        closeModal: () => set({
            ...initialState
        }),
        setMode: (mode: 'create' | 'update') => set({ mode })
    })
)