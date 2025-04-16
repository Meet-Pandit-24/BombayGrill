import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuCategory, MenuItem, insertMenuCategorySchema, insertMenuItemSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import AdminNav from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Pencil, 
  Trash, 
  Plus, 
  FireExtinguisher, 
  Flame, 
  Leaf 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Extended schemas for admin forms
const categoryFormSchema = insertMenuCategorySchema.extend({
  displayOrder: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)), 
    z.number().min(1, "Display order must be at least 1").optional()
  ),
});

const menuItemFormSchema = insertMenuItemSchema.extend({
  categoryId: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)), 
    z.number().min(1, "Category ID is required")
  ),
  displayOrder: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)), 
    z.number().min(1, "Display order must be at least 1").optional()
  ),
  price: z.string().min(1, "Price is required"),
  image: z.string().url("Image must be a valid URL").optional(),
  spiceLevel: z.enum(["None", "Mild", "Medium", "Hot", "Extra Hot"]).optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  featured: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;
type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export default function MenuManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("categories");
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleteItemDialog, setIsDeleteItemDialog] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  // Fetch menu categories and items
  const { data: categories, isLoading: loadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });
  
  const { data: menuItems, isLoading: loadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });
  
  // Category form
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 1,
    },
  });
  
  // Menu item form
  const menuItemForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: undefined,
      image: "",
      spiceLevel: "None",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      featured: false,
      displayOrder: 1,
    },
  });
  
  // Reset forms when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      if (activeTab === "categories") {
        categoryForm.reset();
        setEditingCategory(null);
      } else {
        menuItemForm.reset();
        setEditingMenuItem(null);
      }
    }
  };
  
  // Mutations for categories
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const res = await apiRequest('POST', '/api/menu-categories', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
      toast({
        title: "Category Added",
        description: "Menu category has been successfully added.",
      });
      categoryForm.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add menu category",
        variant: "destructive",
      });
    }
  });
  
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: CategoryFormValues }) => {
      const res = await apiRequest('PATCH', `/api/menu-categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
      toast({
        title: "Category Updated",
        description: "Menu category has been successfully updated.",
      });
      categoryForm.reset();
      setEditingCategory(null);
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update menu category",
        variant: "destructive",
      });
    }
  });
  
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/menu-categories/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Category Deleted",
        description: "Menu category and its items have been successfully deleted.",
      });
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete menu category",
        variant: "destructive",
      });
    }
  });
  
  // Mutations for menu items
  const createMenuItemMutation = useMutation({
    mutationFn: async (data: MenuItemFormValues) => {
      const res = await apiRequest('POST', '/api/menu-items', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu Item Added",
        description: "Menu item has been successfully added.",
      });
      menuItemForm.reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add menu item",
        variant: "destructive",
      });
    }
  });
  
  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: MenuItemFormValues }) => {
      const res = await apiRequest('PATCH', `/api/menu-items/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu Item Updated",
        description: "Menu item has been successfully updated.",
      });
      menuItemForm.reset();
      setEditingMenuItem(null);
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update menu item",
        variant: "destructive",
      });
    }
  });
  
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/menu-items/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu Item Deleted",
        description: "Menu item has been successfully deleted.",
      });
      setDeleteConfirmId(null);
      setIsDeleteItemDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete menu item",
        variant: "destructive",
      });
    }
  });
  
  // Form Submit handlers
  const onCategorySubmit = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };
  
  const onMenuItemSubmit = (data: MenuItemFormValues) => {
    if (editingMenuItem) {
      updateMenuItemMutation.mutate({ id: editingMenuItem.id, data });
    } else {
      createMenuItemMutation.mutate(data);
    }
  };
  
  // Edit category handler
  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description || "",
      displayOrder: category.displayOrder,
    });
    setDialogOpen(true);
  };
  
  // Edit menu item handler
  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    menuItemForm.reset({
      name: item.name,
      description: item.description || "",
      price: item.price,
      categoryId: item.categoryId,
      image: item.image || "",
      spiceLevel: (item.spiceLevel as "None" | "Mild" | "Medium" | "Hot" | "Extra Hot") || "None",
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      featured: item.featured || false,
      displayOrder: item.displayOrder,
    });
    setDialogOpen(true);
  };
  
  // Delete handlers
  const handleDeleteClick = (id: number, isItem: boolean) => {
    setDeleteConfirmId(id);
    setIsDeleteItemDialog(isItem);
  };
  
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      if (isDeleteItemDialog) {
        deleteMenuItemMutation.mutate(deleteConfirmId);
      } else {
        deleteCategoryMutation.mutate(deleteConfirmId);
      }
    }
  };
  
  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    if (!categories) return "Unknown";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Menu Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <AdminNav className="sticky top-24" />
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Manage Menu</CardTitle>
              <CardDescription>Add, edit, or delete menu categories and items.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="items">Menu Items</TabsTrigger>
                </TabsList>
                
                {/* Categories Tab */}
                <TabsContent value="categories">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Menu Categories</h3>
                    <Dialog open={dialogOpen && activeTab === "categories"} onOpenChange={handleDialogOpenChange}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingCategory ? "Edit" : "Add"} Menu Category</DialogTitle>
                          <DialogDescription>
                            {editingCategory 
                              ? "Update the details of an existing menu category." 
                              : "Create a new menu category to organize menu items."}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...categoryForm}>
                          <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                            <FormField
                              control={categoryForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g. Appetizers, Main Course, etc." />
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
                                      {...field} 
                                      placeholder="Brief description of this category..." 
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
                                  <FormLabel>Display Order</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="1" 
                                      {...field}
                                      onChange={(e) => field.onChange(e.target.valueAsNumber || '')}
                                      value={field.value}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Controls the order in which categories appear on the menu.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button 
                                type="submit"
                                disabled={categoryForm.formState.isSubmitting || 
                                          createCategoryMutation.isPending ||
                                          updateCategoryMutation.isPending}
                              >
                                {categoryForm.formState.isSubmitting || 
                                 createCategoryMutation.isPending ||
                                 updateCategoryMutation.isPending 
                                  ? "Saving..." 
                                  : editingCategory ? "Update Category" : "Add Category"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {loadingCategories ? (
                    <div className="text-center py-8">Loading categories...</div>
                  ) : !categories || categories.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No menu categories found. Add your first category to get started.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>List of menu categories</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-center">Order</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                            <TableCell className="text-center">{category.displayOrder}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-500"
                                      onClick={() => handleDeleteClick(category.id, false)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{category.name}"? This will also delete all menu items in this category. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={handleConfirmDelete}
                                        className="bg-red-500 text-white hover:bg-red-600"
                                        disabled={deleteCategoryMutation.isPending}
                                      >
                                        {deleteCategoryMutation.isPending ? "Deleting..." : "Delete"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                
                {/* Menu Items Tab */}
                <TabsContent value="items">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Menu Items</h3>
                    <Dialog open={dialogOpen && activeTab === "items"} onOpenChange={handleDialogOpenChange}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Menu Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{editingMenuItem ? "Edit" : "Add"} Menu Item</DialogTitle>
                          <DialogDescription>
                            {editingMenuItem 
                              ? "Update the details of an existing menu item." 
                              : "Add a new item to your restaurant menu."}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...menuItemForm}>
                          <form onSubmit={menuItemForm.handleSubmit(onMenuItemSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={menuItemForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g. Chicken Tikka Masala" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={menuItemForm.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="e.g. $12.99" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={menuItemForm.control}
                              name="categoryId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select 
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    defaultValue={field.value?.toString() || ""}
                                    value={field.value?.toString() || ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories?.map((category) => (
                                        <SelectItem 
                                          key={category.id} 
                                          value={category.id.toString()}
                                        >
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
                              control={menuItemForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      placeholder="Brief description of this dish..." 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={menuItemForm.control}
                              name="image"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image URL</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="https://example.com/image.jpg" 
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter a URL for an image of this dish.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={menuItemForm.control}
                                name="spiceLevel"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Spice Level</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange}
                                      defaultValue={field.value || "None"}
                                      value={field.value || "None"}
                                    >
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
                              
                              <FormField
                                control={menuItemForm.control}
                                name="displayOrder"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Display Order</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="1" 
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber || '')}
                                        value={field.value}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <FormField
                                control={menuItemForm.control}
                                name="isVegetarian"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Vegetarian</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={menuItemForm.control}
                                name="isVegan"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Vegan</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={menuItemForm.control}
                                name="isGlutenFree"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Gluten Free</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={menuItemForm.control}
                                name="featured"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Featured</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                type="submit"
                                disabled={menuItemForm.formState.isSubmitting || 
                                          createMenuItemMutation.isPending ||
                                          updateMenuItemMutation.isPending}
                              >
                                {menuItemForm.formState.isSubmitting || 
                                 createMenuItemMutation.isPending ||
                                 updateMenuItemMutation.isPending 
                                  ? "Saving..." 
                                  : editingMenuItem ? "Update Item" : "Add Item"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {loadingItems ? (
                    <div className="text-center py-8">Loading menu items...</div>
                  ) : !menuItems || menuItems.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No menu items found. Add your first item to get started.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>List of all menu items</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-center">Attributes</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center space-x-2">
                                {item.isVegetarian && (
                                  <span title="Vegetarian" className="text-green-600">
                                    <Leaf className="h-4 w-4" />
                                  </span>
                                )}
                                {item.isGlutenFree && (
                                  <span title="Gluten Free" className="text-amber-600">
                                    <FireExtinguisher className="h-4 w-4" />
                                  </span>
                                )}
                                {item.spiceLevel && item.spiceLevel !== "None" && (
                                  <span title={`Spice Level: ${item.spiceLevel}`} className="text-red-500">
                                    <Flame className="h-4 w-4" />
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditMenuItem(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-500"
                                      onClick={() => handleDeleteClick(item.id, true)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={handleConfirmDelete}
                                        className="bg-red-500 text-white hover:bg-red-600"
                                        disabled={deleteMenuItemMutation.isPending}
                                      >
                                        {deleteMenuItemMutation.isPending ? "Deleting..." : "Delete"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}