import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { RestaurantInfo } from "@shared/schema";
import { Facebook, Instagram, Twitter, Slack } from "lucide-react";

const Footer = () => {
  const { data: restaurantInfo, isLoading } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  const hours = restaurantInfo ? JSON.parse(restaurantInfo.hours) : null;
  const socialLinks = restaurantInfo ? JSON.parse(restaurantInfo.socialLinks) : null;

  return (
    <footer className="bg-dark text-white/80 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-4">
              {restaurantInfo?.name || "Spice Haven"}
            </h4>
            <p className="mb-4">
              {restaurantInfo?.description || 
                "Authentic Indian cuisine made with love and tradition. Experience the rich flavors of India in every bite."}
            </p>
            <div className="flex space-x-4">
              <a 
                href={socialLinks?.facebook || "#"} 
                className="text-white/80 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href={socialLinks?.instagram || "#"} 
                className="text-white/80 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={socialLinks?.twitter || "#"} 
                className="text-white/80 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href={socialLinks?.yelp || "#"} 
                className="text-white/80 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Slack className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/#home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#menu" className="hover:text-white transition-colors">Menu</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/#gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/#reservation" className="hover:text-white transition-colors">Reservations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {restaurantInfo?.address}<br/>
                  {restaurantInfo?.city}, {restaurantInfo?.state} {restaurantInfo?.zip}
                </span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{restaurantInfo?.phone}</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{restaurantInfo?.email}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-4">Hours</h4>
            <ul className="space-y-2">
              <li>Monday - Thursday</li>
              <li className="text-white">{hours?.monday}</li>
              <li className="mt-2">Friday - Saturday</li>
              <li className="text-white">{hours?.friday}</li>
              <li className="mt-2">Sunday</li>
              <li className="text-white">{hours?.sunday}</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 text-center">
          <p>&copy; {new Date().getFullYear()} {restaurantInfo?.name || "Spice Haven"}. All rights reserved.</p>
          <p className="mt-2 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a> | 
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
