import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, TrendingDown, Droplets, Wind, Users } from "lucide-react";
import { useState } from "react";

interface FeatureNavigationProps {
  activeFeature: string;
  onFeatureChange: (feature: string) => void;
}

const features = [
  {
    id: "dashboard",
    name: "Main Dashboard",
    icon: <TrendingDown className="w-4 h-4" />,
    description: "Energy overview & insights",
    status: "active"
  },
  {
    id: "voice",
    name: "AI Voice Messenger",
    icon: <Volume2 className="w-4 h-4" />,
    description: "Smart alerts & notifications",
    status: "new",
    alerts: 2
  },
  {
    id: "forecasting",
    name: "Energy Forecasting",
    icon: <TrendingDown className="w-4 h-4" />,
    description: "Weather-based predictions",
    status: "active"
  },
  {
    id: "water",
    name: "Water Management",
    icon: <Droplets className="w-4 h-4" />,
    description: "Usage monitoring & leak detection",
    status: "active",
    alerts: 1
  },
  {
    id: "air",
    name: "Air Quality",
    icon: <Wind className="w-4 h-4" />,
    description: "CO₂, humidity & VOC monitoring",
    status: "active"
  },
  {
    id: "occupancy",
    name: "Smart Occupancy",
    icon: <Users className="w-4 h-4" />,
    description: "Motion sensors & automation",
    status: "active"
  }
];

const FeatureNavigation = ({ activeFeature, onFeatureChange }: FeatureNavigationProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <Button
              key={feature.id}
              variant={activeFeature === feature.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFeatureChange(feature.id)}
              className="flex items-center space-x-2 relative"
            >
              {feature.icon}
              <span>{feature.name}</span>
              {feature.status === "new" && (
                <Badge className="ml-2 bg-accent text-accent-foreground text-xs">
                  NEW
                </Badge>
              )}
              {feature.alerts && feature.alerts > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {feature.alerts}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="mt-3 text-sm text-muted-foreground">
          {features.find(f => f.id === activeFeature)?.description}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureNavigation;