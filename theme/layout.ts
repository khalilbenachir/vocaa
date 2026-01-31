import type { Layout } from './types';

export const layout: Layout = {
  radius: 10,

  containers: {
    md: 448,
    lg: 512,
    xl: 576,
    '2xl': 672,
    '3xl': 768,
    '4xl': 896,
    '5xl': 1024,
    '6xl': 1152,
    '7xl': 1280,
  },
} as const;

export type ContainerKey = keyof typeof layout.containers;
