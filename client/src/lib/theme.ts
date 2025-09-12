// client/src/lib/theme.ts
export type ThemeMode = 'light' | 'dark' | 'custom';

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;

  // Use the attribute as the single source of truth
  root.setAttribute('data-theme', mode);

  // Ensure no stray Tailwind dark class survives (we won't use it)
  root.classList.remove('dark');
}
