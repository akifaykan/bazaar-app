import { BazaarItem } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

/**
 * Props for the ItemModal component
 */
type ItemModalProps = {
	/** The item to display details for */
	item: BazaarItem | null;
	/** Whether the modal is currently open */
	open: boolean;
	/** Function to call when the modal should be closed */
	onClose: () => void;
};

/**
 * Modal component that displays detailed information about a Bazaar item
 * Shows name, tags, size, heroes, tiers, enchantments, and other item details
 */
export function ItemModal({ item, open, onClose }: ItemModalProps) {
	if (!item) return null;

	const {
		name,
		size,
		tags,
		heroes,
		tiers,
		enchantments,
		unifiedTooltips,
		remarks,
	} = item;

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">{name}</DialogTitle>
					<div className="flex flex-wrap gap-1 mt-2">
						{tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
				</DialogHeader>

				<div className="space-y-4 mt-2">
					{/* Top section with basic info and tiers side by side */}
					<div className="grid grid-cols-4 gap-4">
						{/* Left column: Basic information */}
						<div className="space-y-3">
							<div>
								<h4 className="font-medium text-sm text-muted-foreground">Boyut</h4>
								<p>{size}</p>
							</div>
							<div>
								<h4 className="font-medium text-sm text-muted-foreground">Kahramanlar</h4>
								<div className="flex flex-wrap gap-1 mt-1">
									{heroes.map((hero) => (
										<Badge key={hero} variant="outline" className="text-xs">
											{hero}
										</Badge>
									))}
								</div>
							</div>
						</div>

						{/* Right columns: Tiers section */}
						{Object.entries(tiers).filter(([_, tier]) => tier.tooltips.length > 0).length > 0 && (
							<div className="col-span-3">
								<h3 className="font-semibold mb-2">Seviyeler</h3>
								<div className="grid grid-cols-2 gap-3">
									{Object.entries(tiers)
										.filter(([_, tier]) => tier.tooltips.length > 0)
										.map(([tierName, tier]) => (
											<div key={tierName} className="border rounded-md p-2 bg-secondary/10">
												<h4 className="font-medium">{tierName}</h4>
												<ul className="list-disc list-inside text-sm mt-1 space-y-1">
													{tier.tooltips.map((tooltip, idx) => (
														<li key={idx} className="text-muted-foreground">
															{tooltip}
														</li>
													))}
												</ul>
											</div>
										))}
								</div>
							</div>
						)}
					</div>

					<Separator />

					{/* Unified tooltips (if present) */}
					{unifiedTooltips && unifiedTooltips.length > 0 && (
						<div>
							<h3 className="font-semibold mb-2">Özellikler</h3>
							<ul className="list-disc list-inside text-sm space-y-1">
								{unifiedTooltips.map((tooltip, idx) => (
									<li key={idx} className="text-muted-foreground">
										{tooltip}
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Enchantments section (if present) */}
					{enchantments && 
						enchantments.filter(enchantment => enchantment.tooltips.length > 0).length > 0 && (
						<>
							<Separator />
							<div>
								<h3 className="font-semibold mb-2">Büyüler</h3>
								<div className="grid grid-cols-3 gap-3">
									{enchantments
										.filter(enchantment => enchantment.tooltips.length > 0)
										.map((enchantment, idx) => (
										<div key={idx} className="border rounded-md p-2 bg-primary/5">
											<h4 className="font-medium">{enchantment.type}</h4>
											<ul className="list-disc list-inside text-sm mt-1 space-y-1">
												{enchantment.tooltips.map((tooltip, tooltipIdx) => (
													<li
														key={tooltipIdx}
														className="text-muted-foreground"
													>
														{tooltip}
													</li>
												))}
											</ul>
										</div>
									))}
								</div>
							</div>
						</>
					)}

					{/* Remarks (if present) */}
					{remarks && remarks.length > 0 && (
						<>
							<Separator />
							<div>
								<h3 className="font-semibold mb-2">Notlar</h3>
								<p className="text-sm text-muted-foreground">{remarks}</p>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
