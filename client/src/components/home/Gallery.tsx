import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GalleryImage } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: galleryImages, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });
  
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };
  
  const goToPrevious = () => {
    if (!galleryImages) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    if (!galleryImages) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16 relative">
          Gallery
          <span className="block w-20 h-1 bg-primary mx-auto mt-4"></span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="gallery-item rounded-lg h-48" />
            ))
          ) : (
            galleryImages?.map((image, index) => (
              <div 
                key={image.id}
                className="gallery-item rounded-lg overflow-hidden cursor-pointer shadow-md"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={image.image} 
                  alt={image.altText} 
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))
          )}
        </div>
        
        {/* Lightbox */}
        {lightboxOpen && galleryImages && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button 
              className="absolute top-6 right-6 text-white text-3xl z-50"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button 
              className="absolute left-6 text-white text-5xl z-50"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>
            
            <button 
              className="absolute right-6 text-white text-5xl z-50"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-12 w-12" />
            </button>
            
            <img 
              src={galleryImages[currentImageIndex].image} 
              alt={galleryImages[currentImageIndex].altText} 
              className="max-w-[90%] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
