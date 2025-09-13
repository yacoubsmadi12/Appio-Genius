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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChange } from "@/lib/auth";
import { User } from "firebase/auth";
import { Plus, Download, Trash2, Smartphone, History, User as UserIcon, CreditCard, Image, Upload, Database, Cloud, Settings } from "lucide-react";
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
    iconType: "ai_generated",
    iconFile: null as File | null,
    firebaseIntegration: {
      auth: false,
      firestore: false,
      storage: false,
      cloudFunctions: false
    },
    databaseIntegration: {
      type: "none",
      features: [] as string[]
    },
    includeProductImages: false,
    productImageCount: 0
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
        iconType: "ai_generated",
        iconFile: null,
        firebaseIntegration: { auth: false, firestore: false, storage: false, cloudFunctions: false },
        databaseIntegration: { type: "none", features: [] },
        includeProductImages: false,
        productImageCount: 0
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
        title: "معلومات ناقصة",
        description: "يرجى ملء اسم التطبيق والوصف.",
        variant: "destructive",
      });
      return;
    }

    // Validate icon upload if selected
    if (appData.iconType === "uploaded" && !appData.iconFile) {
      toast({
        title: "أيقونة مطلوبة",
        description: "يرجى رفع ملف الأيقونة أو اختيار التوليد بالذكاء الاصطناعي.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type and size if uploading
    if (appData.iconFile) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(appData.iconFile.type)) {
        toast({
          title: "نوع ملف غير مدعوم",
          description: "يرجى رفع ملف بصيغة PNG, JPG, JPEG أو WebP.",
          variant: "destructive",
        });
        return;
      }
      
      if (appData.iconFile.size > maxSize) {
        toast({
          title: "حجم الملف كبير جداً",
          description: "يرجى رفع ملف أصغر من 5 ميجابايت.",
          variant: "destructive",
        });
        return;
      }
    }

    // Prepare data for submission
    if (appData.iconType === "uploaded" && appData.iconFile) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('appName', appData.appName);
      formData.append('prompt', appData.prompt);
      formData.append('pages', JSON.stringify(appData.pages));
      formData.append('iconType', appData.iconType);
      formData.append('iconFile', appData.iconFile);
      formData.append('firebaseIntegration', JSON.stringify(appData.firebaseIntegration));
      formData.append('databaseIntegration', JSON.stringify(appData.databaseIntegration));
      formData.append('includeProductImages', appData.includeProductImages.toString());
      formData.append('productImageCount', appData.productImageCount.toString());
      
      generateAppMutation.mutate(formData);
    } else {
      // Use regular JSON for AI-generated icon
      const submitData = {
        ...appData,
        iconFile: null // Remove file object for JSON serialization
      };
      generateAppMutation.mutate(submitData);
    }
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
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* App Name */}
                    <div className="space-y-2">
                      <Label htmlFor="appName" className="text-lg font-semibold">اسم التطبيق</Label>
                      <Input
                        id="appName"
                        type="text"
                        placeholder="اسم تطبيقك الرائع"
                        value={appData.appName}
                        onChange={(e) => setAppData({ ...appData, appName: e.target.value })}
                        required
                        data-testid="input-app-name"
                        className="text-lg"
                      />
                    </div>

                    {/* App Icon Options */}
                    <div className="space-y-4 p-6 border border-border rounded-lg bg-muted/20">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        أيقونة التطبيق
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="ai-icon"
                            name="iconType"
                            value="ai_generated"
                            checked={appData.iconType === "ai_generated"}
                            onChange={(e) => setAppData({ ...appData, iconType: e.target.value })}
                            className="w-4 h-4"
                          />
                          <Label htmlFor="ai-icon" className="cursor-pointer">إنشاء أيقونة بالذكاء الاصطناعي</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="upload-icon"
                            name="iconType"
                            value="uploaded"
                            checked={appData.iconType === "uploaded"}
                            onChange={(e) => setAppData({ ...appData, iconType: e.target.value })}
                            className="w-4 h-4"
                          />
                          <Label htmlFor="upload-icon" className="cursor-pointer">رفع أيقونة مخصصة</Label>
                        </div>
                      </div>
                      {appData.iconType === "uploaded" && (
                        <div className="mt-4 space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAppData({ ...appData, iconFile: e.target.files?.[0] || null })}
                            className="cursor-pointer"
                            data-testid="input-icon-upload"
                          />
                          {appData.iconFile && (
                            <div className="flex items-center space-x-4 p-4 border border-border rounded-lg bg-background">
                              <div className="w-16 h-16 border border-border rounded-lg overflow-hidden">
                                <img
                                  src={URL.createObjectURL(appData.iconFile)}
                                  alt="معاينة الأيقونة"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{appData.iconFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(appData.iconFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setAppData({ ...appData, iconFile: null })}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">
                            يُنصح بحجم 512x512 بكسل أو أكبر لأفضل جودة (PNG, JPG, WebP - أقل من 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* App Pages */}
                    <div className="space-y-4 p-6 border border-border rounded-lg bg-muted/20">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        صفحات التطبيق
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        أضف صفحات التطبيق مع وصف تفصيلي لكل صفحة ليتم إنشاؤها بشكل احترافي
                      </p>
                      {appData.pages.map((page, index) => (
                        <div key={index} className="border border-border rounded-lg p-4 bg-background">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">صفحة {index + 1}</Label>
                              {appData.pages.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newPages = appData.pages.filter((_, i) => i !== index);
                                    setAppData({ ...appData, pages: newPages });
                                  }}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`page-title-${index}`}>عنوان الصفحة</Label>
                                <Input
                                  id={`page-title-${index}`}
                                  type="text"
                                  placeholder="مثل: الرئيسية، الملف الشخصي، الإعدادات"
                                  value={page.title}
                                  onChange={(e) => updatePage(index, 'title', e.target.value)}
                                  data-testid={`input-page-title-${index}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`page-desc-${index}`}>وصف الصفحة</Label>
                                <Textarea
                                  id={`page-desc-${index}`}
                                  placeholder="اكتب وصف تفصيلي لهذه الصفحة والمحتوى المطلوب فيها"
                                  value={page.description}
                                  onChange={(e) => updatePage(index, 'description', e.target.value)}
                                  data-testid={`input-page-description-${index}`}
                                  className="h-20"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addPage}
                        data-testid="button-add-page"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة صفحة جديدة
                      </Button>
                    </div>
                    
                    {/* AI Prompt */}
                    <div className="space-y-4 p-6 border border-border rounded-lg bg-muted/20">
                      <Label htmlFor="prompt" className="text-lg font-semibold flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        وصف التطبيق التفصيلي
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        اكتب وصفاً شاملاً لتطبيقك يتضمن الميزات، التصميم المطلوب، والوظائف الخاصة
                      </p>
                      <Textarea
                        id="prompt"
                        placeholder="مثال: أريد تطبيق تجارة إلكترونية يحتوي على كتالوج منتجات، سلة تسوق، نظام دفع، ملفات شخصية للمستخدمين. التصميم يجب أن يكون عصرياً باللون الأزرق والأبيض مع واجهة سهلة الاستخدام..."
                        value={appData.prompt}
                        onChange={(e) => setAppData({ ...appData, prompt: e.target.value })}
                        className="h-32"
                        required
                        data-testid="textarea-app-description"
                      />
                      <div className="text-xs text-muted-foreground">
                        كلما كان الوصف أكثر تفصيلاً، كان التطبيق المُولَّد أكثر دقة ومطابقة لتوقعاتك
                      </div>
                    </div>
                    
                    {/* Firebase Integration */}
                    <div className="space-y-4 p-6 border border-border rounded-lg bg-muted/20">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Cloud className="w-5 h-5" />
                        خدمات Firebase
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        اختر خدمات Firebase التي تريد دمجها في تطبيقك
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-background">
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
                          <div>
                            <Label htmlFor="firebase-auth" className="font-medium">المصادقة</Label>
                            <p className="text-xs text-muted-foreground">تسجيل الدخول والتسجيل</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-background">
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
                          <div>
                            <Label htmlFor="firebase-firestore" className="font-medium">قاعدة البيانات</Label>
                            <p className="text-xs text-muted-foreground">Firestore Database</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-background">
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
                          <div>
                            <Label htmlFor="firebase-storage" className="font-medium">التخزين السحابي</Label>
                            <p className="text-xs text-muted-foreground">رفع وحفظ الملفات</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-background">
                          <Checkbox
                            id="firebase-functions"
                            checked={appData.firebaseIntegration.cloudFunctions}
                            onCheckedChange={(checked) => 
                              setAppData({
                                ...appData,
                                firebaseIntegration: { 
                                  ...appData.firebaseIntegration, 
                                  cloudFunctions: checked as boolean 
                                }
                              })
                            }
                            data-testid="checkbox-firebase-functions"
                          />
                          <div>
                            <Label htmlFor="firebase-functions" className="font-medium">دوال السحابة</Label>
                            <p className="text-xs text-muted-foreground">معالجة البيانات في الخلفية</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Database Integration Options */}
                    <div className="space-y-4 p-6 border border-border rounded-lg bg-muted/20">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        خيارات قاعدة البيانات
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        اختر نوع قاعدة البيانات والميزات المطلوبة لتطبيقك
                      </p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="database-type">نوع قاعدة البيانات</Label>
                          <Select 
                            value={appData.databaseIntegration.type} 
                            onValueChange={(value) => 
                              setAppData({
                                ...appData,
                                databaseIntegration: { ...appData.databaseIntegration, type: value }
                              })
                            }
                          >
                            <SelectTrigger data-testid="select-database-type">
                              <SelectValue placeholder="اختر نوع قاعدة البيانات" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">بدون قاعدة بيانات</SelectItem>
                              <SelectItem value="firebase">Firebase Firestore</SelectItem>
                              <SelectItem value="supabase">Supabase</SelectItem>
                              <SelectItem value="mysql">MySQL</SelectItem>
                              <SelectItem value="postgresql">PostgreSQL</SelectItem>
                              <SelectItem value="mongodb">MongoDB</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {appData.databaseIntegration.type !== "none" && (
                          <div className="space-y-3">
                            <Label>الميزات المطلوبة</Label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { id: "authentication", label: "نظام المصادقة", desc: "تسجيل دخول المستخدمين" },
                                { id: "data_storage", label: "تخزين البيانات", desc: "حفظ بيانات التطبيق" },
                                { id: "real_time", label: "البيانات المباشرة", desc: "تحديث فوري للبيانات" },
                                { id: "analytics", label: "التحليلات", desc: "تتبع أداء التطبيق" }
                              ].map((feature) => (
                                <div key={feature.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg bg-background">
                                  <Checkbox
                                    id={`db-feature-${feature.id}`}
                                    checked={appData.databaseIntegration.features.includes(feature.id)}
                                    onCheckedChange={(checked) => {
                                      const newFeatures = checked 
                                        ? [...appData.databaseIntegration.features, feature.id]
                                        : appData.databaseIntegration.features.filter(f => f !== feature.id);
                                      setAppData({
                                        ...appData,
                                        databaseIntegration: { ...appData.databaseIntegration, features: newFeatures }
                                      });
                                    }}
                                    data-testid={`checkbox-db-${feature.id}`}
                                  />
                                  <div>
                                    <Label htmlFor={`db-feature-${feature.id}`} className="font-medium text-sm">
                                      {feature.label}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Images Generation */}
                    <div className="space-y-4 p-6 border border-border rounded-lg bg-muted/20">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        توليد صور المنتجات
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        هل تريد أن يولد الذكاء الاصطناعي صوراً مناسبة لمنتجات تطبيقك؟
                      </p>
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="include-product-images"
                          checked={appData.includeProductImages}
                          onCheckedChange={(checked) => 
                            setAppData({ 
                              ...appData, 
                              includeProductImages: checked,
                              productImageCount: checked ? 5 : 0
                            })
                          }
                          data-testid="switch-product-images"
                        />
                        <Label htmlFor="include-product-images" className="font-medium">
                          إنشاء صور منتجات تلقائياً
                        </Label>
                      </div>
                      
                      {appData.includeProductImages && (
                        <div className="space-y-3 mt-4 p-4 border border-border rounded-lg bg-background">
                          <Label htmlFor="product-count">عدد الصور المطلوبة</Label>
                          <div className="space-y-4">
                            <Slider
                              value={[appData.productImageCount]}
                              onValueChange={(value) => 
                                setAppData({ ...appData, productImageCount: value[0] })
                              }
                              max={20}
                              min={1}
                              step={1}
                              className="w-full"
                              data-testid="slider-product-count"
                            />
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">1 صورة</span>
                              <Badge variant="secondary" className="px-3 py-1">
                                {appData.productImageCount} صورة
                              </Badge>
                              <span className="text-muted-foreground">20 صورة</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            سيتم إنشاء صور منتجات متنوعة ومناسبة لنوع تطبيقك
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={generateAppMutation.isPending}
                      data-testid="button-generate-app"
                      className="w-full text-lg py-6"
                    >
                      {generateAppMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          جاري إنشاء التطبيق...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          إنشاء تطبيق Android احترافي
                        </div>
                      )}
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
