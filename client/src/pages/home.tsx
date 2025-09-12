import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Code, Smartphone, Download, History, Zap } from "lucide-react";

interface HomeProps {
  onShowAuthModal: (mode: 'login' | 'signup') => void;
}

export default function Home({ onShowAuthModal }: HomeProps) {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "AI-Powered Generation",
      description: "Advanced AI understands your requirements and generates complete Android projects with modern Kotlin and Jetpack Compose.",
      gradient: "from-purple-600 to-blue-600"
    },
    {
      icon: <Code className="w-6 h-6 text-white" />,
      title: "Modern Architecture",
      description: "Generated apps follow Android best practices with MVVM pattern, Room database, and clean architecture principles.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Firebase Integration",
      description: "Automatic Firebase setup for authentication, Firestore database, and cloud storage with complete implementation.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-white" />,
      title: "Responsive Design",
      description: "All generated apps are responsive and work perfectly across different Android screen sizes and orientations.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Download className="w-6 h-6 text-white" />,
      title: "Instant Download",
      description: "Get your complete Android Studio project as a ZIP file, ready to import and start customizing immediately.",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: <History className="w-6 h-6 text-white" />,
      title: "Project History",
      description: "Access all your previously generated projects from your dashboard and download them anytime.",
      gradient: "from-red-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "20px 20px"
          }}
        />
        
        <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                ✨ AI-Powered Android Development
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Generate Complete<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Android Apps
              </span><br />
              in Minutes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto">
              Transform your app ideas into fully functional Android Studio projects with AI. 
              Just describe your app, and we'll generate complete Kotlin + Jetpack Compose code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg"
                onClick={() => onShowAuthModal('signup')}
                data-testid="button-start-building"
              >
                Start Building Free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
                data-testid="button-watch-demo"
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Google Ads Placeholder */}
            <div className="mt-12 p-4 border-2 border-dashed border-white/30 rounded-lg" data-testid="hero-ad-space">
              <p className="text-white/60 text-sm">Advertisement Space</p>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything You Need to Build Android Apps</h2>
            <p className="text-xl text-muted-foreground">
              From concept to code, our AI generates production-ready Android applications with modern architecture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow border border-border">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
