import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { POST_STATUS } from "@/types/post"
import { Search, X } from "lucide-react"

interface PostFiltersProps {
  filters: {
    topic: string
    search: string
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

export default function PostFilter({ filters, onFiltersChange, onClearFilters }: PostFiltersProps) {
    // const hasActiveFilters = filters.status !== "ALL" || filters.topic || filters.search
    const hasActiveFilters = filters.topic || filters.search

    return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-8"
          />
        </div>

        {/* <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {Object.entries(POST_STATUS).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <Input
          placeholder="Filter by topic..."
          value={filters.topic}
          onChange={(e) => onFiltersChange({ topic: e.target.value })}
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
          {/* {filters.status !== "ALL" && (
            <Badge variant="secondary">
              Status: {POST_STATUS[filters.status as keyof typeof POST_STATUS]}
              <button
                onClick={() => onFiltersChange({ status: "ALL" })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )} */}
          {filters.topic && (
            <Badge variant="secondary">
              Topic: {filters.topic}
              <button
                onClick={() => onFiltersChange({ topic: "" })}
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