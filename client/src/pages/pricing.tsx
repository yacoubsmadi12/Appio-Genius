import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/mo",
      description: "Perfect for individuals",
      features: [
        "5 app generations/month",
        "Basic templates",
        "Firebase integration",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      description: "For serious developers",
      features: [
        "25 app generations/month",
        "Advanced templates",
        "Custom branding",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Team",
      price: "$99",
      period: "/mo",
      description: "For small teams",
      features: [
        "100 app generations/month",
        "Team collaboration",
        "Advanced analytics",
        "24/7 support"
      ],
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited generations",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your needs. All plans include AI generation and Firebase integration.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-2 border-primary' : 'border border-border'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-lg text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground' : ''}`}
                  variant={plan.popular ? 'default' : plan.name === 'Enterprise' ? 'outline' : 'default'}
                  data-testid={`button-choose-${plan.name.toLowerCase()}`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
