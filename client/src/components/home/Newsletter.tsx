import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const Newsletter = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real application, this would send the email to a server endpoint
      console.log("Newsletter signup:", data.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing to our newsletter!",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was a problem subscribing you to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-white/80 mb-8">
            Stay updated with our latest menu items, special offers, and events.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow max-w-md">
                    <FormControl>
                      <Input 
                        placeholder="Your email address" 
                        type="email" 
                        className="px-4 py-3 rounded-l-md rounded-r-md sm:rounded-r-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-white text-sm mt-1" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary/90 text-dark px-6 py-3 rounded-l-md rounded-r-md sm:rounded-l-none font-medium"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </Form>
          
          <p className="text-white/70 text-sm mt-4">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
