import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, AlertTriangle, Recycle, CheckCircle, MapPin } from "lucide-react";

const waterData = [
  {
    building: "Academic Block A",
    usage: 2456,
    target: 3000,
    efficiency: 82,
    status: "normal",
    leaks: 0,
    greywater: 45
  },
  {
    building: "Engineering Lab",
    usage: 1890,
    target: 2200,
    efficiency: 86,
    status: "excellent",
    leaks: 0,
    greywater: 38
  },
  {
    building: "Hostel Block C",
    usage: 4200,
    target: 3800,
    efficiency: 68,
    status: "warning",
    leaks: 1,
    greywater: 52
  },
  {
    building: "Admin Building",
    usage: 1200,
    target: 1500,
    efficiency: 91,
    status: "excellent",
    leaks: 0,
    greywater: 28
  }
];

const leakAlerts = [
  {
    id: 1,
    location: "Hostel Block C - Floor 2 Bathroom",
    severity: "medium",
    detected: "2 hours ago",
    flow: "2.3 L/min",
    estimated_loss: "276 L/day"
  }
];

const recyclingTips = [
  "Install greywater collection system in kitchen areas",
  "Use treated water for landscape irrigation",
  "Implement rainwater harvesting for non-potable uses",
  "Add flow restrictors to reduce water pressure"
];

const WaterManagement = () => {
  const totalUsage = waterData.reduce((sum, building) => sum + building.usage, 0);
  const totalTarget = waterData.reduce((sum, building) => sum + building.target, 0);
  const avgEfficiency = Math.round(waterData.reduce((sum, building) => sum + building.efficiency, 0) / waterData.length);
  const totalLeaks = waterData.reduce((sum, building) => sum + building.leaks, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-xl font-bold">{totalUsage.toLocaleString()}L</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-xl font-bold">{avgEfficiency}%</p>
                <p className="text-xs text-success">+3% vs yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-energy-medium" />
              <div>
                <p className="text-sm text-muted-foreground">Active Leaks</p>
                <p className="text-xl font-bold">{totalLeaks}</p>
                <p className="text-xs text-energy-medium">Requires attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Recycle className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Greywater</p>
                <p className="text-xl font-bold">41%</p>
                <p className="text-xs text-accent">Recycled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Building Water Status */}
      <Card>
        <CardHeader>
          <CardTitle>Building Water Usage</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring and efficiency tracking
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {waterData.map((building, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">{building.building}</h4>
                      <p className="text-sm text-muted-foreground">
                        {building.usage}L / {building.target}L target
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary"
                      className={
                        building.status === "excellent" ? "bg-success/10 text-success" :
                        building.status === "warning" ? "bg-energy-medium/10 text-energy-medium" :
                        "bg-primary/10 text-primary"
                      }
                    >
                      {building.status}
                    </Badge>
                    {building.leaks > 0 && (
                      <Badge variant="destructive">
                        {building.leaks} leak{building.leaks > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Water Efficiency</span>
                      <span>{building.efficiency}%</span>
                    </div>
                    <Progress value={building.efficiency} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Greywater Recycled:</span>
                      <span className="ml-2 font-medium">{building.greywater}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Usage vs Target:</span>
                      <span className={`ml-2 font-medium ${
                        building.usage > building.target ? 'text-energy-medium' : 'text-success'
                      }`}>
                        {((building.usage / building.target) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leak Detection */}
      {leakAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-energy-medium" />
              <span>Leak Detection Alerts</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {leakAlerts.map((leak) => (
                <div key={leak.id} className="border border-energy-medium/20 rounded-lg p-4 bg-energy-medium/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-energy-medium mt-1" />
                      <div>
                        <h4 className="font-medium text-foreground">{leak.location}</h4>
                        <p className="text-sm text-muted-foreground">
                          Flow rate: {leak.flow} • Estimated loss: {leak.estimated_loss}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Detected {leak.detected}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-energy-medium/10 text-energy-medium">
                      {leak.severity}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">
                      Dispatch Repair
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Greywater Recycling Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Recycle className="w-5 h-5 text-accent" />
            <span>Water Conservation Tips</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recyclingTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterManagement;