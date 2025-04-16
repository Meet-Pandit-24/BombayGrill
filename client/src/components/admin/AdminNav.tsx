import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Book,
  Image,
  Settings,
  CalendarClock,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AdminNavProps {
  className?: string;
}

const AdminNav = ({ className }: AdminNavProps) => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.includes(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Close mobile menu when location changes
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-gray-50 border-b">
        <h1 className="text-xl font-bold font-heading text-primary">Spice Haven Admin</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:block lg:w-64 bg-gray-50 min-h-screen border-r ${className}`}
      >
        <div className="p-6 hidden lg:block">
          <h1 className="text-xl font-bold font-heading text-primary">Spice Haven Admin</h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link href="/admin/dashboard">
                <a
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive("/admin/dashboard")
                      ? "bg-primary text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/menu">
                <a
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive("/admin/menu")
                      ? "bg-primary text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Book className="mr-3 h-5 w-5" />
                  Menu Management
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/gallery">
                <a
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive("/admin/gallery")
                      ? "bg-primary text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Image className="mr-3 h-5 w-5" />
                  Gallery
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/reservations">
                <a
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive("/admin/reservations")
                      ? "bg-primary text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <CalendarClock className="mr-3 h-5 w-5" />
                  Reservations
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings">
                <a
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive("/admin/settings")
                      ? "bg-primary text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </a>
              </Link>
            </li>
          </ul>
          <div className="px-4 mt-8">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start p-3 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminNav;
