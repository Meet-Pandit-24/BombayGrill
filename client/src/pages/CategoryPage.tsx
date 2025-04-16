import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem, MenuCategory } from "@shared/schema";
import { Link, useParams, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const params = useParams<{ categoryName: string }>();
  const categoryName = params.categoryName;
  const [, navigate] = useLocation();
  const [category, setCategory] = useState<MenuCategory | null>(null);
  
  const { data: categories, isLoading: loadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });
  
  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });
  
  useEffect(() => {
    if (categories) {
      const foundCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryName?.toLowerCase()
      );
      
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        // Redirect to menu page if category not found
        navigate("/menu");
      }
    }
  }, [categories, categoryName, navigate]);
  
  // Get an image for each category
  const getCategoryImage = (categoryName: string) => {
    // Map category names to appropriate images
    const categoryImages: Record<string, string> = {
      'appetizers': 'https://images.unsplash.com/photo-1625938144207-a60be9d6c4dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'main course': 'https://images.unsplash.com/photo-1585937421612-70a008356a82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'breads': 'https://images.unsplash.com/photo-1619535214051-56841e99a4a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'desserts': 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    };
    
    // Return the matching image URL or a default one
    return categoryImages[categoryName.toLowerCase()] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
  };
  
  // Filter menu items by category ID
  const categoryItems = menuItems?.filter(
    item => category && item.categoryId === category.id
  ) || [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <Link href="/menu" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Full Menu
          </Link>
          
          {loadingCategories || !category ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ) : (
            <>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mb-6 max-w-3xl">
                  {category.description}
                </p>
              )}
              
              {/* Category Banner Image */}
              <div className="mb-10 overflow-hidden rounded-lg h-64 w-full">
                <img 
                  src={getCategoryImage(category.name)} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          )}
          
          <div className="mt-8">
            {loadingItems ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : categoryItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden menu-item transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No items found in this category</h3>
                <p className="text-gray-500 mb-6">Try checking out our other categories.</p>
                <Link href="/menu">
                  <Button>
                    Browse Full Menu
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-16 p-8 bg-gray-50 rounded-lg text-center">
            <h3 className="font-heading text-2xl font-bold mb-4">Ready to taste these dishes?</h3>
            <p className="mb-6 text-gray-600 max-w-xl mx-auto">
              Experience our delicious menu in the warm ambiance of our restaurant. 
              Reserve your table now and enjoy a memorable dining experience.
            </p>
            <Link href="/reservations">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;