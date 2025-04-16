import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRestaurantInfoSchema, 
  insertMenuCategorySchema, 
  insertMenuItemSchema,
  insertAboutSectionSchema,
  insertGalleryImageSchema,
  insertTestimonialSchema,
  insertReservationSchema
} from "@shared/schema";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const SessionStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "spice-haven-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));
  
  // Authentication middleware
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session && req.session.authenticated) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };
  
  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.authenticated = true;
      req.session.user = { id: user.id, username: user.username, role: user.role };
      
      return res.status(200).json({ 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/check", (req, res) => {
    if (req.session && req.session.authenticated && req.session.user) {
      return res.status(200).json({ 
        authenticated: true,
        user: req.session.user
      });
    }
    return res.status(200).json({ authenticated: false });
  });
  
  // Restaurant Info routes
  app.get("/api/restaurant-info", async (req, res) => {
    try {
      const info = await storage.getRestaurantInfo();
      return res.status(200).json(info);
    } catch (error) {
      console.error("Error getting restaurant info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/restaurant-info", requireAuth, async (req, res) => {
    try {
      const parsedData = insertRestaurantInfoSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const updatedInfo = await storage.upsertRestaurantInfo(parsedData.data);
      return res.status(200).json(updatedInfo);
    } catch (error) {
      console.error("Error updating restaurant info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Menu Categories routes
  app.get("/api/menu-categories", async (req, res) => {
    try {
      const categories = await storage.getAllMenuCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error getting menu categories:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/menu-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const category = await storage.getMenuCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error("Error getting menu category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/menu-categories", requireAuth, async (req, res) => {
    try {
      const parsedData = insertMenuCategorySchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const newCategory = await storage.createMenuCategory(parsedData.data);
      return res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating menu category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/menu-categories/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const parsedData = insertMenuCategorySchema.partial().safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const updatedCategory = await storage.updateMenuCategory(id, parsedData.data);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Error updating menu category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/menu-categories/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteMenuCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Menu Items routes
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error("Error getting menu items:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/menu-items/featured", async (req, res) => {
    try {
      const items = await storage.getFeaturedMenuItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error("Error getting featured menu items:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/menu-items/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const items = await storage.getMenuItemsByCategory(categoryId);
      return res.status(200).json(items);
    } catch (error) {
      console.error("Error getting menu items by category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      return res.status(200).json(item);
    } catch (error) {
      console.error("Error getting menu item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/menu-items", requireAuth, async (req, res) => {
    try {
      const parsedData = insertMenuItemSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const newItem = await storage.createMenuItem(parsedData.data);
      return res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating menu item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/menu-items/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const parsedData = insertMenuItemSchema.partial().safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const updatedItem = await storage.updateMenuItem(id, parsedData.data);
      if (!updatedItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error("Error updating menu item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/menu-items/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteMenuItem(id);
      if (!success) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      return res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // About Section routes
  app.get("/api/about", async (req, res) => {
    try {
      const about = await storage.getAboutSection();
      return res.status(200).json(about);
    } catch (error) {
      console.error("Error getting about section:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/about", requireAuth, async (req, res) => {
    try {
      const parsedData = insertAboutSectionSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const updatedAbout = await storage.upsertAboutSection(parsedData.data);
      return res.status(200).json(updatedAbout);
    } catch (error) {
      console.error("Error updating about section:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Gallery Images routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      return res.status(200).json(images);
    } catch (error) {
      console.error("Error getting gallery images:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/gallery/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const images = await storage.getGalleryImagesByCategory(category);
      return res.status(200).json(images);
    } catch (error) {
      console.error("Error getting gallery images by category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const image = await storage.getGalleryImage(id);
      if (!image) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      return res.status(200).json(image);
    } catch (error) {
      console.error("Error getting gallery image:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/gallery", requireAuth, async (req, res) => {
    try {
      const parsedData = insertGalleryImageSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const newImage = await storage.createGalleryImage(parsedData.data);
      return res.status(201).json(newImage);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/gallery/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const parsedData = insertGalleryImageSchema.partial().safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const updatedImage = await storage.updateGalleryImage(id, parsedData.data);
      if (!updatedImage) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      return res.status(200).json(updatedImage);
    } catch (error) {
      console.error("Error updating gallery image:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/gallery/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteGalleryImage(id);
      if (!success) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      return res.status(200).json({ message: "Gallery image deleted successfully" });
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      return res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error getting testimonials:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const testimonial = await storage.getTestimonial(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      return res.status(200).json(testimonial);
    } catch (error) {
      console.error("Error getting testimonial:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/testimonials", requireAuth, async (req, res) => {
    try {
      const parsedData = insertTestimonialSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const newTestimonial = await storage.createTestimonial(parsedData.data);
      return res.status(201).json(newTestimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const parsedData = insertTestimonialSchema.partial().safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const updatedTestimonial = await storage.updateTestimonial(id, parsedData.data);
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      return res.status(200).json(updatedTestimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteTestimonial(id);
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      return res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Reservations routes
  app.get("/api/reservations", requireAuth, async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      return res.status(200).json(reservations);
    } catch (error) {
      console.error("Error getting reservations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/reservations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const reservation = await storage.getReservation(id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      return res.status(200).json(reservation);
    } catch (error) {
      console.error("Error getting reservation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/reservations", async (req, res) => {
    try {
      const parsedData = insertReservationSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
      }
      
      const newReservation = await storage.createReservation(parsedData.data);
      return res.status(201).json(newReservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/reservations/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const { status } = req.body;
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedReservation = await storage.updateReservationStatus(id, status);
      if (!updatedReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      return res.status(200).json(updatedReservation);
    } catch (error) {
      console.error("Error updating reservation status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
