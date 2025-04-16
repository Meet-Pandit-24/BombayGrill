import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem, MenuCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Flame } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const { data: categories, isLoading: loadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });
  
  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });
  
  const filteredItems = menuItems 
    ? activeCategory === "All" 
      ? menuItems 
      : menuItems.filter(item => {
          const category = categories?.find(cat => cat.id === item.categoryId);
          return category?.name === activeCategory;
        })
    : [];
  
  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
  };
  
  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16 relative">
          Our Menu
          <span className="block w-20 h-1 bg-primary mx-auto mt-4"></span>
        </h2>
        
        {/* Menu Categories */}
        {loadingCategories ? (
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <div className="flex space-x-4">
              <Button
                variant={activeCategory === "All" ? "default" : "secondary"}
                className={activeCategory === "All" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}
                onClick={() => handleCategoryChange("All")}
              >
                All
              </Button>
              
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.name ? "default" : "secondary"}
                  className={activeCategory === category.name ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}
                  onClick={() => handleCategoryChange(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Menu Items */}
        {loadingItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-20 rounded mr-2" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="menu-item transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-lg">
                {item.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-bold text-xl">{item.name}</h3>
                    <span className="text-primary font-bold">{item.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center text-sm flex-wrap gap-2">
                    {item.isVegetarian && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Vegetarian</span>
                    )}
                    {item.isVegan && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Vegan</span>
                    )}
                    {item.isGlutenFree && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">Gluten-Free</span>
                    )}
                    {item.spiceLevel && item.spiceLevel !== "None" && (
                      <span className="flex items-center text-orange-500">
                        <Flame className="w-4 h-4 mr-1" />
                        {item.spiceLevel}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button variant="link" className="text-primary hover:text-primary/80 flex items-center">
            View Full Menu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
