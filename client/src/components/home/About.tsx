import { useQuery } from "@tanstack/react-query";
import { AboutSection } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const About = () => {
  const { data: aboutData, isLoading } = useQuery<AboutSection>({
    queryKey: ["/api/about"],
  });

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-48 mb-6" />
                <Skeleton className="h-1 w-24 mb-8" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-4/5 mb-10" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-36 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                  {aboutData?.heading || "Our Story"}
                </h2>
                <div className="w-24 h-1 bg-primary mb-8"></div>
                <p className="text-gray-700 mb-6">
                  {aboutData?.paragraph1 || 
                    "At Spice Haven, we bring the authentic flavors of India to your table. Established in 2005 by Chef Raj Sharma, our restaurant combines traditional cooking techniques with locally sourced ingredients to create dishes that honor India's rich culinary heritage."}
                </p>
                <p className="text-gray-700 mb-6">
                  {aboutData?.paragraph2 || 
                    "Our recipes have been passed down through generations, preserving the authentic tastes and aromas that make Indian cuisine so beloved around the world. Each dish is carefully prepared with hand-ground spices and fresh ingredients."}
                </p>
                <p className="text-gray-700 mb-10">
                  {aboutData?.paragraph3 || 
                    "Whether you're familiar with Indian cuisine or trying it for the first time, our friendly staff will guide you through our menu to ensure a memorable dining experience."}
                </p>
                <div className="flex items-center space-x-4">
                  <img 
                    src={aboutData?.chefImage || "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=128&q=80"} 
                    alt={aboutData?.chefName || "Chef"} 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-heading font-bold text-lg">
                      {aboutData?.chefName || "Chef Raj Sharma"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {aboutData?.chefTitle || "Executive Chef & Founder"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="h-64 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1534939561126-855b8675edd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Restaurant interior" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="h-64 overflow-hidden rounded-lg mt-8">
              <img 
                src="https://images.unsplash.com/photo-1564222195116-8a74a96b2c8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Chef preparing food" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="h-64 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1616645297079-dfaf44a6f977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Traditional spices" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="h-64 overflow-hidden rounded-lg mt-8">
              <img 
                src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Cooking process" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
