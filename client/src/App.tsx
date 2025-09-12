import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { handleGoogleRedirect } from "@/lib/auth";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import AuthModal from "@/components/auth/auth-modal";
import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Dashboard from "@/pages/dashboard";
import Account from "@/pages/account";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import NotFound from "@/pages/not-found";

function Router() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Handle Google OAuth redirect
    handleGoogleRedirect().then((result) => {
      if (result && result.user) {
        // Redirect to dashboard after successful Google sign-in
        setTimeout(() => setLocation("/dashboard"), 100);
      }
    }).catch(console.error);
  }, [setLocation]);

  const handleShowAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onShowAuthModal={handleShowAuthModal} />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={() => <Home onShowAuthModal={handleShowAuthModal} />} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/account" component={Account} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onToggleMode={toggleAuthMode}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
