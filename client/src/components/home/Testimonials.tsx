import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf } from "lucide-react";

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-500 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-500 text-yellow-500" />);
    }
    
    return stars;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16 relative">
          What Our Guests Say
          <span className="block w-20 h-1 bg-primary mx-auto mt-4"></span>
        </h2>
        
        <div className="testimonial-slider relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <div className="flex items-center">
                      <Skeleton className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              testimonials?.slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="bg-gray-50 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-500 flex">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6 italic">{testimonial.text}</p>
                    <div className="flex items-center">
                      {testimonial.image && (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      )}
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
