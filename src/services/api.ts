import { ApiResponse, BazaarItem } from "../types";

/**
 * API URL for items - Environment variable or fallback to local proxy
 * Using proxy address to work properly in Vercel
 */
const API_URL = import.meta.env.VITE_API_URL || "/api/items";

/**
 * Fetches all items from The Bazaar API
 * Uses the API URL defined in environment variables
 * @returns {Promise<BazaarItem[]>} Array of Bazaar items
 */
export async function fetchItems(): Promise<BazaarItem[]> {
	try {
		/**
		 * Make request to the API
		 */
		const response = await fetch(API_URL, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		/**
		 * Check if response is successful
		 */
		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data: ApiResponse = await response.json();
		return data.data;
	} catch (error) {
		throw new Error(`Error fetching API data: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * Searches items based on a query string
 * @param {string} query - The search query
 * @returns {Promise<BazaarItem[]>} Filtered array of items matching the query
 */
export async function searchItems(query: string): Promise<BazaarItem[]> {
	const items = await fetchItems();

	if (!query) return items;

	const lowerCaseQuery = query.toLowerCase();

	return items.filter(
		(item) =>
			item.name.toLowerCase().includes(lowerCaseQuery) ||
			item.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)) ||
			item.size.toLowerCase().includes(lowerCaseQuery) ||
			item.heroes.some((hero) => hero.toLowerCase().includes(lowerCaseQuery))
	);
}

/**
 * Groups items by their tags
 * @param {BazaarItem[]} items - The items to group
 * @returns {Record<string, BazaarItem[]>} Object with tags as keys and arrays of items as values
 */
export function groupItemsByTag(items: BazaarItem[]): Record<string, BazaarItem[]> {
	return items.reduce(
		(groups, item) => {
			item.tags.forEach((tag) => {
				if (!groups[tag]) {
					groups[tag] = [];
				}
				groups[tag].push(item);
			});

			return groups;
		},
		{} as Record<string, BazaarItem[]>
	);
}

/**
 * Groups items by their size
 * @param {BazaarItem[]} items - The items to group
 * @returns {Record<string, BazaarItem[]>} Object with sizes as keys and arrays of items as values
 */
export function groupItemsBySize(items: BazaarItem[]): Record<string, BazaarItem[]> {
	return items.reduce(
		(groups, item) => {
			if (!groups[item.size]) {
				groups[item.size] = [];
			}
			groups[item.size].push(item);

			return groups;
		},
		{} as Record<string, BazaarItem[]>
	);
}

/**
 * Groups items by their heroes
 * @param {BazaarItem[]} items - The items to group
 * @returns {Record<string, BazaarItem[]>} Object with heroes as keys and arrays of items as values
 */
export function groupItemsByHero(items: BazaarItem[]): Record<string, BazaarItem[]> {
	return items.reduce(
		(groups, item) => {
			item.heroes.forEach((hero) => {
				if (!groups[hero]) {
					groups[hero] = [];
				}
				groups[hero].push(item);
			});

			return groups;
		},
		{} as Record<string, BazaarItem[]>
	);
}
