import { useEffect, useState } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { checkAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

import AdminNav from "@/components/admin/AdminNav";
import Dashboard from "@/pages/admin/Dashboard";
import MenuEditor from "@/pages/admin/MenuEditor";
import GalleryManager from "@/pages/admin/GalleryManager";
import ReservationList from "@/pages/admin/ReservationList";
import InfoSettings from "@/pages/admin/InfoSettings";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuth();
        setIsAuthenticated(response.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-xl">Loading admin panel...</span>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Redirect to="/admin/login" />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <AdminNav />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Switch>
          <Route path="/admin/dashboard" component={Dashboard} />
          <Route path="/admin/menu" component={MenuEditor} />
          <Route path="/admin/gallery" component={GalleryManager} />
          <Route path="/admin/reservations" component={ReservationList} />
          <Route path="/admin/settings" component={InfoSettings} />
          <Route path="/admin">
            <Redirect to="/admin/dashboard" />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
