import React from 'react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) return null;
  return (
    <div className="flex gap-2 overflow-x-auto mb-4">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Project image ${idx + 1}`}
          className="w-40 h-28 object-cover rounded-lg border"
        />
      ))}
    </div>
  );
}
