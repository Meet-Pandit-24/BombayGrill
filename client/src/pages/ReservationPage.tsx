import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { RestaurantInfo } from "@shared/schema";
import Reservation from "@/components/home/Reservation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, Phone } from "lucide-react";

const ReservationPage = () => {
  const { data: restaurantInfo, isLoading } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  const hours = restaurantInfo ? JSON.parse(restaurantInfo.hours) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-8">
            Reserve Your Table
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Make a reservation at Spice Haven to enjoy authentic Indian cuisine in a warm and welcoming atmosphere. 
            We look forward to serving you an unforgettable culinary experience.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <Reservation />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Restaurant Info */}
              <Card className="overflow-hidden">
                <div className="h-36 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Restaurant interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-3">{restaurantInfo?.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-primary" />
                          <div>
                            <p>{restaurantInfo?.address}</p>
                            <p>{restaurantInfo?.city}, {restaurantInfo?.state} {restaurantInfo?.zip}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 mr-2 mt-1 text-primary" />
                          <p>{restaurantInfo?.phone}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Hours */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-heading text-lg font-bold">Hours of Operation</h3>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <p>Monday - Thursday:</p>
                        <p className="font-medium">{hours?.monday}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Friday - Saturday:</p>
                        <p className="font-medium">{hours?.friday}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Sunday:</p>
                        <p className="font-medium">{hours?.sunday}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Reservation Policy */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-heading text-lg font-bold mb-3">Reservation Policy</h3>
                  <div className="space-y-3 text-sm">
                    <p>
                      Reservations are held for 15 minutes after the scheduled time, after which they may be released.
                    </p>
                    <p>
                      For parties of 8 or more, please call us directly to make arrangements.
                    </p>
                    <p>
                      Special requests are accommodated based on availability and are not guaranteed.
                    </p>
                    <p>
                      Cancellations should be made at least 4 hours prior to your reservation time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Is there a dress code?</h3>
                <p className="text-gray-600">
                  We recommend smart casual attire. While we don't enforce a strict dress code, 
                  we appreciate when guests avoid sportswear and beachwear.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Do you accommodate dietary restrictions?</h3>
                <p className="text-gray-600">
                  Yes, we offer a variety of vegetarian, vegan, and gluten-free options. Please note any 
                  dietary restrictions or allergies when making your reservation, and our chef will be 
                  happy to accommodate your needs.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Is parking available?</h3>
                <p className="text-gray-600">
                  We offer complimentary valet parking for our dining guests. Street parking and a public 
                  parking garage are also available within a short walking distance.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Can I make a reservation for a special occasion?</h3>
                <p className="text-gray-600">
                  Absolutely! Please mention any special occasions when booking, and our team will do their 
                  best to make your celebration memorable. For larger events or private dining, contact us 
                  directly for more information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReservationPage;