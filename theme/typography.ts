import { Platform } from 'react-native';
import type { Typography } from './types';

const getFontFamily = (type: 'sans' | 'mono'): string => {
  if (type === 'sans') {
    if (Platform.OS === 'ios') {
      return 'System';
    } else if (Platform.OS === 'android') {
      return 'Roboto';
    } else {

      return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    }
  } else {

    if (Platform.OS === 'ios') {
      return 'Menlo';
    } else if (Platform.OS === 'android') {
      return 'monospace';
    } else {

      return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    }
  }
};

export const typography: Typography = {
  sizes: {
    xs: { fontSize: 12, lineHeight: 16 },
    sm: { fontSize: 14, lineHeight: 20 },
    base: { fontSize: 16, lineHeight: 24 },
    lg: { fontSize: 18, lineHeight: 28 },
    xl: { fontSize: 20, lineHeight: 28 },
    '2xl': { fontSize: 24, lineHeight: 32 },
    '3xl': { fontSize: 30, lineHeight: 36 },
    '4xl': { fontSize: 36, lineHeight: 40 },
    '5xl': { fontSize: 48, lineHeight: 48 },
    '6xl': { fontSize: 60, lineHeight: 60 },
    '7xl': { fontSize: 72, lineHeight: 72 },
    '8xl': { fontSize: 96, lineHeight: 96 },
    '9xl': { fontSize: 128, lineHeight: 128 },
  },

  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
  },

  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },

  fontFamilies: {
    sans: getFontFamily('sans'),
    mono: getFontFamily('mono'),
  },
} as const;
