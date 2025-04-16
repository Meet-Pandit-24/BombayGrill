import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RestaurantInfo, AboutSection, insertRestaurantInfoSchema, insertAboutSectionSchema } from "@shared/schema";

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Restaurant Info Schema
const restaurantInfoFormSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip: z.string().min(1, "Zip/Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  monday: z.string().min(1, "Monday hours are required"),
  tuesday: z.string().min(1, "Tuesday hours are required"),
  wednesday: z.string().min(1, "Wednesday hours are required"),
  thursday: z.string().min(1, "Thursday hours are required"),
  friday: z.string().min(1, "Friday hours are required"),
  saturday: z.string().min(1, "Saturday hours are required"),
  sunday: z.string().min(1, "Sunday hours are required"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  yelp: z.string().optional(),
});

type RestaurantInfoFormValues = z.infer<typeof restaurantInfoFormSchema>;

// About Section Schema
const aboutSectionFormSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  paragraph1: z.string().min(1, "Paragraph 1 is required"),
  paragraph2: z.string().min(1, "Paragraph 2 is required"),
  paragraph3: z.string().optional(),
  chefName: z.string().min(1, "Chef name is required"),
  chefTitle: z.string().min(1, "Chef title is required"),
  chefImage: z.string().optional(),
});

type AboutSectionFormValues = z.infer<typeof aboutSectionFormSchema>;

export default function InfoSettings() {
  const { toast } = useToast();

  // Restaurant Info Query
  const { data: restaurantInfo, isLoading: loadingRestaurantInfo } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  // About Section Query
  const { data: aboutSection, isLoading: loadingAboutSection } = useQuery<AboutSection>({
    queryKey: ["/api/about"],
  });

  // Restaurant Info Form
  const restaurantInfoForm = useForm<RestaurantInfoFormValues>({
    resolver: zodResolver(restaurantInfoFormSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
      facebook: "",
      instagram: "",
      twitter: "",
      yelp: "",
    },
  });

  // About Section Form
  const aboutSectionForm = useForm<AboutSectionFormValues>({
    resolver: zodResolver(aboutSectionFormSchema),
    defaultValues: {
      heading: "",
      paragraph1: "",
      paragraph2: "",
      paragraph3: "",
      chefName: "",
      chefTitle: "",
      chefImage: "",
    },
  });

  // Set form values when data is loaded
  React.useEffect(() => {
    if (restaurantInfo) {
      const hours = JSON.parse(restaurantInfo.hours);
      const socialLinks = JSON.parse(restaurantInfo.socialLinks);
      
      restaurantInfoForm.reset({
        name: restaurantInfo.name,
        tagline: restaurantInfo.tagline,
        description: restaurantInfo.description,
        address: restaurantInfo.address,
        city: restaurantInfo.city,
        state: restaurantInfo.state,
        zip: restaurantInfo.zip,
        country: restaurantInfo.country,
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        monday: hours.monday || "",
        tuesday: hours.tuesday || "",
        wednesday: hours.wednesday || "",
        thursday: hours.thursday || "",
        friday: hours.friday || "",
        saturday: hours.saturday || "",
        sunday: hours.sunday || "",
        facebook: socialLinks.facebook || "",
        instagram: socialLinks.instagram || "",
        twitter: socialLinks.twitter || "",
        yelp: socialLinks.yelp || "",
      });
    }
  }, [restaurantInfo, restaurantInfoForm]);

  React.useEffect(() => {
    if (aboutSection) {
      aboutSectionForm.reset({
        heading: aboutSection.heading,
        paragraph1: aboutSection.paragraph1,
        paragraph2: aboutSection.paragraph2,
        paragraph3: aboutSection.paragraph3 || "",
        chefName: aboutSection.chefName,
        chefTitle: aboutSection.chefTitle,
        chefImage: aboutSection.chefImage || "",
      });
    }
  }, [aboutSection, aboutSectionForm]);

  // Mutations
  const updateRestaurantInfoMutation = useMutation({
    mutationFn: async (data: RestaurantInfoFormValues) => {
      // Transform form data to match API schema
      const transformedData = {
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        phone: data.phone,
        email: data.email,
        hours: JSON.stringify({
          monday: data.monday,
          tuesday: data.tuesday,
          wednesday: data.wednesday,
          thursday: data.thursday,
          friday: data.friday,
          saturday: data.saturday,
          sunday: data.sunday,
        }),
        socialLinks: JSON.stringify({
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          yelp: data.yelp,
        }),
      };

      const res = await apiRequest('PUT', '/api/restaurant-info', transformedData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Restaurant information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/restaurant-info"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update restaurant information.",
        variant: "destructive",
      });
    },
  });

  const updateAboutSectionMutation = useMutation({
    mutationFn: async (data: AboutSectionFormValues) => {
      const res = await apiRequest('PUT', '/api/about', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "About section updated",
        description: "About section has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update about section.",
        variant: "destructive",
      });
    },
  });

  // Form submission handlers
  const onSubmitRestaurantInfo = (data: RestaurantInfoFormValues) => {
    updateRestaurantInfoMutation.mutate(data);
  };

  const onSubmitAboutSection = (data: AboutSectionFormValues) => {
    updateAboutSectionMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Restaurant Settings</h1>
        <p className="text-gray-500">
          Manage your restaurant information, about section, and other settings.
        </p>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Restaurant Info</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
        </TabsList>

        {/* Restaurant Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Update your restaurant's basic information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRestaurantInfo ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Form {...restaurantInfoForm}>
                  <form
                    onSubmit={restaurantInfoForm.handleSubmit(onSubmitRestaurantInfo)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={restaurantInfoForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Restaurant Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="tagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tagline</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={restaurantInfoForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="min-h-24"
                              />
                            </FormControl>
                            <FormDescription>
                              A brief description of your restaurant for the hero section.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Location & Contact</h3>
                      <FormField
                        control={restaurantInfoForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={restaurantInfoForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip/Postal Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={restaurantInfoForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={restaurantInfoForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Business Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={restaurantInfoForm.control}
                          name="monday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monday</FormLabel>
                              <FormControl>
                                <Input placeholder="11:30 AM - 9:30 PM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="tuesday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tuesday</FormLabel>
                              <FormControl>
                                <Input placeholder="11:30 AM - 9:30 PM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="wednesday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wednesday</FormLabel>
                              <FormControl>
                                <Input placeholder="11:30 AM - 9:30 PM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="thursday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thursday</FormLabel>
                              <FormControl>
                                <Input placeholder="11:30 AM - 9:30 PM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="friday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Friday</FormLabel>
                              <FormControl>
                                <Input placeholder="11:30 AM - 10:30 PM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="saturday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Saturday</FormLabel>
                              <FormControl>
                                <Input placeholder="11:30 AM - 10:30 PM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="sunday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sunday</FormLabel>
                              <FormControl>
                                <Input placeholder="12:00 PM - 9:00 PM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Social Media</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={restaurantInfoForm.control}
                          name="facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Facebook URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://facebook.com/yourrestaurant" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://instagram.com/yourrestaurant" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://twitter.com/yourrestaurant" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantInfoForm.control}
                          name="yelp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Yelp URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yelp.com/yourrestaurant" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-6"
                      disabled={updateRestaurantInfoMutation.isPending}
                    >
                      {updateRestaurantInfoMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                Update the content for your restaurant's "About Us" section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAboutSection ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Form {...aboutSectionForm}>
                  <form
                    onSubmit={aboutSectionForm.handleSubmit(onSubmitAboutSection)}
                    className="space-y-6"
                  >
                    <FormField
                      control={aboutSectionForm.control}
                      name="heading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Heading</FormLabel>
                          <FormControl>
                            <Input placeholder="Our Story" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aboutSectionForm.control}
                      name="paragraph1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paragraph 1</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share the story of your restaurant..."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aboutSectionForm.control}
                      name="paragraph2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paragraph 2</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Continue your story..."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aboutSectionForm.control}
                      name="paragraph3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paragraph 3 (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add more details if needed..."
                              className="min-h-24"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Chef Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={aboutSectionForm.control}
                          name="chefName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chef Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Chef John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={aboutSectionForm.control}
                          name="chefTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chef Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Executive Chef & Founder" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={aboutSectionForm.control}
                        name="chefImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chef Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/chef-image.jpg"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              URL for the chef's profile image.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="mt-6"
                      disabled={updateAboutSectionMutation.isPending}
                    >
                      {updateAboutSectionMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
