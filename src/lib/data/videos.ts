export type VideoProduct = {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // URL or path to video file
  thumbnailUrl: string; // image preview
  originalPrice: number;
  salePrice: number;
  order: number; // sorting order
};

export const initialVideos: VideoProduct[] = [];
