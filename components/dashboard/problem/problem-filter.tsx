'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PROBLEM_COMPLEXITY, PROBLEM_STATUS } from "@/types/problem"
import { Search, X } from "lucide-react"

interface ProblemFiltersProps {
  filters: {
    difficulty: string
    status: string
    tag: string
    search: string
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

export default function ProblemFilter({ filters, onFiltersChange, onClearFilters }: ProblemFiltersProps) {
    const hasActiveFilters = filters.difficulty !== "ALL" || filters.status !== "ALL" || filters.tag || filters.search;

    return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-8"
          />
        </div>

        <Select value={filters.difficulty} onValueChange={(value) => onFiltersChange({ difficulty: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Difficulties</SelectItem>
            {Object.entries(PROBLEM_COMPLEXITY)
              .filter(([key]) => key !== "ALL")
              .map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {Object.entries(PROBLEM_STATUS).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Filter by tag..."
          value={filters.tag}
          onChange={(e) => onFiltersChange({ tag: e.target.value })}
          className="w-[200px]"
        />

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.difficulty !== "ALL" && (
            <Badge variant="secondary">
              Difficulty: {PROBLEM_COMPLEXITY[filters.difficulty as keyof typeof PROBLEM_COMPLEXITY]}
              <button
                onClick={() => onFiltersChange({ difficulty: "ALL" })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status !== "ALL" && (
            <Badge variant="secondary">
              Status: {PROBLEM_STATUS[filters.status as keyof typeof PROBLEM_STATUS]}
              <button
                onClick={() => onFiltersChange({ status: "ALL" })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.tag && (
            <Badge variant="secondary">
              Tag: {filters.tag}
              <button
                onClick={() => onFiltersChange({ tag: "" })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary">
              Search: {filters.search}
              <button
                onClick={() => onFiltersChange({ search: "" })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}