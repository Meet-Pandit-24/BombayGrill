import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { GalleryImage, insertGalleryImageSchema } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash, Plus, ImageIcon } from "lucide-react";

// Define schema for gallery image form
const galleryImageFormSchema = insertGalleryImageSchema.extend({
  displayOrder: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().min(0, "Display order must be a positive number")
  ),
});

type GalleryImageFormValues = z.infer<typeof galleryImageFormSchema>;

export default function GalleryManager() {
  const { toast } = useToast();
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Query gallery images
  const { data: galleryImages, isLoading: loadingImages } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  // Filter images by category
  const filteredImages = galleryImages 
    ? activeCategory === "all" 
      ? galleryImages 
      : galleryImages.filter(img => img.category === activeCategory)
    : [];

  // Get unique categories
  const categories = galleryImages 
    ? Array.from(new Set(galleryImages.map(img => img.category)))
    : [];

  // Gallery Image Form
  const imageForm = useForm<GalleryImageFormValues>({
    resolver: zodResolver(galleryImageFormSchema),
    defaultValues: {
      title: "",
      image: "",
      altText: "",
      category: "food",
      displayOrder: 0,
    },
  });

  // Reset form and state
  const resetImageForm = () => {
    imageForm.reset({
      title: "",
      image: "",
      altText: "",
      category: "food",
      displayOrder: 0,
    });
    setEditingImage(null);
    setIsAddingImage(false);
  };

  // Load image data into form for editing
  const editImage = (image: GalleryImage) => {
    setEditingImage(image);
    imageForm.reset({
      title: image.title,
      image: image.image,
      altText: image.altText,
      category: image.category,
      displayOrder: image.displayOrder,
    });
    setIsAddingImage(true);
  };

  // Confirm delete handler
  const confirmDeleteImage = (image: GalleryImage) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  // Mutations
  const createImageMutation = useMutation({
    mutationFn: async (data: GalleryImageFormValues) => {
      const res = await apiRequest('POST', '/api/gallery', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Image added",
        description: "The gallery image has been added successfully.",
      });
      resetImageForm();
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add gallery image.",
        variant: "destructive",
      });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GalleryImageFormValues }) => {
      const res = await apiRequest('PUT', `/api/gallery/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Image updated",
        description: "The gallery image has been updated successfully.",
      });
      resetImageForm();
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update gallery image.",
        variant: "destructive",
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/gallery/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Image deleted",
        description: "The gallery image has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setImageToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete gallery image.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmitImage = (data: GalleryImageFormValues) => {
    if (editingImage) {
      updateImageMutation.mutate({ id: editingImage.id, data });
    } else {
      createImageMutation.mutate(data);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (imageToDelete) {
      deleteImageMutation.mutate(imageToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Gallery Management</h1>
        <p className="text-gray-500">
          Add, edit, and manage the images displayed in your restaurant gallery.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => setActiveCategory("all")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <Button onClick={() => setIsAddingImage(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>

      {loadingImages ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-10">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No images found</h3>
          <p className="mt-2 text-gray-500">
            {activeCategory === "all"
              ? "Add some images to your gallery."
              : "No images in this category. Try selecting a different category or add a new image."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={image.image}
                  alt={image.altText}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{image.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{image.altText}</p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Order: {image.displayOrder}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => editImage(image)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDeleteImage(image)}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Gallery Image Form Dialog */}
      <Dialog open={isAddingImage} onOpenChange={(open) => !open && resetImageForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Gallery Image" : "Add Gallery Image"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the gallery image. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...imageForm}>
            <form onSubmit={imageForm.handleSubmit(onSubmitImage)} className="space-y-4">
              <FormField
                control={imageForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Butter Chicken Dish" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={imageForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={imageForm.control}
                name="altText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Delicious butter chicken dish" {...field} />
                    </FormControl>
                    <FormDescription>
                      Text that describes the image for accessibility.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={imageForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="ambience">Ambience</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={imageForm.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Preview */}
              {imageForm.watch("image") && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <img
                      src={imageForm.watch("image")}
                      alt={imageForm.watch("altText") || "Preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetImageForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createImageMutation.isPending || updateImageMutation.isPending
                  }
                >
                  {createImageMutation.isPending || updateImageMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingImage ? "Update" : "Add"} Image</>
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
              {imageToDelete
                ? `Are you sure you want to delete the image "${imageToDelete.title}"?`
                : "Are you sure you want to delete this image?"}
              <p className="mt-2">This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setImageToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteImageMutation.isPending}
            >
              {deleteImageMutation.isPending ? (
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
