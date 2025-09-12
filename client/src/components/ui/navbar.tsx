import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { User } from "firebase/auth";
import { onAuthStateChange, logout } from "@/lib/auth";
import { Button } from "./button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback } from "./avatar";
import { Menu, X, Smartphone, Zap } from "lucide-react";

interface NavbarProps {
  onShowAuthModal: (mode: 'login' | 'signup') => void;
}

export default function Navbar({ onShowAuthModal }: NavbarProps) {
  const [location] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await logout();
    if (location === "/dashboard") {
      window.location.href = "/";
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border shadow-sm z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Smartphone 
                className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" 
                data-testid="navbar-logo-icon"
              />
              <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 group-hover:text-orange-500 transition-colors duration-300" />
            </div>
            <span 
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 dark:group-hover:from-purple-400 dark:group-hover:to-pink-400 transition-all duration-300"
              data-testid="navbar-logo"
            >
              Appio Genius
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  location === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.displayName?.[0] || user.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700" data-testid="dropdown-dashboard">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700" data-testid="dropdown-account">
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
                    <DropdownMenuItem onClick={handleLogout} className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 cursor-pointer" data-testid="button-logout">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => onShowAuthModal('login')}
                  className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => onShowAuthModal('signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  data-testid="button-signup"
                >
                  Get Started
                </Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md transition-colors font-medium ${
                    location === link.href
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
