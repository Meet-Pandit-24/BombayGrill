# Spice Haven Restaurant Website

A full-featured restaurant website built with React, Vite, Express, and Tailwind CSS.

## Features

- Beautiful responsive design for all devices
- Menu display with category filtering
- Reservation booking system
- Admin panel for content management
- Real-time reservation updates
- Gallery and testimonials
- Order management and integration with payment systems

## Deployment on Vercel

This project is configured for deployment on Vercel. To deploy:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically detect the build settings from the vercel.json file
4. Set up the following environment variables in Vercel:
   - DATABASE_URL (if using a database)
   - SESSION_SECRET (for secure sessions)
   - Any other API keys required by your project

## Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared types and utilities
- `/dist` - Build output (generated on build)

## Credits

- Built by: Your Name
- Design: Shadcn UI components with custom styling
- Images: Sourced from Unsplash