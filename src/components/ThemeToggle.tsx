import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useTheme } from "../lib/theme-provider";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle component for switching between light, dark, and system themes
 * Shows an icon button that changes based on the current theme
 *
 * @returns {JSX.Element} Theme toggle button
 */
export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid rendering the wrong icon during server-side rendering
	// or before the component is mounted
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	/**
	 * Toggle between light and dark theme
	 */
	const toggleTheme = () => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			title={theme === "dark" ? "Açık Moda Geç" : "Koyu Moda Geç"}
			className="rounded-full"
		>
			{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
			<span className="sr-only">{theme === "dark" ? "Açık Moda Geç" : "Koyu Moda Geç"}</span>
		</Button>
	);
}
