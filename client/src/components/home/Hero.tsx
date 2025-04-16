import { useQuery } from "@tanstack/react-query";
import { RestaurantInfo } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const { data: restaurantInfo, isLoading } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-dark">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
          alt="Restaurant interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
          {restaurantInfo?.name || "Spice Haven"}
        </h1>
        <p className="font-accent text-2xl md:text-3xl text-yellow-500 mb-8">
          {restaurantInfo?.tagline || "Authentic Indian Cuisine"}
        </p>
        <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {restaurantInfo?.description || 
            "Experience the rich flavors and aromatic spices of traditional Indian cooking in a modern, elegant setting."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#menu">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg">
              View Menu
            </Button>
          </Link>
          <Link href="#reservation">
            <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white/10 text-white px-8 py-6 rounded-full text-lg">
              Book a Table
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
