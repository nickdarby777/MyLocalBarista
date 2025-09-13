/* 
===========================================
CUSTOMIZATION PANEL FUNCTIONALITY
===========================================

This file handles all the live customization features:
- Color picker controls and live updates
- Roundedness slider functionality
- Theme switching between the three variations
- Preset color scheme application
- Panel open/close interactions
- CSS variable manipulation for real-time updates

FEATURES:
- Live preview of all changes
- Smooth transitions between themes
- Persistent panel state
- Responsive behavior
- Accessibility support
*/

/* ===========================================
   CUSTOMIZATION CONTROLLER CLASS
   =========================================== */

class CustomizationController {
    constructor() {
        // DOM elements
        this.panel = document.getElementById('customization-panel');
        this.openBtn = document.getElementById('panel-open-btn');
        this.closeBtn = document.getElementById('panel-toggle');
        this.mainContent = document.querySelector('.main-content');
        
        // Control elements
        this.themeSelector = document.getElementById('theme-selector');
        this.primaryColorPicker = document.getElementById('primary-color');
        this.secondaryColorPicker = document.getElementById('secondary-color');
        this.accentColorPicker = document.getElementById('accent-color');
        this.roundnessSlider = document.getElementById('roundedness-slider');
        
        // Value display elements
        this.colorValues = document.querySelectorAll('.color-value');
        this.sliderValue = document.querySelector('.slider-value');
        
        // Preset buttons
        this.presetButtons = document.querySelectorAll('.preset-btn');
        
        // Current theme tracking
        this.currentTheme = 'classic';
        this.isOpen = false;
        
        // Initialize the controller
        this.init();
    }
    
    /* ===========================================
       INITIALIZATION
       =========================================== */
    
    init() {
        console.log('🎨 Initializing Customization Controller...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize control values
        this.initializeControls();
        
        // Update display values
        this.updateDisplayValues();
        
        console.log('✅ Customization Controller initialized successfully');
    }
    
    /* ===========================================
       EVENT LISTENERS SETUP
       =========================================== */
    
    setupEventListeners() {
        // Panel toggle buttons
        this.openBtn?.addEventListener('click', () => this.openPanel());
        this.closeBtn?.addEventListener('click', () => this.closePanel());
        
        // Theme selector
        this.themeSelector?.addEventListener('change', (e) => this.switchTheme(e.target.value));
        
        // Color picker controls
        this.primaryColorPicker?.addEventListener('input', (e) => this.updatePrimaryColor(e.target.value));
        this.secondaryColorPicker?.addEventListener('input', (e) => this.updateSecondaryColor(e.target.value));
        this.accentColorPicker?.addEventListener('input', (e) => this.updateAccentColor(e.target.value));
        
        // Roundedness slider
        this.roundnessSlider?.addEventListener('input', (e) => this.updateRoundedness(e.target.value));
        
        // Preset color scheme buttons
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
        });
        
        // Keyboard accessibility for panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
        
        // Close panel when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (this.isOpen && window.innerWidth <= 1024) {
                if (!this.panel.contains(e.target) && !this.openBtn.contains(e.target)) {
                    this.closePanel();
                }
            }
        });
    }
    
    /* ===========================================
       CONTROL INITIALIZATION
       =========================================== */
    
    initializeControls() {
        // Get current CSS variable values
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        // Initialize color pickers with current values
        if (this.primaryColorPicker) {
            this.primaryColorPicker.value = this.hexToColor(computedStyle.getPropertyValue('--primary-color').trim());
        }
        
        if (this.secondaryColorPicker) {
            this.secondaryColorPicker.value = this.hexToColor(computedStyle.getPropertyValue('--secondary-color').trim());
        }
        
        if (this.accentColorPicker) {
            this.accentColorPicker.value = this.hexToColor(computedStyle.getPropertyValue('--accent-color').trim());
        }
        
        // Initialize roundedness slider
        if (this.roundnessSlider) {
            const currentRoundness = parseInt(computedStyle.getPropertyValue('--border-radius-base').trim());
            this.roundnessSlider.value = currentRoundness || 8;
        }
        
        console.log('🔧 Controls initialized with current CSS values');
    }
    
    /* ===========================================
       PANEL CONTROLS
       =========================================== */
    
    openPanel() {
        if (!this.panel) return;
        
        this.panel.classList.add('open');
        this.mainContent?.classList.add('panel-open');
        this.openBtn?.classList.add('hidden');
        this.isOpen = true;
        
        // Focus on first interactive element for accessibility
        const firstControl = this.panel.querySelector('select, input, button');
        if (firstControl) {
            setTimeout(() => firstControl.focus(), 300);
        }
        
        console.log('📱 Customization panel opened');
    }
    
    closePanel() {
        if (!this.panel) return;
        
        this.panel.classList.remove('open');
        this.mainContent?.classList.remove('panel-open');
        this.openBtn?.classList.remove('hidden');
        this.isOpen = false;
        
        // Return focus to open button for accessibility
        setTimeout(() => this.openBtn?.focus(), 300);
        
        console.log('📱 Customization panel closed');
    }
    
    /* ===========================================
       THEME SWITCHING
       =========================================== */
    
    switchTheme(newTheme) {
        if (!newTheme || newTheme === this.currentTheme) return;
        
        console.log(`🎭 Switching theme from ${this.currentTheme} to ${newTheme}`);
        
        // Get the current theme link element
        const currentThemeLink = document.getElementById('style-theme');
        if (!currentThemeLink) return;
        
        // Create new theme link element
        const newThemeLink = document.createElement('link');
        newThemeLink.rel = 'stylesheet';
        newThemeLink.href = `css/style-${newTheme}.css`;
        newThemeLink.id = 'style-theme';
        
        // Add fade transition class
        document.body.classList.add('theme-transitioning');
        
        // Replace the theme stylesheet
        currentThemeLink.parentNode.insertBefore(newThemeLink, currentThemeLink.nextSibling);
        
        // Wait for new theme to load, then remove old theme
        newThemeLink.onload = () => {
            currentThemeLink.remove();
            this.currentTheme = newTheme;
            
            // Remove transition class after a short delay
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);
            
            console.log(`✅ Theme switched to ${newTheme}`);
        };
        
        // Handle load errors
        newThemeLink.onerror = () => {
            console.error(`❌ Failed to load theme: ${newTheme}`);
            newThemeLink.remove();
            document.body.classList.remove('theme-transitioning');
        };
    }
    
    /* ===========================================
       COLOR UPDATES
       =========================================== */
    
    updatePrimaryColor(color) {
        this.updateCSSVariable('--primary-color', color);
        this.updateColorDisplay(this.primaryColorPicker, color);
        console.log(`🎨 Primary color updated to: ${color}`);
    }
    
    updateSecondaryColor(color) {
        this.updateCSSVariable('--secondary-color', color);
        this.updateColorDisplay(this.secondaryColorPicker, color);
        console.log(`🎨 Secondary color updated to: ${color}`);
    }
    
    updateAccentColor(color) {
        this.updateCSSVariable('--accent-color', color);
        this.updateColorDisplay(this.accentColorPicker, color);
        console.log(`🎨 Accent color updated to: ${color}`);
    }
    
    /* ===========================================
       ROUNDEDNESS UPDATES
       =========================================== */
    
    updateRoundedness(value) {
        const roundnessValue = `${value}px`;
        this.updateCSSVariable('--border-radius-base', roundnessValue);
        
        if (this.sliderValue) {
            this.sliderValue.textContent = roundnessValue;
        }
        
        console.log(`📐 Roundedness updated to: ${roundnessValue}`);
    }
    
    /* ===========================================
       PRESET COLOR SCHEMES
       =========================================== */
    
    applyPreset(presetName) {
        console.log(`🎯 Applying preset: ${presetName}`);
        
        const presets = {
            coffee: {
                primary: '#8B4513',
                secondary: '#D2691E',
                accent: '#F4E4C1'
            },
            modern: {
                primary: '#3B82F6',
                secondary: '#10B981',
                accent: '#F3F4F6'
            },
            earthy: {
                primary: '#059669',
                secondary: '#84CC16',
                accent: '#ECFDF5'
            },
            luxe: {
                primary: '#D97706',
                secondary: '#F59E0B',
                accent: '#FEF3C7'
            }
        };
        
        const preset = presets[presetName];
        if (!preset) {
            console.error(`❌ Unknown preset: ${presetName}`);
            return;
        }
        
        // Apply all colors from the preset
        this.updatePrimaryColor(preset.primary);
        this.updateSecondaryColor(preset.secondary);
        this.updateAccentColor(preset.accent);
        
        // Update the color picker values
        if (this.primaryColorPicker) this.primaryColorPicker.value = preset.primary;
        if (this.secondaryColorPicker) this.secondaryColorPicker.value = preset.secondary;
        if (this.accentColorPicker) this.accentColorPicker.value = preset.accent;
        
        // Update display values
        this.updateDisplayValues();
        
        // Add visual feedback
        const presetBtn = document.querySelector(`[data-preset="${presetName}"]`);
        if (presetBtn) {
            presetBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                presetBtn.style.transform = '';
            }, 150);
        }
        
        console.log(`✅ Preset ${presetName} applied successfully`);
    }
    
    /* ===========================================
       UTILITY METHODS
       =========================================== */
    
    updateCSSVariable(variableName, value) {
        document.documentElement.style.setProperty(variableName, value);
    }
    
    updateColorDisplay(picker, color) {
        if (!picker) return;
        
        // Find the associated color value display
        const controlGroup = picker.closest('.color-control');
        if (controlGroup) {
            const colorValueSpan = controlGroup.querySelector('.color-value');
            if (colorValueSpan) {
                colorValueSpan.textContent = color.toUpperCase();
            }
        }
    }
    
    updateDisplayValues() {
        // Update all color value displays
        if (this.primaryColorPicker) {
            this.updateColorDisplay(this.primaryColorPicker, this.primaryColorPicker.value);
        }
        if (this.secondaryColorPicker) {
            this.updateColorDisplay(this.secondaryColorPicker, this.secondaryColorPicker.value);
        }
        if (this.accentColorPicker) {
            this.updateColorDisplay(this.accentColorPicker, this.accentColorPicker.value);
        }
        
        // Update roundedness value display
        if (this.roundnessSlider && this.sliderValue) {
            this.sliderValue.textContent = `${this.roundnessSlider.value}px`;
        }
    }
    
    hexToColor(hex) {
        // Ensure hex color starts with #
        if (hex && !hex.startsWith('#')) {
            hex = '#' + hex;
        }
        return hex || '#000000';
    }
    
    /* ===========================================
       PUBLIC API METHODS
       =========================================== */
    
    // Method to get current color scheme
    getCurrentColors() {
        return {
            primary: this.primaryColorPicker?.value,
            secondary: this.secondaryColorPicker?.value,
            accent: this.accentColorPicker?.value,
            roundedness: this.roundnessSlider?.value
        };
    }
    
    // Method to set colors programmatically
    setColors(colors) {
        if (colors.primary) this.updatePrimaryColor(colors.primary);
        if (colors.secondary) this.updateSecondaryColor(colors.secondary);
        if (colors.accent) this.updateAccentColor(colors.accent);
        if (colors.roundedness) this.updateRoundedness(colors.roundedness);
        
        // Update picker values
        if (colors.primary && this.primaryColorPicker) this.primaryColorPicker.value = colors.primary;
        if (colors.secondary && this.secondaryColorPicker) this.secondaryColorPicker.value = colors.secondary;
        if (colors.accent && this.accentColorPicker) this.accentColorPicker.value = colors.accent;
        if (colors.roundedness && this.roundnessSlider) this.roundnessSlider.value = colors.roundedness;
        
        this.updateDisplayValues();
    }
}

/* ===========================================
   THEME TRANSITION STYLES
   =========================================== */

// Add CSS for smooth theme transitions
const themeTransitionStyles = document.createElement('style');
themeTransitionStyles.textContent = `
    /* Smooth theme transition effect */
    .theme-transitioning * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
    
    .theme-transitioning .hero-section,
    .theme-transitioning .services-section,
    .theme-transitioning .waitlist-section,
    .theme-transitioning .footer {
        transition: background 0.5s ease !important;
    }
`;
document.head.appendChild(themeTransitionStyles);

/* ===========================================
   GLOBAL INITIALIZATION
   =========================================== */

// Initialize the customization controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing customization system...');
    
    // Create global customization controller instance
    window.customizationController = new CustomizationController();
    
    // Log success message
    console.log('✨ MyLocalBarista Customization System Ready!');
    console.log('🎨 Features available:');
    console.log('   • Live color customization');
    console.log('   • Dynamic roundedness adjustment');
    console.log('   • Three beautiful theme variations');
    console.log('   • Quick preset color schemes');
});

/* ===========================================
   EXPORT FOR MODULE USAGE (if needed)
   =========================================== */

// Export the class for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomizationController;
}