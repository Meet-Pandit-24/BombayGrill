import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GalleryImage } from "@shared/schema";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon } from "lucide-react";

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const { data: galleryImages, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });
  
  // Get unique categories
  const categories = galleryImages 
    ? Array.from(new Set(galleryImages.map(img => img.category)))
    : [];
  
  // Filter images by category
  const filteredImages = galleryImages 
    ? activeCategory === "all" 
      ? galleryImages 
      : galleryImages.filter(img => img.category === activeCategory)
    : [];
    
  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-8">
            Our Gallery
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Take a visual journey through our restaurant, cuisine, and the experiences we offer. 
            From our cozy ambiance to our exquisite dishes, get a glimpse of what awaits you.
          </p>
          
          {/* Category Filter */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <div className="flex space-x-4">
              <Button
                variant={activeCategory === "all" ? "default" : "secondary"}
                className={activeCategory === "all" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}
                onClick={() => setActiveCategory("all")}
              >
                All
              </Button>
              
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "secondary"}
                  className={activeCategory === category ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Gallery Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-medium">No images found</h3>
              <p className="mt-2 text-gray-500">
                {activeCategory === "all"
                  ? "There are no images in the gallery yet."
                  : "No images in this category. Try selecting a different category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className="gallery-item rounded-lg overflow-hidden h-64 cursor-pointer shadow-md hover:shadow-lg transition-shadow relative"
                  onClick={() => openLightbox(image)}
                >
                  <img
                    src={image.image}
                    alt={image.altText || image.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 w-full bg-gradient-to-t from-black to-transparent text-white">
                      <h3 className="font-heading font-bold text-lg">{image.title}</h3>
                      <p className="text-sm text-white/80">{image.category.charAt(0).toUpperCase() + image.category.slice(1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Experience Call to Action */}
          <div className="mt-20 p-8 bg-gray-50 rounded-lg text-center">
            <h3 className="font-heading text-2xl font-bold mb-4">Experience It In Person</h3>
            <p className="mb-6 text-gray-600 max-w-xl mx-auto">
              Photos can only capture so much. Visit us to fully experience the ambiance, 
              aromas, and authentic flavors of our restaurant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white" 
                size="lg"
                onClick={() => window.location.href = "/reservations"}
              >
                Book a Table
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = "/contact"}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl w-full">
            <button 
              className="absolute top-4 right-4 bg-black bg-opacity-60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-80"
              onClick={closeLightbox}
            >
              ✕
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.altText}
              className="max-h-[85vh] max-w-full mx-auto rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-white text-center">
              <h3 className="font-heading font-bold text-xl">{selectedImage.title}</h3>
              <p className="mt-2">{selectedImage.altText}</p>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default GalleryPage;