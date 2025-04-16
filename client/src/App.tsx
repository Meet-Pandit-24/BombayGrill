import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Home from "@/pages/Home";
import MenuPage from "@/pages/MenuPage";
import CategoryPage from "@/pages/CategoryPage";
import AboutPage from "@/pages/AboutPage";
import GalleryPage from "@/pages/GalleryPage";
import ContactPage from "@/pages/ContactPage";
import ReservationPage from "@/pages/ReservationPage";
import AdminLogin from "@/pages/AdminLogin";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

// Styles
import "./index.css";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/menu/:categoryName" component={CategoryPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/reservations" component={ReservationPage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/:rest*" component={Admin} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
