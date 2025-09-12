import { Card, CardContent } from "@/components/ui/card";
import { Check, Users, Code, Award } from "lucide-react";

export default function About() {
  const stats = [
    {
      icon: <Check className="w-8 h-8 text-white" />,
      number: "10,000+",
      label: "Apps Generated",
      color: "bg-green-500"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      number: "5,000+",
      label: "Happy Developers", 
      color: "bg-blue-500"
    },
    {
      icon: <Code className="w-8 h-8 text-white" />,
      number: "99%",
      label: "Code Quality Score",
      color: "bg-purple-500"
    }
  ];

  const team = [
    {
      name: "Yacoub Al-Smadi",
      role: "CEO & Founder",
      image: "https://i.postimg.cc/zfrdSMNb/Whats-App-Image-2025-02-19-at-2-05-33-PM.jpg"
    },
    {
      name: "Mohd Al-Rawashdeh", 
      role: "CTO",
      image: "https://i.postimg.cc/VNcwTM2S/Whats-App-Image-2025-09-12-at-19-03-04.jpg"
    },
    {
      name: "Rabie Otoum",
      role: "Lead AI Engineer", 
      image: "https://i.postimg.cc/bvHPjrjm/Whats-App-Image-2025-09-12-at-19-21-04.jpg"
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">About Appio Genius</h1>
            <p className="text-xl text-muted-foreground">
              We're revolutionizing mobile app development by making it accessible to everyone through the power of AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern tech workspace with mobile development" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                We believe that great app ideas shouldn't be limited by coding expertise. Our AI-powered platform 
                transforms your concepts into production-ready Android applications, complete with modern architecture 
                and best practices.
              </p>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-lg">{stat.number}</span>
                      <span className="text-muted-foreground ml-2">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center border border-border">
                  <CardContent className="pt-6">
                    <img 
                      src={member.image} 
                      alt={`${member.name} headshot`} 
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
