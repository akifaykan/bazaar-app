import { Button } from "./ui/button";
import React from "react";
import { 
	Select, 
	SelectContent, 
	SelectItem, 
	SelectTrigger, 
	SelectValue 
} from "./ui/select";

/**
 * Props for the Pagination component
 * @interface PaginationProps
 * @property {number} currentPage - The current active page
 * @property {number} totalPages - The total number of pages available
 * @property {function} onPageChange - Callback function when page changes
 */
interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

/**
 * Pagination component for navigating between pages
 * Displays page numbers, previous/next buttons, and first/last page buttons
 * Uses React.memo to prevent unnecessary rerenders
 * 
 * @param {PaginationProps} props - Component props
 * @returns {JSX.Element | null} - Renders pagination controls or null if only one page
 */
const PaginationComponent = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
	// Don't render pagination if there's only one page
	if (totalPages <= 1) {
		return null;
	}
	
	/**
	 * Generate an array of page numbers to display
	 * @returns {number[]} Array of page numbers
	 */
	const getPageNumbers = () => {
		const pages = [];
		const maxPages = 5; // Maximum number of page buttons to show
		
		let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
		let endPage = Math.min(totalPages, startPage + maxPages - 1);
		
		// Adjust if we're near the end
		if (endPage - startPage + 1 < maxPages) {
			startPage = Math.max(1, endPage - maxPages + 1);
		}
		
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		
		return pages;
	};
	
	// Use callback handlers to prevent creating new functions on each render
	const handleFirstPage = () => {
		onPageChange(1);
	};
	
	const handlePrevPage = () => {
		onPageChange(currentPage - 1);
	};
	
	const handleNextPage = () => {
		onPageChange(currentPage + 1);
	};
	
	const handleLastPage = () => {
		onPageChange(totalPages);
	};
	
	const handlePageClick = (page: number) => {
		if (page !== currentPage) {
			onPageChange(page);
		}
	};
	
	// Create an array of all page numbers for the select dropdown
	const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
	
	const handlePageSelect = (value: string) => {
		const page = parseInt(value, 10);
		if (page !== currentPage) {
			onPageChange(page);
		}
	};
	
	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div className="flex items-center gap-1">
				{/* First page */}
				<Button 
					variant="outline" 
					size="sm"
					disabled={currentPage === 1}
					onClick={handleFirstPage}
				>
					«
				</Button>
				
				{/* Previous page */}
				<Button 
					variant="outline" 
					size="sm"
					disabled={currentPage === 1}
					onClick={handlePrevPage}
				>
					‹
				</Button>
				
				{/* Page numbers */}
				{getPageNumbers().map(page => (
					<Button 
						key={page}
						variant={currentPage === page ? "default" : "outline"} 
						size="sm"
						onClick={() => handlePageClick(page)}
					>
						{page}
					</Button>
				))}
				
				{/* Next page */}
				<Button 
					variant="outline" 
					size="sm"
					disabled={currentPage === totalPages}
					onClick={handleNextPage}
				>
					›
				</Button>
				
				{/* Last page */}
				<Button 
					variant="outline" 
					size="sm"
					disabled={currentPage === totalPages}
					onClick={handleLastPage}
				>
					»
				</Button>
			</div>
			
			{/* Page selector dropdown */}
			{totalPages > 5 && (
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Sayfaya git:</span>
					<Select
						value={currentPage.toString()}
						onValueChange={handlePageSelect}
					>
						<SelectTrigger className="w-[70px]">
							<SelectValue placeholder={currentPage.toString()} />
						</SelectTrigger>
						<SelectContent>
							{allPages.map(page => (
								<SelectItem key={page} value={page.toString()}>
									{page}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	);
};

// Export memoized component to prevent unnecessary rerenders
export const Pagination = React.memo(PaginationComponent); 