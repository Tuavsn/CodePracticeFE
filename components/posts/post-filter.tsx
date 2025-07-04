import { useState } from "react"

interface PostFilterType {
  category?: string;
  tags?: string[];
  sortBy: "newest" | "oldest" | "popular" | "trending";
  search?: string;
  status?: "published" | "draft" | "archived" | "deleted" | "all";
}

interface PostFilterProps {
  onFilterChange: (filter: PostFilterType) => void
}

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "DevOps",
  "UI/UX Design",
  "Backend",
  "Frontend",
  "Full Stack",
]

const popularTags = [
  "javascript",
  "react",
  "nextjs",
  "typescript",
  "nodejs",
  "python",
  "css",
  "html",
  "vue",
  "angular",
  "svelte",
]

export default function PostFilter({ onFilterChange }: PostFilterProps) {
  const [search, setSearch] = useState<string>("");
  const [seletedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<PostFilterType["sortBy"]>("newest");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateFilter({ search: value })
  }

  const handleCategoryChange = (category: string) => {

  }

  const handleTagToggle = (tag: string) => {

  }

  const handleSortChange = () => {

  }

  const updateFilter = (updates: Partial<PostFilterType>) => {
    onFilterChange({
      search: search || undefined,
      category: seletedCategory || undefined,
      tags: selectedTags || undefined,
      sortBy,
      ...updates
    })
  }

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedTags([]);
    setSortBy("newest");
    onFilterChange({ sortBy: "newest" })
  }

  return (
    <div>

    </div>
  )
}