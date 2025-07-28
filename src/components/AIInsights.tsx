import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, AlertCircle, Clock } from "lucide-react";

const insights = [
  {
    id: 1,
    type: "optimization",
    title: "AC Optimization Opportunity",
    description: "Lecture Hall 2 AC running 15% above optimal temperature during low occupancy hours.",
    priority: "high",
    savings: "12 kWh/day",
    building: "Academic Block A"
  },
  {
    id: 2,
    type: "alert",
    title: "Equipment Running Overnight",
    description: "Projector in Lab 3 has been running for 8 hours with no activity detected.",
    priority: "medium",
    savings: "5 kWh/day",
    building: "Engineering Lab"
  },
  {
    id: 3,
    type: "success",
    title: "Great Progress!",
    description: "Hostel Block C achieved 20% energy reduction this week compared to last month.",
    priority: "low",
    savings: "45 kWh/week",
    building: "Hostel Block C"
  }
];

const AIInsights = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "optimization": return <Lightbulb className="w-4 h-4" />;
      case "alert": return <AlertCircle className="w-4 h-4" />;
      case "success": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-energy-high/10 text-energy-high";
      case "medium": return "bg-energy-medium/10 text-energy-medium";
      default: return "bg-energy-low/10 text-energy-low";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span>AI-Powered Insights</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{insight.building}</p>
                </div>
              </div>
              <Badge className={getPriorityColor(insight.priority)}>
                {insight.priority}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-success">
                  Potential Savings: {insight.savings}
                </span>
              </div>
              <Button size="sm" variant="outline">
                Apply Fix
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIInsights;