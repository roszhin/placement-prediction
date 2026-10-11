/*!
 * Theme Toggle Script
 * Handles switching between Light, Dark, and System Default modes.
 */

const THEME_STORAGE_KEY = 'skill-theme';

const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }
    updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
    const iconEl = document.getElementById('theme-icon');
    if (!iconEl) return;
    
    iconEl.className = '';
    if (theme === 'light') {
        iconEl.className = 'fa-solid fa-sun';
    } else if (theme === 'dark') {
        iconEl.className = 'fa-solid fa-moon';
    } else {
        iconEl.className = 'fa-solid fa-circle-half-stroke';
    }
};

const changeTheme = (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    setTheme(theme);
};

// Initialize theme immediately to prevent FOUC
setTheme(getPreferredTheme());

// Listen for system changes if set to auto
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme('auto');
    }
});
