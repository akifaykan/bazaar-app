import { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { BazaarItem } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X } from "lucide-react";

/**
 * Props for the FilterPanel component
 */
type FilterPanelProps = {
	/** Array of all items to be filtered */
	items: BazaarItem[];
	/** Callback function called when filters change */
	onFilterChange: (filteredItems: BazaarItem[]) => void;
};

/**
 * Filter panel component that provides search and filtering options
 * Allows filtering by search term, tags, size, and heroes
 */
export function FilterPanel({ items, onFilterChange }: FilterPanelProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
	const [selectedHeroes, setSelectedHeroes] = useState<string[]>([]);

	// Check if any filter is active
	const isFilterActive = searchQuery !== "" || 
		selectedTags.length > 0 || 
		selectedSizes.length > 0 || 
		selectedHeroes.length > 0;

	/**
	 * Get unique values for each filter category
	 */
	const uniqueTags = Array.from(new Set(items.flatMap((item) => item.tags))).sort();
	const uniqueSizes = Array.from(new Set(items.map((item) => item.size))).sort();
	const uniqueHeroes = Array.from(new Set(items.flatMap((item) => item.heroes))).sort();

	/**
	 * Apply filters and update parent component
	 * Using useCallback to memoize the filtering function
	 */
	const applyFilters = useCallback(() => {
		let filtered = [...items];

		/**
		 * Filter by search query
		 */
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
					item.heroes.some((hero) => hero.toLowerCase().includes(query))
			);
		}

		/**
		 * Filter by selected tags
		 */
		if (selectedTags.length > 0) {
			filtered = filtered.filter((item) =>
				selectedTags.some((tag) => item.tags.includes(tag))
			);
		}

		/**
		 * Filter by selected sizes
		 */
		if (selectedSizes.length > 0) {
			filtered = filtered.filter((item) => selectedSizes.includes(item.size));
		}

		/**
		 * Filter by selected heroes
		 */
		if (selectedHeroes.length > 0) {
			filtered = filtered.filter((item) =>
				selectedHeroes.some((hero) => item.heroes.includes(hero))
			);
		}

		onFilterChange(filtered);
	}, [items, searchQuery, selectedTags, selectedSizes, selectedHeroes, onFilterChange]);

	/**
	 * Apply filters when dependencies change
	 */
	useEffect(() => {
		applyFilters();
	}, [applyFilters]);

	/**
	 * Handle checkbox state change
	 * @param value - The checkbox value
	 * @param selectedValues - Current selected values array
	 * @param setSelectedValues - State updater function
	 */
	const handleCheckboxChange = (
		value: string,
		selectedValues: string[],
		setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
	) => {
		if (selectedValues.includes(value)) {
			setSelectedValues(selectedValues.filter((v) => v !== value));
		} else {
			setSelectedValues([...selectedValues, value]);
		}
	};

	/**
	 * Clear all filters
	 */
	const clearAllFilters = () => {
		setSearchQuery("");
		setSelectedTags([]);
		setSelectedSizes([]);
		setSelectedHeroes([]);
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex justify-between items-center">
					<CardTitle>Filtreler</CardTitle>
					<div className="h-8 flex items-center">
						{isFilterActive && (
							<Button 
								variant="ghost" 
								size="sm" 
								onClick={clearAllFilters}
								className="text-muted-foreground hover:text-foreground"
							>
								<X className="h-4 w-4 mr-1" />
								<span>Temizle</span>
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="search">Arama</Label>
					<Input
						id="search"
						type="search"
						placeholder="İtem Ara..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<h3 className="text-sm font-medium">Etiketler</h3>
					<div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
						{uniqueTags.map((tag) => (
							<div key={tag} className="flex items-center space-x-2">
								<Checkbox
									id={`tag-${tag}`}
									checked={selectedTags.includes(tag)}
									onCheckedChange={() =>
										handleCheckboxChange(tag, selectedTags, setSelectedTags)
									}
								/>
								<Label
									htmlFor={`tag-${tag}`}
									className="text-sm text-muted-foreground"
								>
									{tag}
								</Label>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="text-sm font-medium">Boyut</h3>
					<div className="space-y-2 border rounded-md p-2">
						{uniqueSizes.map((size) => (
							<div key={size} className="flex items-center space-x-2">
								<Checkbox
									id={`size-${size}`}
									checked={selectedSizes.includes(size)}
									onCheckedChange={() =>
										handleCheckboxChange(size, selectedSizes, setSelectedSizes)
									}
								/>
								<Label
									htmlFor={`size-${size}`}
									className="text-sm text-muted-foreground"
								>
									{size}
								</Label>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="text-sm font-medium">Kahramanlar</h3>
					<div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
						{uniqueHeroes.map((hero) => (
							<div key={hero} className="flex items-center space-x-2">
								<Checkbox
									id={`hero-${hero}`}
									checked={selectedHeroes.includes(hero)}
									onCheckedChange={() =>
										handleCheckboxChange(
											hero,
											selectedHeroes,
											setSelectedHeroes
										)
									}
								/>
								<Label
									htmlFor={`hero-${hero}`}
									className="text-sm text-muted-foreground"
								>
									{hero}
								</Label>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
