import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItems } from "./services/api";
import { ItemCard } from "./components/ItemCard";
import { FilterPanel } from "./components/FilterPanel";
import { ItemModal } from "./components/ItemModal";
import { Button } from "./components/ui/button";
import { BazaarItem } from "./types";
import { Pagination } from "./components/Pagination";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";

/**
 * Main application component for The Bazaar Items viewer
 * Manages fetching, filtering, displaying items and pagination
 *
 * @returns {JSX.Element} The rendered application
 */
function App() {
	// Base data state
	const [selectedItem, setSelectedItem] = useState<BazaarItem | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filteredItems, setFilteredItems] = useState<BazaarItem[]>([]);

	// Pagination state
	const [pageConfig, setPageConfig] = useState({
		currentPage: 1,
		itemsPerPage: 9,
	});

	/**
	 * Fetch data from API using React Query
	 */
	const {
		data: items = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["items"],
		queryFn: fetchItems,
	});

	/**
	 * Initialize filtered items with all items on first load
	 */
	useEffect(() => {
		if (items && items.length > 0) {
			setFilteredItems(items);
			// Reset to page 1 when data changes
			setPageConfig((prev) => ({ ...prev, currentPage: 1 }));
		}
	}, [items]);

	/**
	 * Handle item click to show details modal
	 */
	const handleItemClick = useCallback((item: BazaarItem) => {
		setSelectedItem(item);
		setIsModalOpen(true);
	}, []);

	/**
	 * Handle page change in pagination
	 */
	const handlePageChange = useCallback((page: number) => {
		setPageConfig((prev) => ({ ...prev, currentPage: page }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	/**
	 * Handle items per page change
	 */
	const handleItemsPerPageChange = useCallback((perPage: number) => {
		setPageConfig({
			currentPage: 1, // Reset to page 1 when items per page changes
			itemsPerPage: perPage,
		});
	}, []);

	/**
	 * Handle filter change
	 */
	const handleFilterChange = useCallback((items: BazaarItem[]) => {
		setFilteredItems(items);
		setPageConfig((prev) => ({ ...prev, currentPage: 1 }));
	}, []);

	// Calculate pagination values using useMemo to avoid recalculations
	const paginationData = useMemo(() => {
		const { currentPage, itemsPerPage } = pageConfig;

		// Calculate total pages
		const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

		// Ensure current page is within bounds
		const validPage = Math.max(1, Math.min(currentPage, totalPages));

		// Calculate item indices
		const startIndex = (validPage - 1) * itemsPerPage;
		const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);

		// Get visible items
		const visibleItems = filteredItems.slice(startIndex, endIndex);

		return {
			totalPages,
			validPage,
			visibleItems,
		};
	}, [filteredItems, pageConfig]);

	const { totalPages, validPage, visibleItems } = paginationData;

	// Extract error message from error object
	const errorMessage = error instanceof Error 
		? error.message
		: "Bilinmeyen bir hata oluştu.";

	return (
		<div className="min-h-svh flex flex-col bg-background">
			<header className="border-b">
				<div className="container mx-auto max-w-6xl py-8">
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-3xl font-bold">The Bazaar İtemler</h1>
							<p className="text-muted-foreground mt-2">
								Oyundaki tüm itemları keşfedin ve filtreleyin
							</p>
						</div>
						<ThemeToggle />
					</div>
				</div>
			</header>

			<main className="container mx-auto max-w-6xl flex-1 pt-8 pb-24">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="text-xl font-semibold">Yükleniyor...</div>
					</div>
				) : error ? (
					<div className="bg-destructive/10 text-destructive p-6 rounded-md">
						<h2 className="text-xl font-semibold mb-2">Veri Yükleme Hatası</h2>
						<p className="mb-4">
							Veriler yüklenirken bir hata oluştu:
						</p>
						<div className="bg-black/5 p-3 rounded mb-4 text-sm font-mono">
							{errorMessage}
						</div>
						<div className="flex flex-col sm:flex-row gap-2">
							<Button
								variant="outline"
								onClick={() => refetch()}
								className="flex-1"
							>
								Yeniden Dene
							</Button>
							<Button
								variant="default"
								onClick={() => window.location.reload()}
								className="flex-1"
							>
								Sayfayı Yenile
							</Button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						<div className="lg:col-span-1">
							<FilterPanel items={items} onFilterChange={handleFilterChange} />

							{/* Items per page selection */}
							<div className="mt-4 bg-card p-4 rounded-md border">
								<label className="block text-sm font-medium mb-2">
									Sayfa başına item
								</label>
								<select
									className="w-full p-2 border rounded bg-background"
									value={pageConfig.itemsPerPage}
									onChange={(e) =>
										handleItemsPerPageChange(Number(e.target.value))
									}
								>
									<option value={9}>9</option>
									<option value={12}>12</option>
									<option value={24}>24</option>
									<option value={48}>48</option>
								</select>
							</div>
						</div>

						<div className="lg:col-span-3">
							<div className="bg-card p-4 rounded-md shadow-sm mb-4 border">
								<div className="flex justify-between items-center">
									<h2 className="text-xl font-semibold">
										Bulunan İtemler: {filteredItems.length}
									</h2>
									<div className="text-sm text-muted-foreground">
										Sayfa {validPage}/{totalPages} (Toplam: {items.length} item)
									</div>
								</div>
							</div>

							{filteredItems.length > 0 ? (
								<>
									<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
										{visibleItems.map((item) => (
											<ItemCard
												key={item.id}
												item={item}
												onClick={() => handleItemClick(item)}
											/>
										))}
									</div>

									{/* Pagination controls */}
									{totalPages > 1 && (
										<div className="mt-8">
											<Pagination
												currentPage={validPage}
												totalPages={totalPages}
												onPageChange={handlePageChange}
											/>
										</div>
									)}
								</>
							) : (
								<div className="bg-card p-10 text-center rounded-md border">
									<p className="text-lg text-muted-foreground">
										Bu filtrelere uygun item bulunamadı.
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</main>

			<Footer />

			<ItemModal
				item={selectedItem}
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}

export default App;
