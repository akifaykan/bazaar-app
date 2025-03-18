// Type definitions for The Bazaar API

/**
 * Represents a tooltip text for an item
 */
export type Tooltip = string;

/**
 * Represents a tier level with its tooltips
 */
export type Tier = {
	tooltips: Tooltip[];
};

/**
 * All possible tier levels for items
 */
export type Tiers = {
	Bronze: Tier;
	Silver: Tier;
	Gold: Tier;
	Diamond: Tier;
	Legendary: Tier;
};

/**
 * Represents an enchantment that can be applied to an item
 */
export type Enchantment = {
	type: string;
	tooltips: Tooltip[];
};

/**
 * Represents a combat encounter where an item can be found
 */
export type CombatEncounter = {
	cardId: string;
	cardName: string;
};

/**
 * Represents a complete item in The Bazaar
 */
export type BazaarItem = {
	/** Unique identifier for the item */
	id: string;
	/** Display name of the item */
	name: string;
	/** The tier at which this item first becomes available */
	startingTier: string;
	/** Item properties for each tier level */
	tiers: Tiers;
	/** Visible categories this item belongs to */
	tags: string[];
	/** Hidden categories this item belongs to (internal) */
	hiddenTags: string[];
	/** Physical size of the item (Small, Medium, Large) */
	size: string;
	/** Heroes that can use this item */
	heroes: string[];
	/** Possible enchantments for this item */
	enchantments: Enchantment[];
	/** Simplified tooltips across all tiers */
	unifiedTooltips: Tooltip[];
	/** Additional notes about the item */
	remarks: string[];
	/** The pack this item belongs to */
	packId: string;
	/** Encounters where this item can be found */
	combatEncounters: CombatEncounter[];
};

/**
 * API response structure
 */
export type ApiResponse = {
	/** Array of all items */
	data: BazaarItem[];
	/** API version identifier */
	version: string;
};
