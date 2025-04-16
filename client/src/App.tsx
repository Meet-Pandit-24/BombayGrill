import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Home from "@/pages/Home";
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
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/:rest*" component={Admin} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
