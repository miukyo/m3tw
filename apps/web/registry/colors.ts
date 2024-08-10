import { argbFromHex, CorePalette, DynamicScheme, hexFromArgb, rgbaFromArgb, themeFromSourceColor } from "@material/material-color-utilities";

export const BASE_COLORS = [{ red: "#ef4444" }, { yellow: "#eab308" }, { green: "#22c55e" }, { blue: "#3b82f6" }, { purple: "#a855f7" }];
export type BaseColorKeys = keyof (typeof BASE_COLORS)[number];

export function getColors(color: BaseColorKeys, type: "rgb" | "hex" | "hsl") {
  const baseColor = BASE_COLORS.find((item) => color === Object.keys(item)[0]) as unknown as { [key in BaseColorKeys]: string };
  const colors = themeFromSourceColor(argbFromHex(baseColor[color]));
  Object.assign(colors.schemes.light, {
    "surface-dim": colors.palettes.neutral.tone(87),
    "surface-bright": colors.palettes.neutral.tone(98),
    "surface-container-lowest": colors.palettes.neutral.tone(100),
    "surface-container-low": colors.palettes.neutral.tone(96),
    "surface-container": colors.palettes.neutral.tone(94),
    "surface-container-high": colors.palettes.neutral.tone(92),
    "surface-container-highest": colors.palettes.neutral.tone(90),
    "surface-tint-color": colors.schemes.light.primary,
  });
  Object.assign(colors.schemes.dark, {
    "surface-dim": colors.palettes.neutral.tone(6),
    "surface-bright": colors.palettes.neutral.tone(24),
    "surface-container-lowest": colors.palettes.neutral.tone(4),
    "surface-container-low": colors.palettes.neutral.tone(10),
    "surface-container": colors.palettes.neutral.tone(12),
    "surface-container-high": colors.palettes.neutral.tone(17),
    "surface-container-highest": colors.palettes.neutral.tone(22),
    "surface-tint-color": colors.schemes.dark.primary,
  });
  let colorScheme = {} as { [x in "dark" | "light"]: { [x: string]: unknown } };
  Object.keys(colors.schemes).forEach((mode) => {
    const scheme = colors.schemes[mode as keyof typeof colors.schemes].toJSON();
    let newScheme: { [K in keyof typeof scheme]: unknown } = scheme;
    Object.keys(scheme).forEach((key) => {
      type schemeKey = keyof typeof scheme;
      const { r, g, b, a } = rgbaFromArgb(scheme[key as schemeKey]);
      if (type === "rgb") newScheme[key as schemeKey] = `${r}, ${g}, ${b}`;
      if (type === "hex") newScheme[key as schemeKey] = hexFromArgb(scheme[key as schemeKey]);
      if (type === "hsl") {
        const [h, s, l] = rgbToHsl(r, g, b);

        newScheme[key as schemeKey] = `${h}, ${s}%, ${l}%`;
      }
    });
    colorScheme[mode as "dark" | "light"] = newScheme;
  });
  return colorScheme;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h;
  if (d === 0) h = 0;
  else if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else if (max === b) h = (r - g) / d + 4;
  let l = (min + max) / 2;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  h = Math.round(h! * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}
