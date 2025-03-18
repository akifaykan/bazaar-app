import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

/**
 * Theme context for managing dark/light mode
 */
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

/**
 * Theme Provider component for managing theme across the application
 * Handles theme changes and synchronizes with system preference and localStorage
 *
 * @param {ThemeProviderProps} props - Provider props including children, defaultTheme, and storageKey
 */
export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
	...props
}: ThemeProviderProps) {
	// Get initial theme from localStorage or use default
	const [theme, setTheme] = useState<Theme>(() => {
		// Try to get theme from localStorage
		const storedTheme = localStorage.getItem(storageKey);
		if (storedTheme) {
			return storedTheme as Theme;
		}

		// If no theme in localStorage, use system preference
		if (defaultTheme === "system") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		}

		return defaultTheme;
	});

	/**
	 * Update theme in localStorage and HTML element
	 */
	useEffect(() => {
		const root = window.document.documentElement;

		// Remove previous theme classes
		root.classList.remove("light", "dark");

		// Set theme class based on current theme or system preference
		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	/**
	 * Store theme in localStorage
	 */
	useEffect(() => {
		localStorage.setItem(storageKey, theme);
	}, [theme, storageKey]);

	/**
	 * Listen for system theme changes
	 */
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		// Update theme when system preference changes
		const handleChange = () => {
			if (theme === "system") {
				document.documentElement.classList.remove("light", "dark");
				document.documentElement.classList.add(mediaQuery.matches ? "dark" : "light");
			}
		};

		// Add event listener for system preference changes
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [theme]);

	// Create context value
	const value = {
		theme,
		setTheme: (newTheme: Theme) => {
			setTheme(newTheme);
		},
	};

	return (
		<ThemeProviderContext.Provider value={value} {...props}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

/**
 * Custom hook to use theme context
 * @returns {ThemeProviderState} Theme context state
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme(): ThemeProviderState {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}
