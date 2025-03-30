// Theme configuration
const themes = {
    light: {
        '--bg-primary': '#f8f9fa',
        '--bg-secondary': '#ffffff',
        '--text-primary': '#1a1a1a',
        '--text-secondary': '#6c757d',
        '--border-color': '#e0e0e0',
        '--accent-color': '#007bff',
        '--hover-color': '#f0f0f0',
        '--card-bg': '#ffffff',
        '--shadow-color': 'rgba(0,0,0,0.05)',
        '--code-bg': '#f8f9fa',
        '--success-color': '#28a745',
        '--danger-color': '#dc3545',
        '--warning-color': '#ffc107',
        '--info-color': '#17a2b8'
    },
    dark: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#2d2d2d',
        '--text-primary': '#ffffff',
        '--text-secondary': '#b0b0b0',
        '--border-color': '#404040',
        '--accent-color': '#3b82f6',
        '--hover-color': '#333333',
        '--card-bg': '#2d2d2d',
        '--shadow-color': 'rgba(0,0,0,0.2)',
        '--code-bg': '#333333',
        '--success-color': '#2ea043',
        '--danger-color': '#f85149',
        '--warning-color': '#d29922',
        '--info-color': '#58a6ff'
    }
};

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply theme on load
        this.applyTheme(this.theme);
        
        // Update toggle button
        this.updateToggleButton();
        
        // Add event listener to theme toggle buttons
        document.querySelectorAll('.theme-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
    }

    applyTheme(themeName) {
        // Apply theme variables to root
        const root = document.documentElement;
        const themeVars = themes[themeName];
        
        for (const [property, value] of Object.entries(themeVars)) {
            root.style.setProperty(property, value);
        }
        
        // Update body class
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${themeName}`);
        
        // Store theme preference
        localStorage.setItem('theme', themeName);
        this.theme = themeName;
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleButton();
        
        // Animate the transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateToggleButton() {
        // Update icon in toggle button
        document.querySelectorAll('.theme-toggle i').forEach(icon => {
            icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
}); 