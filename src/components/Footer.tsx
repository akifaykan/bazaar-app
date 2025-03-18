export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-primary-foreground/5 border-t mt-auto">
			<div className="container mx-auto max-w-6xl py-6">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<div className="text-center sm:text-left">
						<p className="text-sm text-muted-foreground">
							&copy; {currentYear} KryexThemes. Tüm hakları saklıdır.
						</p>
					</div>
					<div className="flex items-center gap-4">
						<a
							href="#"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Gizlilik Politikası
						</a>
						<a
							href="#"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Kullanım Şartları
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
