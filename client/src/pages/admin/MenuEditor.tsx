import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MenuCategory, MenuItem, insertMenuItemSchema, insertMenuCategorySchema } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash, Plus } from "lucide-react";

// Define schema for menu item form
const menuItemFormSchema = insertMenuItemSchema.extend({
  categoryId: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number()
  ),
  displayOrder: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().min(0, "Display order must be a positive number")
  ),
});

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

// Define schema for category form
const categoryFormSchema = insertMenuCategorySchema.extend({
  displayOrder: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().min(0, "Display order must be a positive number")
  ),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function MenuEditor() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("items");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<MenuCategory | null>(null);

  // Query menu items and categories
  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: categories, isLoading: loadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });

  // Menu Item Form
  const itemForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      spiceLevel: "None",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      categoryId: 0,
      displayOrder: 0,
      featured: false,
    },
  });

  // Category Form
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 0,
    },
  });

  // Reset forms and states
  const resetItemForm = () => {
    itemForm.reset({
      name: "",
      description: "",
      price: "",
      image: "",
      spiceLevel: "None",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      categoryId: 0,
      displayOrder: 0,
      featured: false,
    });
    setEditingItem(null);
    setIsAddingItem(false);
  };

  const resetCategoryForm = () => {
    categoryForm.reset({
      name: "",
      description: "",
      displayOrder: 0,
    });
    setEditingCategory(null);
    setIsAddingCategory(false);
  };

  // Load item data into form for editing
  const editItem = (item: MenuItem) => {
    setEditingItem(item);
    itemForm.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image || "",
      spiceLevel: item.spiceLevel || "None",
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      categoryId: item.categoryId,
      displayOrder: item.displayOrder,
      featured: item.featured,
    });
    setIsAddingItem(true);
  };

  // Load category data into form for editing
  const editCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description || "",
      displayOrder: category.displayOrder,
    });
    setIsAddingCategory(true);
  };

  // Confirm delete handlers
  const confirmDeleteItem = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = (category: MenuCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: async (data: MenuItemFormValues) => {
      const res = await apiRequest('POST', '/api/menu-items', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu item created",
        description: "The menu item has been created successfully.",
      });
      resetItemForm();
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create menu item.",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MenuItemFormValues }) => {
      const res = await apiRequest('PUT', `/api/menu-items/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu item updated",
        description: "The menu item has been updated successfully.",
      });
      resetItemForm();
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update menu item.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/menu-items/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu item deleted",
        description: "The menu item has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item.",
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const res = await apiRequest('POST', '/api/menu-categories', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
      resetCategoryForm();
      queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryFormValues }) => {
      const res = await apiRequest('PUT', `/api/menu-categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
      resetCategoryForm();
      queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/menu-categories/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category.",
        variant: "destructive",
      });
    },
  });

  // Form submission handlers
  const onSubmitItem = (data: MenuItemFormValues) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data });
    } else {
      createItemMutation.mutate(data);
    }
  };

  const onSubmitCategory = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteItemMutation.mutate(itemToDelete.id);
    } else if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Menu Management</h1>
        <p className="text-gray-500">Add, edit, and manage your restaurant menu items and categories.</p>
      </div>

      <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Menu Items Tab */}
        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>

          {loadingItems || loadingCategories ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems?.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-start">
                      <span>{item.name}</span>
                      <span className="text-primary font-bold">{item.price}</span>
                    </CardTitle>
                    <CardDescription>
                      Category: {categories?.find((c) => c.id === item.categoryId)?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                    {item.image && (
                      <div className="w-full h-32 rounded-md overflow-hidden mb-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.isVegetarian && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Vegetarian
                        </span>
                      )}
                      {item.isVegan && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Vegan
                        </span>
                      )}
                      {item.isGlutenFree && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Gluten-Free
                        </span>
                      )}
                      {item.spiceLevel && item.spiceLevel !== "None" && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                          {item.spiceLevel}
                        </span>
                      )}
                      {item.featured && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => editItem(item)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDeleteItem(item)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categories</h2>
            <Button onClick={() => setIsAddingCategory(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>

          {loadingCategories ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories?.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>Display Order: {category.displayOrder}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => editCategory(category)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDeleteCategory(category)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Menu Item Form Dialog */}
      <Dialog open={isAddingItem} onOpenChange={(open) => !open && resetItemForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the menu item. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onSubmitItem)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={itemForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Butter Chicken" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={itemForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input placeholder="$16.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={itemForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tender chicken cooked in a rich tomato and butter sauce..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={itemForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the image of this menu item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={itemForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value, 10))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={itemForm.control}
                  name="spiceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spice Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select spice level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Mild">Mild</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hot">Hot</SelectItem>
                          <SelectItem value="Extra Hot">Extra Hot</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={itemForm.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Items with lower display order will be shown first.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col justify-end">
                  <FormField
                    control={itemForm.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>
                            Featured items will be shown on the homepage.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={itemForm.control}
                  name="isVegetarian"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Vegetarian</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={itemForm.control}
                  name="isVegan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Vegan</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={itemForm.control}
                  name="isGlutenFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Gluten-Free</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetItemForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createItemMutation.isPending || updateItemMutation.isPending
                  }
                >
                  {createItemMutation.isPending || updateItemMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingItem ? "Update" : "Add"} Menu Item</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Category Form Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={(open) => !open && resetCategoryForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the category. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Our signature main dishes..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Categories with lower display order will be shown first.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetCategoryForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createCategoryMutation.isPending ||
                    updateCategoryMutation.isPending
                  }
                >
                  {createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingCategory ? "Update" : "Add"} Category</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {itemToDelete
                ? `Are you sure you want to delete the menu item "${itemToDelete.name}"?`
                : categoryToDelete
                ? `Are you sure you want to delete the category "${categoryToDelete.name}"?`
                : "Are you sure you want to delete this item?"}
              {categoryToDelete && (
                <p className="mt-2 text-red-500">
                  Warning: This will also delete all menu items in this category!
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
                setCategoryToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteItemMutation.isPending || deleteCategoryMutation.isPending}
            >
              {deleteItemMutation.isPending || deleteCategoryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
