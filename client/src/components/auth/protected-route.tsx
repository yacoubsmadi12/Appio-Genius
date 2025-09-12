import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen pt-16 bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            data-testid="button-go-home"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
