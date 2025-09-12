import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { onAuthStateChange } from "@/lib/auth";
import { User } from "firebase/auth";
import { User as UserIcon, CreditCard, Settings, Shield } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";

export default function Account() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and subscription preferences
            </p>
          </div>

          <div className="grid gap-6">
            {/* Profile Information */}
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl">
                      {user?.displayName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {user?.displayName || "User"}
                    </h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Badge className="mt-2">Verified Account</Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ""} 
                      disabled 
                      data-testid="input-account-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={user?.displayName || ""} 
                      disabled 
                      data-testid="input-account-name"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Firebase Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Your account is secured through Firebase Authentication. 
                        Changes to email and profile information are managed through your Firebase account.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information */}
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5" />
                  <CardTitle>Subscription & Billing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="flex items-center justify-between p-6 border border-border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                    <div>
                      <h3 className="text-lg font-semibold">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        25 app generations per month
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Advanced templates • Priority support • Custom branding
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="mb-2">Active</Badge>
                      <p className="text-2xl font-bold">$29<span className="text-sm font-normal">/mo</span></p>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-green-600">12</p>
                      <p className="text-sm text-muted-foreground">Apps Generated</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">13</p>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">147</p>
                      <p className="text-sm text-muted-foreground">Total Generated</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </div>
                  </div>

                  {/* Billing Info */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Billing Information</h4>
                      <Button variant="outline" size="sm" data-testid="button-manage-billing">
                        Manage Billing
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Next billing date</p>
                        <p className="font-medium">January 15, 2025</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment method</p>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Billing features will be implemented with a payment processor integration.
                    </p>
                  </div>

                  {/* Plan Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" data-testid="button-change-plan">
                      Change Plan
                    </Button>
                    <Button variant="outline" data-testid="button-billing-history">
                      View Billing History
                    </Button>
                    <Button variant="outline" data-testid="button-cancel-subscription">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Preferences */}
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  <CardTitle>Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Generation Complete</p>
                          <p className="text-sm text-muted-foreground">Get notified when your app generation is complete</p>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          Email
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Monthly Usage Report</p>
                          <p className="text-sm text-muted-foreground">Receive monthly reports on your app generation usage</p>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Data & Privacy</h4>
                    <div className="space-y-3">
                      <Button variant="outline" data-testid="button-download-data">
                        Download My Data
                      </Button>
                      <Button variant="outline" data-testid="button-delete-account">
                        Delete Account
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Account deletion is permanent and cannot be undone. All your generated apps and data will be permanently deleted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}