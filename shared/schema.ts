import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Restaurant Information
export const restaurantInfo = pgTable("restaurant_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  hours: text("hours").notNull(), // JSON string of opening hours
  socialLinks: text("social_links").notNull(), // JSON string of social media links
});

export const insertRestaurantInfoSchema = createInsertSchema(restaurantInfo).omit({
  id: true,
});

// Menu Categories
export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").notNull(),
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
});

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  image: text("image"),
  spiceLevel: text("spice_level"),
  isVegetarian: boolean("is_vegetarian").notNull().default(false),
  isVegan: boolean("is_vegan").notNull().default(false),
  isGlutenFree: boolean("is_gluten_free").notNull().default(false),
  displayOrder: integer("display_order").notNull(),
  featured: boolean("featured").notNull().default(false),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

// About Section
export const aboutSection = pgTable("about_section", {
  id: serial("id").primaryKey(),
  heading: text("heading").notNull(),
  paragraph1: text("paragraph1").notNull(),
  paragraph2: text("paragraph2").notNull(),
  paragraph3: text("paragraph3"),
  chefName: text("chef_name").notNull(),
  chefTitle: text("chef_title").notNull(),
  chefImage: text("chef_image"),
});

export const insertAboutSectionSchema = createInsertSchema(aboutSection).omit({
  id: true,
});

// Gallery Images
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  altText: text("alt_text").notNull(),
  category: text("category").notNull(), // food, ambience, etc.
  displayOrder: integer("display_order").notNull(),
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
  date: text("date").notNull(),
  image: text("image"),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

// Reservations
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  occasion: text("occasion"),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Admin Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Export types
export type InsertRestaurantInfo = z.infer<typeof insertRestaurantInfoSchema>;
export type RestaurantInfo = typeof restaurantInfo.$inferSelect;

export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

export type InsertAboutSection = z.infer<typeof insertAboutSectionSchema>;
export type AboutSection = typeof aboutSection.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
