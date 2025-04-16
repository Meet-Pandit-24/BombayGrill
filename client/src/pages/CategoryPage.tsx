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
  
  // Filter menu items by category ID
  const categoryItems = menuItems?.filter(
    item => item.categoryId === category?.id
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
                <p className="text-gray-600 mb-8 max-w-3xl">
                  {category.description}
                </p>
              )}
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