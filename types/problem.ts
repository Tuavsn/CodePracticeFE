import { BaseObject, SubmissionLanguage, SubmissionLanguageValue } from "./global";
import { User } from "./user";

export interface Problem extends BaseObject {
  title: string;
  description: string;
  tags: string[];
  constraints: string[];
  examples: ProblemExample[];
  codeTemplates: ProblemCodeTemplate[];
  hints: string[];
  difficulty: (keyof typeof PROBLEM_COMPLEXITY);
  reactionCount: number;
  commentCount: number;
  totalSubmissions: number;
  totalAcceptedSubmissions: number;
  timeLimitSeconds: number;
  memoryLimitMb: number;
  totalScore: number;
  status?: (keyof typeof PROBLEM_STATUS);
  isSelected?: boolean;
}

export type CreateProblemRequest = Pick<Problem, 'title' | 'description' | 'difficulty' | 'tags' | 'constraints' | 'examples' | 'codeTemplates' | 'hints'>;

export type UpdateProblemRequest = Partial<CreateProblemRequest>;

export interface ProblemComment extends BaseObject {
  parentId: string;
  problemId: string;
  author: User;
  content: string;
  commentReactions: CommentReaction[];
}

export type CreateProblemCommentRequest = Pick<ProblemComment, 'content' | 'problemId'>;

export type UpdateProblemCommentRequest = Partial<CreateProblemCommentRequest>;

export interface CommentReaction extends BaseObject {
  author: User;
  reaction: (keyof typeof COMMENT_REACTION);
}

export const COMMENT_REACTION = {
  LIKE: 'Like',
  DISLIKE: 'Dislike'
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemCodeTemplate {
  language: SubmissionLanguageValue;
  code: string;
}

export const PROBLEM_COMPLEXITY = {
  ALL: 'all',
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

export const PROBLEM_STATUS = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
  DELETED: 'Deleted'
}

export const DEFAULT_CODE_BASE: Record<SubmissionLanguage, string> = {
  C: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
`,
  CPP: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  PYTHON: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
`,
  JAVA: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  JAVASCRIPT: `function main() {
    console.log("Hello, World!");
}

main();
`,
  CSHARP: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`
};