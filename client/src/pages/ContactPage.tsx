import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RestaurantInfo } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Twitter, Slack, MapPin, Phone, Mail, Clock } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: restaurantInfo, isLoading } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  const hours = restaurantInfo ? JSON.parse(restaurantInfo.hours) : null;
  const socialLinks = restaurantInfo ? JSON.parse(restaurantInfo.socialLinks) : null;
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real application, this would send the data to a server endpoint
      console.log("Contact form submitted:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you shortly!",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-8">
            Contact Us
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            We'd love to hear from you! Whether you have a question about our menu, 
            want to make a reservation, or have feedback to share, please don't hesitate to reach out.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">
                Send Us a Message
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Reservation Inquiry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Type your message here..." 
                            className="resize-none h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">
                Contact Information
              </h2>
              
              <Card className="bg-white shadow-md mb-8">
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="text-primary mr-4 mt-1">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Visit Us</p>
                          <p>{restaurantInfo?.address}</p>
                          <p>{restaurantInfo?.city}, {restaurantInfo?.state} {restaurantInfo?.zip}</p>
                          <p>{restaurantInfo?.country}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="text-primary mr-4 mt-1">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Call Us</p>
                          <p>{restaurantInfo?.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="text-primary mr-4 mt-1">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Email Us</p>
                          <p>{restaurantInfo?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="text-primary mr-4 mt-1">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Opening Hours</p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <p>Monday - Thursday:</p>
                            <p>{hours?.monday}</p>
                            <p>Friday - Saturday:</p>
                            <p>{hours?.friday}</p>
                            <p>Sunday:</p>
                            <p>{hours?.sunday}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-3">Follow Us</p>
                        <div className="flex space-x-4">
                          <a 
                            href={socialLinks?.facebook || "#"} 
                            className="text-gray-600 hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                          >
                            <Facebook className="h-5 w-5" />
                          </a>
                          <a 
                            href={socialLinks?.instagram || "#"} 
                            className="text-gray-600 hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                          >
                            <Instagram className="h-5 w-5" />
                          </a>
                          <a 
                            href={socialLinks?.twitter || "#"} 
                            className="text-gray-600 hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                          <a 
                            href={socialLinks?.yelp || "#"} 
                            className="text-gray-600 hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Yelp"
                          >
                            <Slack className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Google Map */}
              <div className="h-72 rounded-lg overflow-hidden shadow-md">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;