'use client'
import { mockProblems } from "@/lib/mock-data/mock-problem";
import { Problem } from "@/types/problem";
import { useState } from "react";
import ProblemCard from "./problem-card";

export default function ProblemGrid() {
	const [problem, setProblem] = useState<Problem[]>(mockProblems);

	return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{problem.map((problem) => (
				<ProblemCard
					key={problem.id}
					problem={problem}
				/>
			))}
		</div>
	)
}