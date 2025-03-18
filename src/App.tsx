import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItems } from "./services/api";
import { ItemCard } from "./components/ItemCard";
import { FilterPanel } from "./components/FilterPanel";
import { ItemModal } from "./components/ItemModal";
import { Button } from "./components/ui/button";
import { BazaarItem } from "./types";

/**
 * Main application component for The Bazaar Items viewer
 * Manages fetching, filtering and displaying items
 */
function App() {
	const [filteredItems, setFilteredItems] = useState<BazaarItem[]>([]);
	const [selectedItem, setSelectedItem] = useState<BazaarItem | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	/**
	 * Fetch data from API
	 */
	const {
		data: items = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["items"],
		queryFn: fetchItems,
	});

	/**
	 * Initialize filtered items with all items on first load
	 */
	useEffect(() => {
		if (items.length > 0) {
			setFilteredItems(items);
		}
	}, [items]);

	/**
	 * Handle item click to show details modal
	 */
	const handleItemClick = (item: BazaarItem) => {
		setSelectedItem(item);
		setIsModalOpen(true);
	};

	return (
		<div className="min-h-svh bg-background">
			<header className="border-b">
				<div className="container mx-auto max-w-6xl py-6">
					<h1 className="text-3xl font-bold">The Bazaar İtemler</h1>
					<p className="text-muted-foreground mt-2">
						Oyundaki tüm itemları keşfedin ve filtreleyin
					</p>
				</div>
			</header>

			<main className="container mx-auto max-w-6xl py-8">
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="text-xl font-semibold">Yükleniyor...</div>
					</div>
				) : error ? (
					<div className="bg-destructive/10 text-destructive p-4 rounded-md">
						<p>
							Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
						</p>
						<Button
							variant="outline"
							className="mt-2"
							onClick={() => window.location.reload()}
						>
							Yeniden Dene
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						<div className="lg:col-span-1">
							<FilterPanel items={items} onFilterChange={setFilteredItems} />
						</div>

						<div className="lg:col-span-3">
							<div className="bg-card p-4 rounded-md shadow-sm mb-4 border">
								<div className="flex justify-between items-center">
									<h2 className="text-xl font-semibold">
										Bulunan İtemler: {filteredItems.length}
									</h2>
									<div className="text-sm text-muted-foreground">
										Toplam: {items.length} item
									</div>
								</div>
							</div>

							{filteredItems.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
									{filteredItems.map((item) => (
										<ItemCard
											key={item.id}
											item={item}
											onClick={() => handleItemClick(item)}
										/>
									))}
								</div>
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

			<ItemModal
				item={selectedItem}
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}

export default App;
