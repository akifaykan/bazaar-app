import { ApiResponse, BazaarItem } from "../types";

/**
 * API URL for items
 */
const API_URL = "/api/api/items";

/**
 * Fetches all items from The Bazaar API
 * Uses a proxy to avoid CORS issues
 * Falls back to mock data if the API request fails
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
			console.error("API response code:", response.status);
			console.error("API error:", await response.text());
			/**
			 * Use mock data if API request fails
			 */
			return mockItems;
		}

		const data: ApiResponse = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching data:", error);
		/**
		 * Use mock data in case of error
		 */
		return mockItems;
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

/**
 * Mock data for development and fallback
 */
const mockItems: BazaarItem[] = [
	{
		id: "12345",
		name: "Shovel",
		startingTier: "Bronze",
		tiers: {
			Bronze: { tooltips: ["Cooldown 6 seconds", "Deal 40 damage."] },
			Silver: { tooltips: ["Cooldown 6 seconds", "Deal 60 damage."] },
			Gold: { tooltips: ["Cooldown 6 seconds", "Deal 80 damage."] },
			Diamond: { tooltips: ["Cooldown 6 seconds", "Deal 100 damage."] },
			Legendary: { tooltips: [] },
		},
		tags: ["Weapon"],
		hiddenTags: ["Damage"],
		size: "Medium",
		heroes: ["Common"],
		enchantments: [
			{ type: "Shiny", tooltips: ["This has +1 Multicast."] },
			{ type: "Deadly", tooltips: ["+50% Crit Chance"] },
			{ type: "Obsidian", tooltips: ["This has double Damage."] },
		],
		unifiedTooltips: ["Cooldown 6 seconds", "Deal (40/60/80/100) damage."],
		remarks: [],
		packId: "Core",
		combatEncounters: [],
	},
	{
		id: "12346",
		name: "Trebuchet",
		startingTier: "Bronze",
		tiers: {
			Bronze: { tooltips: ["Cooldown 8 seconds", "Deal 40 damage.", "Burn 4."] },
			Silver: { tooltips: ["Cooldown 8 seconds", "Deal 60 damage.", "Burn 6."] },
			Gold: { tooltips: ["Cooldown 8 seconds", "Deal 80 damage.", "Burn 8."] },
			Diamond: { tooltips: ["Cooldown 8 seconds", "Deal 100 damage.", "Burn 10."] },
			Legendary: { tooltips: [] },
		},
		tags: ["Weapon"],
		hiddenTags: ["Damage", "Burn"],
		size: "Large",
		heroes: ["Common"],
		enchantments: [
			{ type: "Shiny", tooltips: ["This has +1 Multicast."] },
			{ type: "Fiery", tooltips: ["This has double Burn."] },
			{ type: "Obsidian", tooltips: ["This has double Damage."] },
		],
		unifiedTooltips: ["Cooldown 8 seconds", "Deal (40/60/80/100) damage.", "Burn (4/6/8/10)."],
		remarks: [],
		packId: "Core",
		combatEncounters: [],
	},
	{
		id: "12347",
		name: "Pet Rock",
		startingTier: "Bronze",
		tiers: {
			Bronze: {
				tooltips: [
					"Cooldown 4 seconds",
					"Deal 8 damage.",
					"If this is your only Friend, your items have +10% Crit Chance.",
				],
			},
			Silver: {
				tooltips: [
					"Cooldown 4 seconds",
					"Deal 16 damage.",
					"If this is your only Friend, your items have +15% Crit Chance.",
				],
			},
			Gold: {
				tooltips: [
					"Cooldown 4 seconds",
					"Deal 24 damage.",
					"If this is your only Friend, your items have +20% Crit Chance.",
				],
			},
			Diamond: {
				tooltips: [
					"Cooldown 4 seconds",
					"Deal 32 damage.",
					"If this is your only Friend, your items have +25% Crit Chance.",
				],
			},
			Legendary: { tooltips: [] },
		},
		tags: ["Weapon", "Toy", "Friend"],
		hiddenTags: ["Damage", "Crit"],
		size: "Small",
		heroes: ["Pygmalien"],
		enchantments: [
			{ type: "Shiny", tooltips: ["This has +1 Multicast."] },
			{ type: "Deadly", tooltips: ["+50% Crit Chance"] },
		],
		unifiedTooltips: [
			"Cooldown 4 seconds",
			"Deal (8/16/24/32) damage.",
			"If this is your only Friend, your items have +(10/15/20/25)% Crit Chance.",
		],
		remarks: [],
		packId: "Pygmalien_Core",
		combatEncounters: [],
	},
	{
		id: "12348",
		name: "Bolas",
		startingTier: "Bronze",
		tiers: {
			Bronze: { tooltips: ["Cooldown 5 seconds", "Deal 40 damage."] },
			Silver: { tooltips: ["Cooldown 5 seconds", "Deal 60 damage."] },
			Gold: { tooltips: ["Cooldown 5 seconds", "Deal 80 damage."] },
			Diamond: { tooltips: ["Cooldown 5 seconds", "Deal 100 damage."] },
			Legendary: { tooltips: [] },
		},
		tags: ["Weapon"],
		hiddenTags: ["Damage", "Slow"],
		size: "Medium",
		heroes: ["Common"],
		enchantments: [
			{ type: "Heavy", tooltips: ["Slow 1 item for 2 seconds."] },
			{ type: "Shiny", tooltips: ["This has +1 Multicast."] },
			{ type: "Obsidian", tooltips: ["This has double Damage."] },
		],
		unifiedTooltips: ["Cooldown 5 seconds", "Deal (40/60/80/100) damage."],
		remarks: [],
		packId: "Core",
		combatEncounters: [],
	},
	{
		id: "12349",
		name: "Double Barrel",
		startingTier: "Bronze",
		tiers: {
			Bronze: { tooltips: ["Cooldown 4 seconds", "Ammo Max: 2", "Deal 25 damage."] },
			Silver: { tooltips: ["Cooldown 4 seconds", "Ammo Max: 2", "Deal 50 damage."] },
			Gold: { tooltips: ["Cooldown 4 seconds", "Ammo Max: 2", "Deal 75 damage."] },
			Diamond: { tooltips: ["Cooldown 4 seconds", "Ammo Max: 2", "Deal 100 damage."] },
			Legendary: { tooltips: [] },
		},
		tags: ["Weapon", "Ammo"],
		hiddenTags: ["Damage"],
		size: "Medium",
		heroes: ["Common"],
		enchantments: [
			{ type: "Shiny", tooltips: ["This has +1 Multicast."] },
			{ type: "Deadly", tooltips: ["+50% Crit Chance"] },
		],
		unifiedTooltips: ["Cooldown 4 seconds", "Ammo Max: 2", "Deal (25/50/75/100) damage."],
		remarks: [],
		packId: "Core",
		combatEncounters: [],
	},
	{
		id: "12350",
		name: "Rifle",
		startingTier: "Bronze",
		tiers: {
			Bronze: { tooltips: ["Cooldown 3 seconds", "Ammo Max: 3", "Deal 6 damage."] },
			Silver: { tooltips: ["Cooldown 3 seconds", "Ammo Max: 3", "Deal 12 damage."] },
			Gold: { tooltips: ["Cooldown 3 seconds", "Ammo Max: 3", "Deal 18 damage."] },
			Diamond: { tooltips: ["Cooldown 3 seconds", "Ammo Max: 3", "Deal 24 damage."] },
			Legendary: { tooltips: [] },
		},
		tags: ["Weapon", "Ammo"],
		hiddenTags: ["Damage"],
		size: "Medium",
		heroes: ["Common"],
		enchantments: [
			{ type: "Shiny", tooltips: ["This has +1 Multicast."] },
			{ type: "Deadly", tooltips: ["+50% Crit Chance"] },
		],
		unifiedTooltips: ["Cooldown 3 seconds", "Ammo Max: 3", "Deal (6/12/18/24) damage."],
		remarks: [],
		packId: "Core",
		combatEncounters: [],
	},
	{
		id: "12351",
		name: "Chum",
		startingTier: "Bronze",
		tiers: {
			Bronze: { tooltips: ["Your Aquatic items have +4% Crit chance for the fight."] },
			Silver: { tooltips: ["Your Aquatic items have +6% Crit chance for the fight."] },
			Gold: { tooltips: ["Your Aquatic items have +8% Crit chance for the fight."] },
			Diamond: { tooltips: ["Your Aquatic items have +10% Crit chance for the fight."] },
			Legendary: { tooltips: [] },
		},
		tags: ["Aquatic"],
		hiddenTags: ["Crit"],
		size: "Small",
		heroes: ["Vanessa"],
		enchantments: [{ type: "Deadly", tooltips: ["Your items have +20% Crit Chance."] }],
		unifiedTooltips: ["Your Aquatic items have +(4/6/8/10)% Crit chance for the fight."],
		remarks: [],
		packId: "Vanessa_Core",
		combatEncounters: [],
	},
];
