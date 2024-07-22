export const framework = [
  {
    name: "react",
    label: "React",
  },
  {
    name: "vue",
    label: "Vue",
  },
  {
    name: "svelte",
    label: "Svelte",
  },
] as const;

export type Framework = (typeof framework)[number];
