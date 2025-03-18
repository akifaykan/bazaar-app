import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BazaarItem } from "../types";

/**
 * Props for the ItemCard component
 */
type ItemCardProps = {
	/** The item to display */
	item: BazaarItem;
	/** Optional click handler for the card */
	onClick?: () => void;
};

/**
 * Card component that displays basic information about a Bazaar item
 * Shows name, tags, size, tier, and hero information
 */
export function ItemCard({ item, onClick }: ItemCardProps) {
	const { name, size, tags, heroes, startingTier } = item;

	return (
		<Card className="h-full transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
			<CardHeader className="p-4 pb-2">
				<CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
				<div className="flex flex-wrap gap-1 mt-1">
					{tags.map((tag) => (
						<Badge key={tag} variant="secondary" className="font-normal text-xs">
							{tag}
						</Badge>
					))}
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-2 space-y-2">
				<div className="flex justify-between items-center text-sm text-muted-foreground">
					<span className="font-medium">Boyut:</span>
					<span>{size}</span>
				</div>

				<div className="flex justify-between items-center text-sm text-muted-foreground">
					<span className="font-medium">Seviye:</span>
					<span>{startingTier}</span>
				</div>

				<div className="text-sm text-muted-foreground">
					<span className="font-medium">Kahramanlar:</span>
					<div className="flex flex-wrap gap-1 mt-1">
						{heroes.map((hero) => (
							<Badge key={hero} variant="outline" className="font-normal text-xs">
								{hero}
							</Badge>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
