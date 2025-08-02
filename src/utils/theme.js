// Enhanced theme system for better UI/UX
export const lightTheme = {
  colors: {
    // Primary colors
    primary: '#007AFF',
    primaryLight: '#4DA2FF',
    primaryDark: '#0056CC',
    secondary: '#8E8E93',
    
    // Status colors
    todo: '#FF9500',
    inprogress: '#007AFF',
    done: '#34C759',
    
    // Priority colors
    high: '#FF3B30',
    medium: '#FF9500',
    low: '#34C759',
    
    // Background colors
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceSecondary: '#F9F9F9',
    
    // Text colors
    text: {
      primary: '#000000',
      secondary: '#6D6D70',
      tertiary: '#8E8E93',
    },
    
    // Border colors
    border: '#E5E5EA',
    borderLight: '#F2F2F7',
    
    // Status indicators
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.3)',
    modalBackground: 'rgba(0, 0, 0, 0.5)',
  },
  
  spacing: {
    xs: 6,   // Increased from 4 for better iPhone 11 touch targets
    sm: 10,  // Increased from 8 for better spacing
    md: 18,  // Increased from 16 for iPhone 11 screen
    lg: 28,  // Increased from 24 for better proportions
    xl: 36,  // Increased from 32 for iPhone 11
    xxl: 52, // Increased from 48 for larger sections
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  typography: {
    sizes: {
      h1: 32,
      h2: 24,
      h3: 20,
      body: 16,
      small: 14,
      caption: 12,
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03, // Reduced opacity to prevent layering
      shadowRadius: 1,     // Reduced radius
      elevation: 1,        // Reduced elevation
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, // Reduced opacity
      shadowRadius: 2,     // Reduced radius
      elevation: 2,        // Reduced elevation
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08, // Reduced opacity
      shadowRadius: 3,     // Reduced radius
      elevation: 3,        // Reduced elevation
    },
  },
};

export const darkTheme = {
  colors: {
    // Primary colors
    primary: '#0A84FF',
    primaryLight: '#409CFF',
    primaryDark: '#0056CC',
    secondary: '#98989D',
    
    // Status colors
    todo: '#FF9F0A',
    inprogress: '#0A84FF',
    done: '#30D158',
    
    // Priority colors
    high: '#FF453A',
    medium: '#FF9F0A',
    low: '#30D158',
    
    // Background colors
    background: '#000000',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#98989D',
      tertiary: '#636366',
    },
    
    // Border colors
    border: '#38383A',
    borderLight: '#48484A',
    
    // Status indicators
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',
    modalBackground: 'rgba(0, 0, 0, 0.8)',
  },
  
  ...lightTheme.spacing,
  ...lightTheme.borderRadius,
  ...lightTheme.typography,
  ...lightTheme.shadows,
};

export const getTheme = (isDark = false) => isDark ? darkTheme : lightTheme;
