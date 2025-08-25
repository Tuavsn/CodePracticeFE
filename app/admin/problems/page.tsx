'use client'
import ProblemTable from "@/components/dashboard/problem/problem-table";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ProblemModal from "@/components/problems/problem-modal";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem"
import { Plus } from "lucide-react";
import { useEffect } from "react";

export default function AdminProblemPage() {
	const {
		problems,
		loading,
		error,
		filters,
		handleFetchProblems,
		openCreateModal,
		openEditModal,
		handleRemoveProblem,
		handleViewProblem
	} = useProblem();

	useEffect(() => {
		handleFetchProblems()
	}, [filters])

	return (
		<DashboardLayout>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Problems</h2>
					<p className="text-muted-foreground">Manage your problem reports</p>
				</div>
				<Button onClick={() => openCreateModal()}>
					<Plus className="mr-2 h-4 w-4" />
					Create Problem
				</Button>
			</div>

			{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

			<ProblemTable
				problems={problems}
				onEdit={openEditModal}
				onDelete={handleRemoveProblem}
				onView={handleViewProblem}
				loading={loading}
			/>
			<ProblemModal />
		</DashboardLayout>
	)
}