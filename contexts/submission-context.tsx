import { Submission } from "@/types/submission";
import { create } from "zustand";

interface SubmissionState {
    isOpen: boolean;
    mode: 'create' | 'update';
    editingSubmission: Submission | null;
}

interface SubmissionAction {
    openCreateModal: () => void;
    openEditModal: (submission: Submission) => void;
    closeModal: () => void;
    setMode: (mode: 'create' | 'update') => void;
}

type SubmissionStore = SubmissionState & SubmissionAction;

const initialState: SubmissionState = {
    isOpen: false,
    mode: 'create',
    editingSubmission: null,
}

export const useSubmissionContext = create<SubmissionStore>()(
    (set) => ({
        ...initialState,
        openCreateModal: () => set({
            isOpen: true,
            mode: 'create',
            editingSubmission: null
        }),
        openEditModal: (submission: Submission) => set({
            isOpen: true,
            mode: 'update',
            editingSubmission: submission
        }),
        closeModal: () => set({
            ...initialState
        }),
        setMode: (mode: 'create' | 'update') => set({ mode })
    })
);
