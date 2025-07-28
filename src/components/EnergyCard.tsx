import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface EnergyCardProps {
  building: string;
  currentUsage: number;
  maxUsage: number;
  trend: "up" | "down" | "stable";
  sustainabilityScore: number;
  status: "normal" | "warning" | "critical";
}

const EnergyCard = ({ 
  building, 
  currentUsage, 
  maxUsage, 
  trend, 
  sustainabilityScore,
  status 
}: EnergyCardProps) => {
  const usagePercentage = (currentUsage / maxUsage) * 100;
  
  const getStatusColor = () => {
    switch (status) {
      case "critical": return "text-energy-high";
      case "warning": return "text-energy-medium";
      default: return "text-energy-low";
    }
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case "critical": return <Badge variant="destructive">Critical</Badge>;
      case "warning": return <Badge className="bg-warning/10 text-warning-foreground">Warning</Badge>;
      default: return <Badge className="bg-success/10 text-success-foreground">Normal</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-green transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{building}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{currentUsage.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">kWh current usage</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {trend === "up" && <TrendingUp className="w-4 h-4 text-energy-high" />}
            {trend === "down" && <TrendingDown className="w-4 h-4 text-energy-low" />}
            {status === "critical" && <AlertTriangle className="w-4 h-4 text-energy-high" />}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usage</span>
            <span className={getStatusColor()}>{usagePercentage.toFixed(0)}%</span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-2"
          />
        </div>
        
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sustainability Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-success flex items-center justify-center text-xs font-bold text-white">
                {sustainabilityScore}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyCard;