'use client'
import { useMemo, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis
} from "./ui/pagination";
import { cn } from "@/lib/utils";

interface DataPaginationProps {
	/** Total number of pages */
	totalPage: number;
	/** Total number of items (optional, for display) */
	totalItems?: number;
	/** Number of items per page (optional, for display) */
	pageSize?: number;
	/** Maximum number of page buttons to show */
	maxVisiblePages?: number;
	/** Show page info text */
	showPageInfo?: boolean;
	/** Show total items count */
	showItemsCount?: boolean;
	/** Custom class name */
	className?: string;
	/** URL parameter name for page (default: 'page') */
	pageParam?: string;
	/** Scroll to top after page change */
	scrollToTop?: boolean;
	/** Custom labels for accessibility */
	labels?: {
		previous?: string;
		next?: string;
		page?: string;
		of?: string;
		items?: string;
		showing?: string;
		to?: string;
	};
	/** Additional URL parameters to preserve */
	preserveParams?: string[];
}

interface PageRange {
	start: number;
	end: number;
	showStartEllipsis: boolean;
	showEndEllipsis: boolean;
}

export default function DataPagination({
	totalPage,
	totalItems,
	pageSize,
	maxVisiblePages = 7,
	showPageInfo = true,
	showItemsCount = false,
	className,
	pageParam = 'page',
	scrollToTop = true,
	labels = {},
	preserveParams = []
}: DataPaginationProps) {

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Get current page from URL (1-based in URL, convert to 0-based internally)
	const currentPage = Math.max(0, parseInt(searchParams.get(pageParam) || '1') - 1);

	// Default labels
	const defaultLabels = {
		previous: 'Previous',
		next: 'Next',
		page: 'Page',
		of: 'of',
		items: 'items',
		showing: 'Showing',
		to: 'to',
		...labels
	};

	// Validate props
	const isValid = totalPage > 0 && currentPage >= 0 && currentPage < totalPage;

	if (!isValid) {
		console.warn('DataPagination: Invalid totalPage or current page from URL');
		return null;
	}

	// Calculate page range to display
	const pageRange: PageRange = useMemo(() => {
		if (totalPage <= maxVisiblePages) {
			return {
				start: 0,
				end: totalPage - 1,
				showStartEllipsis: false,
				showEndEllipsis: false
			};
		}

		const halfVisible = Math.floor(maxVisiblePages / 2);
		let start = Math.max(0, currentPage - halfVisible);
		let end = Math.min(totalPage - 1, start + maxVisiblePages - 1);

		// Adjust if we're near the end
		if (end === totalPage - 1) {
			start = Math.max(0, end - maxVisiblePages + 1);
		}

		return {
			start,
			end,
			showStartEllipsis: start > 0,
			showEndEllipsis: end < totalPage - 1
		};
	}, [currentPage, totalPage, maxVisiblePages]);

	// Generate URL for a specific page
	const createPageUrl = useCallback((page: number) => {
		const params = new URLSearchParams(searchParams);

		// Set page parameter (convert back to 1-based for URL)
		if (page === 0) {
			params.delete(pageParam); // Remove page param for first page
		} else {
			params.set(pageParam, (page + 1).toString());
		}

		// Preserve specified parameters
		preserveParams.forEach(param => {
			const value = searchParams.get(param);
			if (value) {
				params.set(param, value);
			}
		});

		const queryString = params.toString();
		return `${pathname}${queryString ? `?${queryString}` : ''}`;
	}, [searchParams, pathname, pageParam, preserveParams]);

	// Handle page change with URL navigation
	const handlePageClick = useCallback((page: number) => {
		if (page < 0 || page >= totalPage || page === currentPage || isPending) {
			return;
		}

		const url = createPageUrl(page);

		startTransition(() => {
			router.push(url, { scroll: scrollToTop });
		});
	}, [currentPage, totalPage, isPending, createPageUrl, router, scrollToTop]);

	// Calculate items info for display
	const itemsInfo = useMemo(() => {
		if (!totalItems || !pageSize) return null;

		const start = currentPage * pageSize + 1;
		const end = Math.min((currentPage + 1) * pageSize, totalItems);

		return { start, end, total: totalItems };
	}, [currentPage, totalItems, pageSize]);

	// Generate page numbers array
	const pageNumbers = useMemo(() => {
		const pages = [];
		for (let i = pageRange.start; i <= pageRange.end; i++) {
			pages.push(i);
		}
		return pages;
	}, [pageRange]);

	// Don't render if only one page
	if (totalPage <= 1) {
		return showItemsCount && itemsInfo ? (
			<div className={cn("flex items-center justify-center text-sm text-muted-foreground", className)}>
				{defaultLabels.showing} {itemsInfo.start} {defaultLabels.to} {itemsInfo.end} {defaultLabels.of} {itemsInfo.total} {defaultLabels.items}
			</div>
		) : null;
	}

	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			{/* Items count info */}
			{showItemsCount && itemsInfo && (
				<div className="text-sm text-muted-foreground text-center px-2">
					{defaultLabels.showing} <span className="font-medium">{itemsInfo.start}</span> {defaultLabels.to} <span className="font-medium">{itemsInfo.end}</span> {defaultLabels.of} <span className="font-medium">{itemsInfo.total}</span> {defaultLabels.items}
				</div>
			)}

			{/* Pagination controls */}
			<Pagination>
				<PaginationContent className="flex-wrap">
					{/* Previous button */}
					<PaginationItem>
						<PaginationPrevious
							href={currentPage > 0 ? createPageUrl(currentPage - 1) : '#'}
							onClick={(e) => {
								e.preventDefault();
								handlePageClick(currentPage - 1);
							}}
							className={cn(
								"select-none transition-colors",
								(isPending || currentPage === 0) && "pointer-events-none opacity-50"
							)}
							aria-label={`Go to previous page`}
							tabIndex={isPending || currentPage === 0 ? -1 : 0}
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only sm:not-sr-only sm:ml-1">{defaultLabels.previous}</span>
						</PaginationPrevious>
					</PaginationItem>

					{/* First page + ellipsis */}
					{pageRange.showStartEllipsis && (
						<>
							<PaginationItem>
								<PaginationLink
									href={createPageUrl(0)}
									onClick={(e) => {
										e.preventDefault();
										handlePageClick(0);
									}}
									className={cn(
										"select-none transition-colors",
										isPending && "opacity-50"
									)}
									aria-label={`Go to page 1`}
								>
									1
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						</>
					)}

					{/* Page numbers */}
					{pageNumbers.map((pageIndex) => (
						<PaginationItem key={pageIndex}>
							<PaginationLink
								href={createPageUrl(pageIndex)}
								isActive={pageIndex === currentPage}
								onClick={(e) => {
									e.preventDefault();
									handlePageClick(pageIndex);
								}}
								className={cn(
									"select-none transition-colors",
									isPending && "opacity-50"
								)}
								aria-label={`Go to page ${pageIndex + 1}`}
								aria-current={pageIndex === currentPage ? 'page' : undefined}
								tabIndex={isPending ? -1 : 0}
							>
								{pageIndex + 1}
							</PaginationLink>
						</PaginationItem>
					))}

					{/* Last page + ellipsis */}
					{pageRange.showEndEllipsis && (
						<>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink
									href={createPageUrl(totalPage - 1)}
									onClick={(e) => {
										e.preventDefault();
										handlePageClick(totalPage - 1);
									}}
									className={cn(
										"select-none transition-colors",
										isPending && "opacity-50"
									)}
									aria-label={`Go to page ${totalPage}`}
								>
									{totalPage}
								</PaginationLink>
							</PaginationItem>
						</>
					)}

					{/* Next button */}
					<PaginationItem>
						<PaginationNext
							href={currentPage < totalPage - 1 ? createPageUrl(currentPage + 1) : '#'}
							onClick={(e) => {
								e.preventDefault();
								handlePageClick(currentPage + 1);
							}}
							className={cn(
								"select-none transition-colors",
								(isPending || currentPage === totalPage - 1) && "pointer-events-none opacity-50"
							)}
							aria-label={`Go to next page`}
							tabIndex={isPending || currentPage === totalPage - 1 ? -1 : 0}
						>
							<ChevronRight className="h-4 w-4" />
							<span className="sr-only sm:not-sr-only sm:ml-1">{defaultLabels.next}</span>
						</PaginationNext>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{/* Page info */}
			{showPageInfo && (
				<div className="text-sm text-muted-foreground text-center px-2">
					{defaultLabels.page} <span className="font-medium">{currentPage + 1}</span> {defaultLabels.of} <span className="font-medium">{totalPage}</span>
					{isPending && <span className="ml-2 text-xs opacity-60">Loading...</span>}
				</div>
			)}
		</div>
	);
}