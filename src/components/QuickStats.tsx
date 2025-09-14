import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Leaf, TrendingDown, Target } from "lucide-react";

interface DashboardStats {
  totalUsage: number;
  connectedBuildings: number;
  avgSustainabilityScore: number;
}

interface QuickStatsProps {
  data?: DashboardStats;
}

const QuickStats = ({ data }: QuickStatsProps) => {
  const stats = [
    {
      icon: <Zap className="w-6 h-6" />,
      label: "Total Campus Usage",
      value: data ? data.totalUsage.toString() : "0",
      unit: "kWh",
      change: "+5.2% from yesterday",
      trend: "up",
      color: "text-primary"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      label: "Carbon Footprint",
      value: data ? (data.totalUsage * 0.5).toFixed(1) : "0",
      unit: "kg CO₂",
      change: "-12% this week",
      trend: "down",
      color: "text-success"
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      label: "Energy Savings",
      value: data ? (data.totalUsage * 0.15).toFixed(1) : "0",
      unit: "kWh saved",
      change: "vs last month",
      trend: "down",
      color: "text-success"
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: "Efficiency Score",
      value: data ? data.avgSustainabilityScore.toString() : "0",
      unit: "/100",
      change: "Campus average",
      trend: "stable",
      color: "text-accent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-green transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-primary ${stat.color}`}>
                {stat.icon}
              </div>
              <Badge 
                variant="secondary" 
                className={
                  stat.trend === "down" ? "bg-success/10 text-success-foreground" :
                  stat.trend === "up" ? "bg-energy-medium/10 text-energy-medium" :
                  "bg-muted/50 text-muted-foreground"
                }
              >
                {stat.trend === "down" ? "↓" : stat.trend === "up" ? "↑" : "→"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.unit}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;