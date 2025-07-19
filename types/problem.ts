import { keyof } from "zod/v4";
import { BaseObject } from "./global";
import { User } from "./user";

export interface Problem extends BaseObject {
  title: string;
  description: string;
  difficulty: (keyof typeof PROBLEM_COMPLEXITY);
  tags: string[];
  author: User;
  likeCount: number;
  commentCount: number;
  submissionCount: number;
  acceptanceRate: number;
  isLiked?: boolean;
  isSolved?: boolean;
  constraints?: string[];
  examples?: ProblemExample[];
  hints?: string[];
  status?: (keyof typeof PROBLEM_STATUS);
  isSelected?: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

// export interface ProblemSubmission extends BaseObject {
//     problemI
// }

export interface ProblemFilter {
  difficulty?: (keyof typeof PROBLEM_COMPLEXITY);
  category?: string;
  tags?: string[];
  status?: 'all' | 'solved' | 'unsolved' | 'published' | 'draft' | 'archived' | 'deleted';
  sortBy: 'newest' | 'oldest' | 'difficulty' | 'acceptance';
  search?: string;
}

export const PROBLEM_COMPLEXITY = {
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

export const SUBMISSION_LANGUAGE = {
  c: 'C',
  cpp: 'C++',
  python: 'Python',
  java: 'Java',
  javascript: 'Javascript',
  csharp: 'C#'
}

export const DEFAULT_CODE_BASE: Record<SubmissionLanguage, string> = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  python: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  javascript: `function main() {
    console.log("Hello, World!");
}

main();
`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`
};

export type SubmissionLanguage = keyof typeof SUBMISSION_LANGUAGE

export type SubmissionLanguageValue = (typeof SUBMISSION_LANGUAGE)[keyof typeof SUBMISSION_LANGUAGE];

export const PROBLEM_RESULT = {
  ACCEPT: "Accepted",
  WRONG_ANSWER: "Wrong answer",
  TIME_LIMIT: 'Time limit',
  STACK_OVERFLOW: 'Stack overflow'
}