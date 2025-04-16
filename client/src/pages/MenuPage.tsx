import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuItem, MenuCategory } from "@shared/schema";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame } from "lucide-react";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { data: categories, isLoading: loadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });
  
  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });
  
  // Find a category by name
  const findCategoryByName = (name: string) => {
    return categories?.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Filter menu items by category ID
  const getItemsByCategory = (categoryId: number | undefined) => {
    if (!categoryId || !menuItems) return [];
    return menuItems.filter(item => item.categoryId === categoryId);
  };
  
  // All categories for the tabs
  const menuCategories = categories || [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-8">
            Our Menu
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Experience the authentic taste of India with our carefully curated menu. 
            Each dish is prepared with traditional spices and fresh ingredients.
          </p>
          
          {loadingCategories ? (
            <div className="flex justify-center mb-12">
              <Skeleton className="h-10 w-3/4" />
            </div>
          ) : (
            <Tabs 
              defaultValue="all" 
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full mb-12"
            >
              <div className="overflow-x-auto">
                <TabsList className="h-auto p-1 flex flex-nowrap w-fit mx-auto">
                  <TabsTrigger value="all" className="px-4 py-2">
                    All
                  </TabsTrigger>
                  {menuCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.name.toLowerCase()}
                      className="px-4 py-2"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* All items tab */}
              <TabsContent value="all" className="mt-8">
                {menuCategories.map((category) => (
                  <div key={category.id} className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-heading text-2xl font-bold" id={category.name.toLowerCase()}>
                        {category.name}
                      </h2>
                      <Link href={`/menu/${category.name.toLowerCase()}`}>
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 mb-6">{category.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {loadingItems ? (
                        Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-64 w-full" />
                        ))
                      ) : (
                        getItemsByCategory(category.id).slice(0, 3).map((item) => (
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
                        ))
                      )}
                    </div>
                    {getItemsByCategory(category.id).length > 3 && (
                      <div className="text-center mt-6">
                        <Link href={`/menu/${category.name.toLowerCase()}`}>
                          <Button variant="link" className="text-primary">
                            View more {category.name}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              {/* Individual category tabs */}
              {menuCategories.map((category) => (
                <TabsContent key={category.id} value={category.name.toLowerCase()} className="mt-8">
                  <div className="mb-8">
                    <h2 className="font-heading text-3xl font-bold mb-4">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-gray-600 mb-6 max-w-3xl">{category.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingItems ? (
                      Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                      ))
                    ) : (
                      getItemsByCategory(category.id).map((item) => (
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
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
          
          <div className="mt-16 p-8 bg-gray-50 rounded-lg text-center">
            <h3 className="font-heading text-2xl font-bold mb-4">Want to make a reservation?</h3>
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

export default MenuPage;