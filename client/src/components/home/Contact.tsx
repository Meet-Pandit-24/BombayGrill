import { useQuery } from "@tanstack/react-query";
import { RestaurantInfo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Slack, MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  const { data: restaurantInfo, isLoading } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  const hours = restaurantInfo ? JSON.parse(restaurantInfo.hours) : null;
  const socialLinks = restaurantInfo ? JSON.parse(restaurantInfo.socialLinks) : null;

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16 relative">
          Find Us
          <span className="block w-20 h-1 bg-primary mx-auto mt-4"></span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="bg-white p-8 rounded-lg shadow-md mb-8">
              <CardContent className="p-0">
                <h3 className="font-heading text-2xl font-bold mb-6">Contact Information</h3>
                
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{restaurantInfo?.address}</p>
                        <p>{restaurantInfo?.city}, {restaurantInfo?.state} {restaurantInfo?.zip}</p>
                        <p>{restaurantInfo?.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p>{restaurantInfo?.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p>{restaurantInfo?.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-lg shadow-md">
              <CardContent className="p-0">
                <h3 className="font-heading text-2xl font-bold mb-6">Hours of Operation</h3>
                
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Monday - Thursday</p>
                      <p className="font-medium">{hours?.monday}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Friday - Saturday</p>
                      <p className="font-medium">{hours?.friday}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Sunday</p>
                      <p className="font-medium">{hours?.sunday}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h4 className="font-medium mb-2">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a 
                      href={socialLinks?.facebook || "#"} 
                      className="text-dark hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a 
                      href={socialLinks?.instagram || "#"} 
                      className="text-dark hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a 
                      href={socialLinks?.twitter || "#"} 
                      className="text-dark hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a 
                      href={socialLinks?.yelp || "#"} 
                      className="text-dark hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Slack"
                    >
                      <Slack className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="h-full min-h-[400px] rounded-lg overflow-hidden shadow-md">
            {/* Google Map */}
            <iframe
              title="Restaurant Location"
              className="w-full h-full border-0"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC2uH3LadvG8rnJ_GUF3hLHo5L7e43Ygf8&q=${encodeURIComponent(
                `${restaurantInfo?.address || '123 Spice Avenue'}, ${restaurantInfo?.city || 'Vancouver'}, ${restaurantInfo?.state || 'BC'}`
              )}`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
