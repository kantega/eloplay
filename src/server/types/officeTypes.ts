export const offices = {
  All: "All",
  Oslo: "Oslo",
  Trondheim: "Trondheim",
  Bergen: "Bergen",
} as const;

export type Office = keyof typeof offices | "";
