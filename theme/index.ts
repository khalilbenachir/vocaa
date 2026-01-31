import { colors } from "./colors";
import type { ColorName } from "./colors";
import { layout } from "./layout";
import { spacing } from "./spacing";
import type { Theme, TypographySize } from "./types";
import { typography } from "./typography";

export const theme: Theme = {
  colors,
  typography,
  spacing,
  layout,
};

export { colors } from "./colors";
export { layout } from "./layout";
export { spacing } from "./spacing";
export { typography } from "./typography";

export type { ColorName } from "./colors";
export type { ContainerKey } from "./layout";
export type { SpacingKey } from "./spacing";
export * from "./types";

export const createThemedStyles = <T extends Record<string, any>>(
  stylesFn: (theme: Theme) => T,
): T => {
  return stylesFn(theme);
};

export const getColor = (colorName: ColorName): string => {
  return colors[colorName];
};

export const getSpacing = (size: keyof typeof spacing): number => {
  return spacing[size];
};

export const getTypography = (
  size: keyof typeof typography.sizes,
): TypographySize => {
  return typography.sizes[size];
};

export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default theme;
