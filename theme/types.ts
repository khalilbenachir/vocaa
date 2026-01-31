
export interface ColorPalette {

  background: string;
  foreground: string;


  card: string;
  cardForeground: string;


  popover: string;
  popoverForeground: string;


  primary: string;
  primaryForeground: string;


  secondary: string;
  secondaryForeground: string;


  muted: string;
  mutedForeground: string;


  accent: string;
  accentForeground: string;


  destructive: string;
  destructiveForeground: string;


  border: string;
  input: string;
  ring: string;


  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;


  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface TypographySize {
  fontSize: number;
  lineHeight: number;
}

export interface Typography {
  sizes: {
    xs: TypographySize;
    sm: TypographySize;
    base: TypographySize;
    lg: TypographySize;
    xl: TypographySize;
    '2xl': TypographySize;
    '3xl': TypographySize;
    '4xl': TypographySize;
    '5xl': TypographySize;
    '6xl': TypographySize;
    '7xl': TypographySize;
    '8xl': TypographySize;
    '9xl': TypographySize;
  };
  weights: {
    normal: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
    extrabold: '800';
  };
  letterSpacing: {
    tighter: number;
    tight: number;
    normal: number;
  };
  lineHeights: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
  };
  fontFamilies: {
    sans: string;
    mono: string;
  };
}

export interface Spacing {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  8: number;
  10: number;
  12: number;
  16: number;
  20: number;
  24: number;
  32: number;
  40: number;
  48: number;
  56: number;
  64: number;
}

export interface Layout {
  radius: number;
  containers: {
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
    '7xl': number;
  };
}

export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  layout: Layout;
}
