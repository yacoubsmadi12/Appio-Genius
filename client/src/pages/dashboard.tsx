import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChange } from "@/lib/auth";
import { User } from "firebase/auth";
import { Plus, Download, Trash2, Smartphone, History, User as UserIcon, CreditCard } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";
import type { Project } from "@shared/schema";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [appData, setAppData] = useState({
    appName: "",
    pages: [{ title: "", description: "" }],
    prompt: "",
    firebaseIntegration: {
      auth: false,
      firestore: false,
      storage: false
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: !!user,
  });

  const generateAppMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/generate-app", data),
    onSuccess: () => {
      toast({
        title: "App generation started!",
        description: "Your Android app is being generated. Check back in a few minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setAppData({
        appName: "",
        pages: [{ title: "", description: "" }],
        prompt: "",
        firebaseIntegration: { auth: false, firestore: false, storage: false }
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/projects/${id}`, undefined),
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "Project has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appData.appName.trim() || !appData.prompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in the app name and description.",
        variant: "destructive",
      });
      return;
    }

    generateAppMutation.mutate(appData);
  };

  const addPage = () => {
    setAppData({
      ...appData,
      pages: [...appData.pages, { title: "", description: "" }]
    });
  };

  const updatePage = (index: number, field: 'title' | 'description', value: string) => {
    const updatedPages = [...appData.pages];
    updatedPages[index][field] = value;
    setAppData({ ...appData, pages: updatedPages });
  };

  const downloadProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/download`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `android-project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your project is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the project.",
        variant: "destructive",
      });
    }
  };

  const sidebarItems = [
    { id: "generate", label: "Generate App", icon: <Plus className="w-4 h-4" /> },
    { id: "projects", label: "My Projects", icon: <History className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <UserIcon className="w-4 h-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 bg-card rounded-xl p-6 border border-border h-fit">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  {user?.displayName?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.displayName || "User"}</p>
                <p className="text-sm text-muted-foreground">Pro Plan</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  data-testid={`sidebar-${item.id}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Google Ads Placeholder in Sidebar */}
            <div className="mt-8 p-4 border-2 border-dashed border-border rounded-lg" data-testid="sidebar-ad-space">
              <p className="text-muted-foreground text-xs text-center">Ad Space</p>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "generate" && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Generate New Android App</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* App Name */}
                    <div className="space-y-2">
                      <Label htmlFor="appName">App Name</Label>
                      <Input
                        id="appName"
                        type="text"
                        placeholder="My Awesome App"
                        value={appData.appName}
                        onChange={(e) => setAppData({ ...appData, appName: e.target.value })}
                        required
                        data-testid="input-app-name"
                      />
                    </div>
                    
                    {/* App Pages */}
                    <div className="space-y-4">
                      <Label>App Pages</Label>
                      {appData.pages.map((page, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <Input
                              type="text"
                              placeholder="Page Title (e.g., Home)"
                              value={page.title}
                              onChange={(e) => updatePage(index, 'title', e.target.value)}
                              data-testid={`input-page-title-${index}`}
                            />
                            <Input
                              type="text"
                              placeholder="Page Description"
                              value={page.description}
                              onChange={(e) => updatePage(index, 'description', e.target.value)}
                              data-testid={`input-page-description-${index}`}
                            />
                          </div>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addPage}
                        data-testid="button-add-page"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Page
                      </Button>
                    </div>
                    
                    {/* AI Prompt */}
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Describe Your App</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe your app features, design preferences, and any specific functionality you want..."
                        value={appData.prompt}
                        onChange={(e) => setAppData({ ...appData, prompt: e.target.value })}
                        className="h-32"
                        required
                        data-testid="textarea-app-description"
                      />
                    </div>
                    
                    {/* Firebase Integration */}
                    <div className="space-y-4">
                      <Label>Firebase Integration</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="firebase-auth"
                            checked={appData.firebaseIntegration.auth}
                            onCheckedChange={(checked) => 
                              setAppData({
                                ...appData,
                                firebaseIntegration: { 
                                  ...appData.firebaseIntegration, 
                                  auth: checked as boolean 
                                }
                              })
                            }
                            data-testid="checkbox-firebase-auth"
                          />
                          <Label htmlFor="firebase-auth">Authentication (Login/Register)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="firebase-firestore"
                            checked={appData.firebaseIntegration.firestore}
                            onCheckedChange={(checked) => 
                              setAppData({
                                ...appData,
                                firebaseIntegration: { 
                                  ...appData.firebaseIntegration, 
                                  firestore: checked as boolean 
                                }
                              })
                            }
                            data-testid="checkbox-firebase-firestore"
                          />
                          <Label htmlFor="firebase-firestore">Firestore Database</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="firebase-storage"
                            checked={appData.firebaseIntegration.storage}
                            onCheckedChange={(checked) => 
                              setAppData({
                                ...appData,
                                firebaseIntegration: { 
                                  ...appData.firebaseIntegration, 
                                  storage: checked as boolean 
                                }
                              })
                            }
                            data-testid="checkbox-firebase-storage"
                          />
                          <Label htmlFor="firebase-storage">Cloud Storage</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={generateAppMutation.isPending}
                      data-testid="button-generate-app"
                    >
                      {generateAppMutation.isPending ? "Generating..." : "Generate Android App"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "projects" && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                          <Skeleton className="h-8 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : projects && projects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 font-medium">App Name</th>
                            <th className="text-left py-3 font-medium">Created</th>
                            <th className="text-left py-3 font-medium">Status</th>
                            <th className="text-left py-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {projects.map((project: Project) => (
                            <tr key={project.id}>
                              <td className="py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{project.appName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {project.description || "No description"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-muted-foreground">
                                {new Date(project.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4">
                                <Badge
                                  variant={
                                    project.status === "ready" ? "default" :
                                    project.status === "generating" ? "secondary" : "destructive"
                                  }
                                >
                                  {project.status}
                                </Badge>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center space-x-2">
                                  {project.status === "ready" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => downloadProject(project.id)}
                                      data-testid={`button-download-${project.id}`}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteProjectMutation.mutate(project.id)}
                                    disabled={deleteProjectMutation.isPending}
                                    data-testid={`button-delete-${project.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Generate your first Android app to get started!
                      </p>
                      <Button onClick={() => setActiveTab("generate")} data-testid="button-generate-first-app">
                        Generate App
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user?.email || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Display Name</Label>
                      <Input value={user?.displayName || ""} disabled />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Account settings are managed through Firebase Authentication.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Billing & Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground">25 app generations per month</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Billing features will be implemented with a payment processor integration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
