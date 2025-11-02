export type Pin = {
  id: number;
  title: string;
  category: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
  userId?: string | null;
};
