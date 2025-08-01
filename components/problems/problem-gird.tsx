import { Problem } from "@/types/problem";
import ProblemCard from "./problem-card";

interface ProblemGridProps {
	problems: Problem[]
}

export default function ProblemGrid({
	problems
}: ProblemGridProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{problems.map((problem) => (
				<ProblemCard
					key={problem.id}
					problem={problem}
				/>
			))}
		</div>
	)
}