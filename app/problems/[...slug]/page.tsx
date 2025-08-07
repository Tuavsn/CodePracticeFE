import ContainerLayout from "@/components/layout/container-layout";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProblemService } from "@/lib/services/problem.service";
import { stringToSlug } from "@/lib/string-utils";
import { getDifficultyColor } from "@/lib/utils";
import { ArrowLeft, Play, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default async function ProblemDetailPage({
  params
}: {
  params: Promise<{ slug: string[] }>
}) {
  const problemParams = (await params).slug[0];

  const slugAndId = problemParams.split("-");

  const problemId = slugAndId.pop();

  const slug = slugAndId.join('-')

  const problem = await ProblemService.getProblemById(problemId as string);

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
              {slug}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const renderBackButton = () => {
    return (
      <Button variant={"link"} asChild className="mb-4">
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

      {/* Content - Grid Layout */}
      <div className="space-y-6">
        {/* Problem Content and Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Problem Content - Takes 3 columns */}
          <div className="lg:col-span-3">
            <Card className="rounded-md shadow-xl gap-0">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      .{problem.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      {/* <span className="text-sm text-muted-foreground">Acceptance: {problem.acceptance}</span> */}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* TODO */}
                    {/* <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button> */}
                    <Link href={`/problems/solve/${stringToSlug(problem.title)}-${problemId}`}>
                      <Button>
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
                    {problem.examples?.map((example, index) => (
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
                    {problem.constraints?.map((constraint, index) => (
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
          </div>

          {/* Right Sidebar - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Problem Stats */}
            <Card className="gap-1 rounded-md shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-base text-center">Problem Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Solved</div>
                  <div className="text-lg font-bold text-blue-400">{problem.totalSubmissions}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Acceptance</div>
                  <div className="text-lg font-bold text-red-400">{problem.totalAcceptedSubmissions}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Difficulty</div>
                  <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">
                    {problem.difficulty}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Time Limit</div>
                  <div className="text-sm font-semibold text-gray-800">{problem.timeLimitSeconds} s 🕐</div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Memory Limit</div>
                  <div className="text-sm font-semibold text-gray-800">{problem.memoryLimitMb} MB 💾</div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className="text-sm font-semibold text-yellow-600">{problem.totalScore}</div>
                </div>
                {/* TODO */}
                {/* <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Rating</div>
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs">45K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                      <span className="text-xs">1.4K</span>
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Related Problems - Now below stats */}
            {/* TODO */}
            {/* <Card className="rounded-lg shadow-2xl">
              <CardHeader>
                <CardTitle>Related Problems</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/problems/2" className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border">
                  <div className="text-sm font-semibold">Add Two Numbers</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </Link>
                <Link href="/problems/3" className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border">
                  <div className="text-sm font-semibold">Longest Substring</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </Link>
                <Link href="/problems/4" className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border">
                  <div className="text-sm font-semibold">Median of Arrays</div>
                  <div className="text-sm text-muted-foreground">Hard</div>
                </Link>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </ContainerLayout>
  )
}