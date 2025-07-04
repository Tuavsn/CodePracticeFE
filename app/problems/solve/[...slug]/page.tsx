'use client'
import { mockProblems } from "@/lib/mock-data/mock-problem";
import { Problem } from "@/types/problem";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProblemSolvePage() {
    const params = useParams();
    const problemId = params.id as string;

    const [problem, setProblem] = useState<Problem>(mockProblems.find((p) => p.id === problemId) || mockProblems[0]);

    return <div>ProblemSolvePage</div>
}