import {
  InsertRestaurantInfo, RestaurantInfo,
  InsertMenuCategory, MenuCategory,
  InsertMenuItem, MenuItem,
  InsertAboutSection, AboutSection,
  InsertGalleryImage, GalleryImage,
  InsertTestimonial, Testimonial,
  InsertReservation, Reservation,
  InsertUser, User,
  InsertCustomer, Customer,
  InsertOrder, Order,
  InsertOrderItem, OrderItem,
  InsertPayment, Payment
} from "@shared/schema";

export interface IStorage {
  // Restaurant Info
  getRestaurantInfo(): Promise<RestaurantInfo | undefined>;
  upsertRestaurantInfo(info: InsertRestaurantInfo): Promise<RestaurantInfo>;
  
  // Menu Categories
  getAllMenuCategories(): Promise<MenuCategory[]>;
  getMenuCategory(id: number): Promise<MenuCategory | undefined>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  updateMenuCategory(id: number, category: Partial<InsertMenuCategory>): Promise<MenuCategory | undefined>;
  deleteMenuCategory(id: number): Promise<boolean>;
  
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  getFeaturedMenuItems(): Promise<MenuItem[]>;
  
  // About Section
  getAboutSection(): Promise<AboutSection | undefined>;
  upsertAboutSection(about: InsertAboutSection): Promise<AboutSection>;
  
  // Gallery Images
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  getGalleryImagesByCategory(category: string): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<boolean>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Reservations
  getAllReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;
  
  // Users
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo?(userId: number, stripeInfo: { stripeCustomerId: string }): Promise<User | undefined>;
  
  // Customers (optional methods for extension)
  getCustomerByEmail?(email: string): Promise<Customer | undefined>;
  createCustomer?(customer: InsertCustomer): Promise<Customer>;
  updateCustomer?(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  
  // Orders (optional methods for extension)
  getAllOrders?(): Promise<Order[]>;
  getOrderById?(id: number): Promise<Order | undefined>;
  getOrdersByCustomerId?(customerId: number): Promise<Order[]>;
  createOrder?(order: InsertOrder): Promise<Order>;
  updateOrderStatus?(id: number, status: string): Promise<Order | undefined>;
  updateOrderPaymentStatus?(id: number, paymentStatus: string): Promise<Order | undefined>;
  
  // Order Items (optional methods for extension)
  getOrderItemsByOrderId?(orderId: number): Promise<OrderItem[]>;
  createOrderItem?(item: InsertOrderItem): Promise<OrderItem>;
  
  // Payments (optional methods for extension)
  getPaymentByOrderId?(orderId: number): Promise<Payment | undefined>;
  createPayment?(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus?(id: number, status: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private restaurantInfoData: Map<number, RestaurantInfo>;
  private menuCategoriesData: Map<number, MenuCategory>;
  private menuItemsData: Map<number, MenuItem>;
  private aboutSectionData: Map<number, AboutSection>;
  private galleryImagesData: Map<number, GalleryImage>;
  private testimonialsData: Map<number, Testimonial>;
  private reservationsData: Map<number, Reservation>;
  private usersData: Map<number, User>;
  
  private categoryId: number;
  private menuItemId: number;
  private galleryImageId: number;
  private testimonialId: number;
  private reservationId: number;
  private userId: number;
  
  constructor() {
    this.restaurantInfoData = new Map();
    this.menuCategoriesData = new Map();
    this.menuItemsData = new Map();
    this.aboutSectionData = new Map();
    this.galleryImagesData = new Map();
    this.testimonialsData = new Map();
    this.reservationsData = new Map();
    this.usersData = new Map();
    
    this.categoryId = 1;
    this.menuItemId = 1;
    this.galleryImageId = 1;
    this.testimonialId = 1;
    this.reservationId = 1;
    this.userId = 1;
    
    // Initialize with default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      role: "admin"
    });
    
    // Initialize with sample data
    this.initializeDefaultData();
  }
  
  private initializeDefaultData() {
    // Restaurant Info
    this.upsertRestaurantInfo({
      name: "Spice Haven",
      tagline: "Authentic Indian Cuisine",
      description: "Experience the rich flavors and aromatic spices of traditional Indian cooking in a modern, elegant setting.",
      address: "123 Spice Avenue",
      city: "Vancouver",
      state: "BC",
      zip: "V6B 1A9",
      country: "Canada",
      phone: "(604) 123-4567",
      email: "info@spicehaven.ca",
      hours: JSON.stringify({
        monday: "11:30 AM - 9:30 PM",
        tuesday: "11:30 AM - 9:30 PM",
        wednesday: "11:30 AM - 9:30 PM",
        thursday: "11:30 AM - 9:30 PM",
        friday: "11:30 AM - 10:30 PM",
        saturday: "11:30 AM - 10:30 PM",
        sunday: "12:00 PM - 9:00 PM"
      }),
      socialLinks: JSON.stringify({
        facebook: "https://facebook.com/spicehaven",
        instagram: "https://instagram.com/spicehaven",
        twitter: "https://twitter.com/spicehaven",
        yelp: "https://yelp.com/spicehaven"
      })
    });
    
    // About Section
    this.upsertAboutSection({
      heading: "Our Story",
      paragraph1: "At Spice Haven, we bring the authentic flavors of India to your table. Established in 2005 by Chef Raj Sharma, our restaurant combines traditional cooking techniques with locally sourced ingredients to create dishes that honor India's rich culinary heritage.",
      paragraph2: "Our recipes have been passed down through generations, preserving the authentic tastes and aromas that make Indian cuisine so beloved around the world. Each dish is carefully prepared with hand-ground spices and fresh ingredients.",
      paragraph3: "Whether you're familiar with Indian cuisine or trying it for the first time, our friendly staff will guide you through our menu to ensure a memorable dining experience.",
      chefName: "Chef Raj Sharma",
      chefTitle: "Executive Chef & Founder",
      chefImage: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=128&q=80"
    });
    
    // Menu Categories
    const appetizersCategory = this.createMenuCategory({
      name: "Appetizers",
      description: "Start your meal with these delicious starters",
      displayOrder: 1
    });
    
    const mainCourseCategory = this.createMenuCategory({
      name: "Main Course",
      description: "Signature dishes full of flavor and aroma",
      displayOrder: 2
    });
    
    const breadsCategory = this.createMenuCategory({
      name: "Breads",
      description: "Traditional Indian breads, baked fresh",
      displayOrder: 3
    });
    
    const dessertsCategory = this.createMenuCategory({
      name: "Desserts",
      description: "Sweet treats to end your meal",
      displayOrder: 4
    });
    
    const beveragesCategory = this.createMenuCategory({
      name: "Beverages",
      description: "Refreshing drinks and traditional favorites",
      displayOrder: 5
    });
    
    // Menu Items
    this.createMenuItem({
      categoryId: appetizersCategory.id,
      name: "Vegetable Samosas",
      description: "Crispy pastry filled with spiced potatoes, peas, and aromatic spices. Served with tamarind chutney.",
      price: "$7.99",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      spiceLevel: "Medium",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      displayOrder: 1,
      featured: true
    });
    
    this.createMenuItem({
      categoryId: mainCourseCategory.id,
      name: "Butter Chicken",
      description: "Tender chicken cooked in a rich tomato and butter sauce with aromatic spices. Served with basmati rice.",
      price: "$16.99",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356a82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      spiceLevel: "Mild",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      displayOrder: 1,
      featured: true
    });
    
    this.createMenuItem({
      categoryId: mainCourseCategory.id,
      name: "Palak Paneer",
      description: "Fresh cottage cheese cubes in a creamy spinach sauce with aromatic spices. Served with basmati rice.",
      price: "$14.99",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      spiceLevel: "Mild",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      displayOrder: 2,
      featured: true
    });
    
    this.createMenuItem({
      categoryId: breadsCategory.id,
      name: "Garlic Naan",
      description: "Traditional leavened flatbread baked in a tandoor oven, topped with garlic and fresh cilantro.",
      price: "$3.99",
      image: "https://images.unsplash.com/photo-1605653411309-11cc3c87a86b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      spiceLevel: "None",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      displayOrder: 1,
      featured: true
    });
    
    this.createMenuItem({
      categoryId: dessertsCategory.id,
      name: "Gulab Jamun",
      description: "Soft milk solids dumplings soaked in rose-flavored sugar syrup. Served warm with a touch of cardamom.",
      price: "$5.99",
      image: "https://images.unsplash.com/photo-1593250186288-c82cb5d6a1a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      spiceLevel: "None",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      displayOrder: 1,
      featured: true
    });
    
    this.createMenuItem({
      categoryId: beveragesCategory.id,
      name: "Masala Chai",
      description: "Traditional Indian spiced tea prepared with a blend of aromatic spices, milk, and sweetener.",
      price: "$3.49",
      image: "https://images.unsplash.com/photo-1572097662444-9c6a7d8d0544?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      spiceLevel: "None",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      displayOrder: 1,
      featured: true
    });
    
    // Gallery Images
    this.createGalleryImage({
      title: "Restaurant Interior",
      image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Restaurant interior with elegant seating",
      category: "ambience",
      displayOrder: 1
    });
    
    this.createGalleryImage({
      title: "Restaurant Ambience",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Warm restaurant ambience with mood lighting",
      category: "ambience",
      displayOrder: 2
    });
    
    this.createGalleryImage({
      title: "Butter Chicken",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356a82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Creamy butter chicken in a bowl",
      category: "food",
      displayOrder: 1
    });
    
    this.createGalleryImage({
      title: "Palak Paneer",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Palak paneer with cheese cubes",
      category: "food",
      displayOrder: 2
    });
    
    this.createGalleryImage({
      title: "Restaurant Seating",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Elegant restaurant seating arrangement",
      category: "ambience",
      displayOrder: 3
    });
    
    this.createGalleryImage({
      title: "Tandoori Dishes",
      image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Assortment of tandoori dishes",
      category: "food",
      displayOrder: 3
    });
    
    this.createGalleryImage({
      title: "Dessert Platter",
      image: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Traditional Indian desserts on a platter",
      category: "food",
      displayOrder: 4
    });
    
    this.createGalleryImage({
      title: "Restaurant Bar",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      altText: "Well-stocked bar at the restaurant",
      category: "ambience",
      displayOrder: 4
    });
    
    // Testimonials
    this.createTestimonial({
      name: "Sarah Johnson",
      text: "The butter chicken was absolutely divine! Perfectly spiced and the flavors were authentic. The service was excellent and the ambiance was perfect for our anniversary dinner.",
      rating: 5,
      date: "March 15, 2023",
      image: "https://randomuser.me/api/portraits/women/45.jpg"
    });
    
    this.createTestimonial({
      name: "David Chen",
      text: "As a vegetarian, I was impressed by the range of options. The palak paneer was creamy and flavorful, and the garlic naan was the perfect accompaniment. Will definitely be back!",
      rating: 5,
      date: "February 8, 2023",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    });
    
    this.createTestimonial({
      name: "Maria Rodriguez",
      text: "First time trying Indian cuisine and I couldn't have picked a better place! The staff was patient in explaining the menu and recommending dishes based on my preferences. A memorable experience!",
      rating: 4.5,
      date: "January 22, 2023",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    });
  }
  
  // Restaurant Info Methods
  async getRestaurantInfo(): Promise<RestaurantInfo | undefined> {
    return this.restaurantInfoData.get(1);
  }
  
  async upsertRestaurantInfo(info: InsertRestaurantInfo): Promise<RestaurantInfo> {
    const existingInfo = await this.getRestaurantInfo();
    const id = existingInfo ? existingInfo.id : 1;
    const newInfo: RestaurantInfo = { ...info, id };
    this.restaurantInfoData.set(id, newInfo);
    return newInfo;
  }
  
  // Menu Categories Methods
  async getAllMenuCategories(): Promise<MenuCategory[]> {
    return Array.from(this.menuCategoriesData.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getMenuCategory(id: number): Promise<MenuCategory | undefined> {
    return this.menuCategoriesData.get(id);
  }
  
  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const id = this.categoryId++;
    const newCategory: MenuCategory = { ...category, id };
    this.menuCategoriesData.set(id, newCategory);
    return newCategory;
  }
  
  async updateMenuCategory(id: number, category: Partial<InsertMenuCategory>): Promise<MenuCategory | undefined> {
    const existingCategory = this.menuCategoriesData.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory: MenuCategory = { ...existingCategory, ...category };
    this.menuCategoriesData.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteMenuCategory(id: number): Promise<boolean> {
    return this.menuCategoriesData.delete(id);
  }
  
  // Menu Items Methods
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItemsData.values());
  }
  
  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItemsData.values())
      .filter(item => item.categoryId === categoryId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItemsData.get(id);
  }
  
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemId++;
    const newItem: MenuItem = { ...item, id };
    this.menuItemsData.set(id, newItem);
    return newItem;
  }
  
  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingItem = this.menuItemsData.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem: MenuItem = { ...existingItem, ...item };
    this.menuItemsData.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItemsData.delete(id);
  }
  
  async getFeaturedMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItemsData.values())
      .filter(item => item.featured);
  }
  
  // About Section Methods
  async getAboutSection(): Promise<AboutSection | undefined> {
    return this.aboutSectionData.get(1);
  }
  
  async upsertAboutSection(about: InsertAboutSection): Promise<AboutSection> {
    const existingAbout = await this.getAboutSection();
    const id = existingAbout ? existingAbout.id : 1;
    const newAbout: AboutSection = { ...about, id };
    this.aboutSectionData.set(id, newAbout);
    return newAbout;
  }
  
  // Gallery Images Methods
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImagesData.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    return this.galleryImagesData.get(id);
  }
  
  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return Array.from(this.galleryImagesData.values())
      .filter(image => image.category === category)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.galleryImageId++;
    const newImage: GalleryImage = { ...image, id };
    this.galleryImagesData.set(id, newImage);
    return newImage;
  }
  
  async updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const existingImage = this.galleryImagesData.get(id);
    if (!existingImage) return undefined;
    
    const updatedImage: GalleryImage = { ...existingImage, ...image };
    this.galleryImagesData.set(id, updatedImage);
    return updatedImage;
  }
  
  async deleteGalleryImage(id: number): Promise<boolean> {
    return this.galleryImagesData.delete(id);
  }
  
  // Testimonials Methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonialsData.values());
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonialsData.get(id);
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const newTestimonial: Testimonial = { ...testimonial, id };
    this.testimonialsData.set(id, newTestimonial);
    return newTestimonial;
  }
  
  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existingTestimonial = this.testimonialsData.get(id);
    if (!existingTestimonial) return undefined;
    
    const updatedTestimonial: Testimonial = { ...existingTestimonial, ...testimonial };
    this.testimonialsData.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonialsData.delete(id);
  }
  
  // Reservations Methods
  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservationsData.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservationsData.get(id);
  }
  
  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = this.reservationId++;
    const createdAt = new Date();
    const newReservation: Reservation = { 
      ...reservation, 
      id, 
      status: "pending", 
      createdAt 
    };
    this.reservationsData.set(id, newReservation);
    return newReservation;
  }
  
  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const existingReservation = this.reservationsData.get(id);
    if (!existingReservation) return undefined;
    
    const updatedReservation: Reservation = { ...existingReservation, status };
    this.reservationsData.set(id, updatedReservation);
    return updatedReservation;
  }
  
  // Users Methods
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values())
      .find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.usersData.set(id, newUser);
    return newUser;
  }
}

// Export the storage implementation
export const storage = new MemStorage();

// Note: We'll implement database storage in a future update
