import { Problem } from "@/types/problem";
import ProblemCard from "./problem-card";
import DataPagination from "../pagination";
import { PaginationData } from "@/lib/api/api-client";

interface ProblemGridProps {
	paginatedProblems: PaginationData<Problem[]>
}

export default function ProblemGrid({
	paginatedProblems
}: ProblemGridProps) {

	const problems = paginatedProblems.content;

	const totalPage = paginatedProblems.totalPages;

	const totalItem = paginatedProblems.totalElements;

	const pageSize = paginatedProblems.size;

	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{problems.map((problem) => (
					<ProblemCard problem={problem} key={problem.id} />
				))}
			</div>
			{/* Pagination */}
			<DataPagination
				totalPage={totalPage}
				totalItems={totalItem}
				pageSize={pageSize}
				maxVisiblePages={5}
				showPageInfo={true}
				showItemsCount={true}
				className="my-4"
			/>
		</>
	)
}