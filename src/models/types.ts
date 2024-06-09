export type EntityInitializer<T extends { id: number }> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;
