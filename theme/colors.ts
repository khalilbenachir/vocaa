import type { ColorPalette } from "./types";

export const colors: ColorPalette = {
  background: "#FFFFFF",
  foreground: "#252525",

  card: "#FFFFFF",
  cardForeground: "#252525",

  popover: "#FFFFFF",
  popoverForeground: "#252525",

  primary: "#343434",
  primaryForeground: "#FBFBFB",

  secondary: "#F7F7F7",
  secondaryForeground: "#343434",

  muted: "#F7F7F7",
  mutedForeground: "#8E8E8E",

  accent: "#F7F7F7",
  accentForeground: "#343434",

  destructive: "#E74C3C",
  destructiveForeground: "#FFFFFF",

  border: "#EBEBEB",
  input: "#EBEBEB",
  ring: "#B5B5B5",

  chart1: "#343434",
  chart2: "#6B6B6B",
  chart3: "#8E8E8E",
  chart4: "#B5B5B5",
  chart5: "#D4D4D4",

  sidebar: "#FBFBFB",
  sidebarForeground: "#252525",
  sidebarPrimary: "#343434",
  sidebarPrimaryForeground: "#FBFBFB",
  sidebarAccent: "#F7F7F7",
  sidebarAccentForeground: "#343434",
  sidebarBorder: "#EBEBEB",
  sidebarRing: "#B5B5B5",
} as const;

export type ColorName = keyof typeof colors;
