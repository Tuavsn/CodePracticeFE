'use client'
import ContainerLayout from "@/components/layout/container-layout";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProblem } from "@/hooks/use-problem";
import { mockProblems } from "@/lib/mock-data/mock-problem";
import { stringToSlug } from "@/lib/string-utils";
import { Problem } from "@/types/problem";
import { ArrowLeft, Play, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = params.id as string;

  console.log(problemId)

  const [problem, setProblem] = useState<Problem>(mockProblems.find((p) => p.id === problemId) || mockProblems[0]);

  const {
    getDifficultyColor
  } = useProblem();

  const renderBreadCrumb = () => {
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-600 hover:text-black transition-colors">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/problems" className="text-gray-600 hover:text-black transition-colors">
              Coding
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-black font-medium">
              Slug
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const renderBackButton = () => {
    return (
      <Button variant={"link"} asChild className="cursor-pointer mb-4">
        <Link href="/problems">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </Link>
      </Button>
    )
  }

  return (
    <ContainerLayout>
      {/* Backbutton */}
      {renderBackButton()}
      {/* Breadcrumb */}
      {renderBreadCrumb()}
      
      {/* Content - Single Column Layout */}
      <div className="space-y-6">
        {/* Problem Stats - Moved to top */}
        <Card className="rounded-md shadow-lg">
          <CardHeader>
            <CardTitle>Problem Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm font-semibold text-muted-foreground">Solved</div>
              <div className="text-2xl font-bold text-blue-400">2,847,392</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-muted-foreground">Acceptance Rate</div>
              <div className="text-2xl font-bold text-red-400">49.1%</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-muted-foreground mt-1">Difficulty</div>
              <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-muted-foreground mb-1">Vote</div>
              <div className="flex justify-center items-center gap-3">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm">45,231</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-5 w-5 text-red-600" />
                  <span className="text-sm">1,432</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problem Content */}
        <Card className="rounded-md shadow-xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {problemId}. {problem.title}
                </CardTitle>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  {/* <span className="text-sm text-muted-foreground">Acceptance: {problem.acceptance}</span> */}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Link href={`/problems/solve/${stringToSlug(problem.title)}?id=${problemId}`}>
                  <Button className="cursor-pointer">
                    <Play className="h-4 w-4 mr-1" />
                    Solve
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Problem Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Problem Description</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-muted-foreground">{problem.description}</p>
              </div>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Example {index + 1}:</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Input:</strong>{" "}
                        <code className="bg-background px-2 py-1 rounded">{example.input}</code>
                      </div>
                      <div>
                        <strong>Output:</strong>{" "}
                        <code className="bg-background px-2 py-1 rounded">{example.output}</code>
                      </div>
                      <div>
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Constraints</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Problems - Moved to bottom */}
        <Card className="rounded-lg shadow-2xl">
          <CardHeader>
            <CardTitle>Related Problems</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/problems/2" className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border">
              <div className="font-medium">Add Two Numbers</div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </Link>
            <Link href="/problems/3" className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border">
              <div className="font-medium">Longest Substring</div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </Link>
            <Link href="/problems/4" className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border">
              <div className="font-medium">Median of Arrays</div>
              <div className="text-sm text-muted-foreground">Hard</div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ContainerLayout>
  )
}