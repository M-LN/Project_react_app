import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Mobile breakpoints
export const BREAKPOINTS = {
  SMALL_PHONE: 320,  // iPhone SE
  PHONE: 375,        // iPhone 6/7/8
  IPHONE_11: 414,    // iPhone 11/XR
  LARGE_PHONE: 428,  // iPhone 12/13/14 Pro Max
  TABLET: 768,
};

// Check device type
export const isSmallPhone = width <= BREAKPOINTS.SMALL_PHONE;
export const isPhone = width <= BREAKPOINTS.PHONE;
export const isIPhone11 = width === BREAKPOINTS.IPHONE_11;
export const isLargePhone = width <= BREAKPOINTS.LARGE_PHONE;
export const isTablet = width >= BREAKPOINTS.TABLET;

// Responsive dimensions
export const getResponsiveDimensions = () => {
  const isLandscape = width > height;
  
  return {
    // Column widths optimized for iPhone 11 (414px width)
    columnWidth: isSmallPhone 
      ? width * 0.85  // iPhone SE: ~272px
      : isPhone 
        ? width * 0.80  // iPhone 6/7/8: ~300px
        : isIPhone11
          ? width * 0.82  // iPhone 11: ~340px (optimized for 414px)
          : width * 0.78, // Larger phones: ~334px
    
    // Column heights optimized for iPhone 11 (896px height) with new tab bar spacing
    minColumnHeight: isSmallPhone 
      ? height * 0.40  // iPhone SE: shorter screen, account for higher tab bar
      : isPhone 
        ? height * 0.45  // iPhone 6/7/8: account for higher tab bar
        : isIPhone11
          ? height * 0.52  // iPhone 11: ~465px (optimized for 896px with higher tab bar)
          : height * 0.48, // Other phones: account for higher tab bar
    
    maxColumnHeight: isLandscape 
      ? height * 0.80  // Landscape mode: account for higher tab bar
      : isIPhone11
        ? height * 0.62  // iPhone 11: ~554px (optimized with tab bar spacing)
        : height * 0.58, // Other phones: account for higher tab bar
    
    // Column margins optimized for iPhone 11
    columnMargin: isSmallPhone ? 6 : isIPhone11 ? 10 : 8,
    
    // Header heights optimized for iPhone 11
    headerHeight: isSmallPhone ? 45 : isIPhone11 ? 55 : 50,
    
    // Font sizes optimized for iPhone 11's resolution
    headerFontSize: isSmallPhone ? 14 : isIPhone11 ? 18 : 16,
    titleFontSize: isSmallPhone ? 13 : isIPhone11 ? 15 : 14,
    bodyFontSize: isSmallPhone ? 11 : isIPhone11 ? 13 : 12,
    
    // Card dimensions optimized for iPhone 11
    cardPadding: isSmallPhone ? 8 : isIPhone11 ? 14 : 12,
    cardMargin: isSmallPhone ? 3 : isIPhone11 ? 5 : 4,
    cardMinHeight: isSmallPhone ? 70 : isIPhone11 ? 90 : 80,
    
    // Spacing optimized for iPhone 11
    spacing: {
      xs: isSmallPhone ? 2 : isIPhone11 ? 5 : 4,
      sm: isSmallPhone ? 4 : isIPhone11 ? 10 : 8,
      md: isSmallPhone ? 8 : isIPhone11 ? 14 : 12,
      lg: isSmallPhone ? 12 : isIPhone11 ? 18 : 16,
      xl: isSmallPhone ? 16 : isIPhone11 ? 26 : 24,
    },
    
    // Icon sizes optimized for iPhone 11
    iconSizes: {
      xs: isSmallPhone ? 12 : isIPhone11 ? 15 : 14,
      sm: isSmallPhone ? 16 : isIPhone11 ? 20 : 18,
      md: isSmallPhone ? 20 : isIPhone11 ? 26 : 24,
      lg: isSmallPhone ? 24 : isIPhone11 ? 30 : 28,
      xl: isSmallPhone ? 28 : isIPhone11 ? 36 : 32,
    },
  };
};

// Platform-specific styles
export const getPlatformStyles = () => {
  const dimensions = getResponsiveDimensions();
  
  return {
    // iOS specific adjustments
    ...(Platform.OS === 'ios' && {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
    
    // Android specific adjustments
    ...(Platform.OS === 'android' && {
      elevation: 3,
    }),
    
    // Responsive dimensions
    ...dimensions,
  };
};
