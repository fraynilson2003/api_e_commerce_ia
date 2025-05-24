export type TypeImageQuality =
  | 'q_auto'
  | 'q_auto:best'
  | 'q_auto:good'
  | 'q_auto:eco'
  | 'q_auto:low';

export type TypeImageCloudinary = 'f_jpg' | 'f_avif' | 'f_webp';

type Props = {
  url: string;
  quality?: TypeImageQuality;
  type?: TypeImageCloudinary;
};

export default function optimizedImgCloudinary({
  url,
  quality = 'q_auto',
  type,
}: Props) {
  if (!url.includes('cloudinary.com/')) return url; // Si no es de Cloudinary, la deja igual.

  const listOptimized: string[] = [quality];
  if (type) {
    listOptimized.push(type);
  }

  // Aplicar transformaciones para reducir peso dinámicamente
  return url.replace('/upload/', `/upload/${listOptimized.join(',')}/`);
}
