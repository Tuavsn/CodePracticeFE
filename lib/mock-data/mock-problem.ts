import { Problem } from "@/types/problem"
import { mockUsers } from "./mock-user"


export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "Easy",
    category: "Array",
    tags: ["array", "hash-table"],
    author: mockUsers[0],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    likes: 1250,
    commentCount: 45,
    submissionCount: 5420,
    acceptanceRate: 89.2,
    isLiked: false,
    isSolved: true,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the best way to approach this problem is to use a hash table.",
    ],
  },
  {
    id: "2",
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    difficulty: "Medium",
    category: "String",
    tags: ["string", "sliding-window", "hash-table"],
    author: mockUsers[1],
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
    likes: 890,
    commentCount: 32,
    submissionCount: 3210,
    acceptanceRate: 67.5,
    isLiked: true,
    isSolved: false,
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    hints: ["Use a sliding window approach.", "Keep track of characters you've seen using a hash set."],
  },
  {
    id: "3",
    title: "Median of Two Sorted Arrays",
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    difficulty: "Hard",
    category: "Binary Search",
    tags: ["array", "binary-search", "divide-and-conquer"],
    author: mockUsers[0],
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    likes: 2100,
    commentCount: 78,
    submissionCount: 1890,
    acceptanceRate: 34.8,
    isLiked: false,
    isSolved: false,
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6",
    ],
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    hints: [
      "Use binary search to find the correct partition.",
      "The key insight is to partition both arrays such that the left partition has the same number of elements as the right partition.",
    ],
  },
  {
    id: "4",
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "Easy",
    category: "Stack",
    tags: ["string", "stack"],
    author: mockUsers[1],
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T14:20:00Z",
    likes: 756,
    commentCount: 28,
    submissionCount: 4100,
    acceptanceRate: 92.1,
    isLiked: true,
    isSolved: true,
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    hints: [
      "Use a stack to keep track of opening brackets.",
      "When you encounter a closing bracket, check if it matches the most recent opening bracket.",
    ],
  },
]