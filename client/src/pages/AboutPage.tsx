import { useQuery } from "@tanstack/react-query";
import { AboutSection, Testimonial } from "@shared/schema";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

const AboutPage = () => {
  const { data: aboutSection, isLoading: loadingAbout } = useQuery<AboutSection>({
    queryKey: ["/api/about"],
  });
  
  const { data: testimonials, isLoading: loadingTestimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-8">
              About Us
            </h1>
            
            {/* Our Story Section */}
            <section className="mb-20">
              {loadingAbout ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-3xl font-bold text-center mb-8">
                    {aboutSection?.heading || "Our Story"}
                  </h2>
                  <div className="prose prose-lg max-w-none mb-12">
                    <p>{aboutSection?.paragraph1}</p>
                    <p>{aboutSection?.paragraph2}</p>
                    {aboutSection?.paragraph3 && <p>{aboutSection.paragraph3}</p>}
                  </div>
                </>
              )}
              
              {/* Historical photos or restaurant images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="rounded-lg overflow-hidden h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Restaurant interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Restaurant dishes" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
            
            {/* Meet the Chef Section */}
            <section className="mb-20">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">
                Meet Our Chef
              </h2>
              
              {loadingAbout ? (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <Skeleton className="h-80 w-full md:w-1/2 rounded-lg" />
                  <div className="w-full md:w-1/2 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
                    <img 
                      src={aboutSection?.chefImage || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"} 
                      alt={aboutSection?.chefName || "Our Chef"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="font-heading text-2xl font-bold mb-2">
                      {aboutSection?.chefName || "Chef Name"}
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      {aboutSection?.chefTitle || "Head Chef"}
                    </p>
                    <div className="prose">
                      <p>
                        With over 20 years of culinary experience, our head chef brings authentic recipes 
                        from various regions of India. Trained in the traditional methods and with a passion 
                        for innovation, every dish is crafted with care and expertise.
                      </p>
                      <p>
                        "My goal is to take you on a culinary journey through India, one dish at a time. 
                        Every recipe tells a story of culture, tradition, and passion."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            {/* Testimonials Section */}
            <section className="mb-20">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">
                What Our Guests Say
              </h2>
              
              {loadingTestimonials ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials?.slice(0, 4).map((testimonial) => (
                    <Card key={testimonial.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <Quote className="h-8 w-8 text-primary/20 mb-4" />
                        <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                        <div className="flex items-center">
                          {testimonial.image && (
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{new Date(testimonial.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
            
            {/* Values/Commitments Section */}
            <section className="mb-20">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">
                Our Commitments
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 p-5 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">Authentic Flavors</h3>
                  <p className="text-gray-600">
                    We use traditional recipes, techniques, and authentic spices imported directly from India.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 p-5 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">Fresh Ingredients</h3>
                  <p className="text-gray-600">
                    We source the freshest local produce and ingredients to ensure the highest quality dishes.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 p-5 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">Sustainable Practices</h3>
                  <p className="text-gray-600">
                    We are committed to environmentally sustainable practices in our kitchen and throughout our restaurant.
                  </p>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <section className="text-center bg-gray-50 p-12 rounded-lg">
              <h2 className="font-heading text-3xl font-bold mb-4">
                Come Experience Our Story
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                We invite you to join us for a memorable dining experience. From the warm ambiance to 
                the delicious food, every aspect of Spice Haven is designed to transport you to the 
                diverse and flavorful regions of India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/reservations">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                    Make a Reservation
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button size="lg" variant="outline" className="px-8">
                    View Our Menu
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;