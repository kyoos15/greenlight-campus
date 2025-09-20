import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wind, Droplets as Humidity, Zap, Leaf, AlertCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const airQualityData = [
  { time: "00:00", co2: 420, humidity: 45, voc: 0.3, aqi: 85 },
  { time: "04:00", co2: 380, humidity: 48, voc: 0.2, aqi: 92 },
  { time: "08:00", co2: 650, humidity: 52, voc: 0.8, aqi: 68 },
  { time: "12:00", co2: 720, humidity: 58, voc: 1.2, aqi: 62 },
  { time: "16:00", co2: 680, humidity: 55, voc: 0.9, aqi: 65 },
  { time: "20:00", co2: 580, humidity: 50, voc: 0.6, aqi: 75 },
];

const buildingAirQuality = [
  {
    building: "Academic Block A",
    co2: 680,
    humidity: 52,
    voc: 0.8,
    aqi: 65,
    status: "fair",
    recommendation: "Increase ventilation rate by 20%"
  },
  {
    building: "Engineering Lab", 
    co2: 420,
    humidity: 45,
    voc: 0.3,
    aqi: 88,
    status: "good",
    recommendation: "Maintain current settings"
  },
  {
    building: "Hostel Block C",
    co2: 750,
    humidity: 62,
    voc: 1.4,
    voc_warning: true,
    aqi: 58,
    status: "poor",
    recommendation: "Immediate ventilation increase needed"
  },
  {
    building: "Admin Building",
    co2: 520,
    humidity: 48,
    voc: 0.5,
    aqi: 78,
    status: "good",
    recommendation: "Reduce HVAC load during low occupancy"
  }
];

const energyTips = [
  {
    title: "Smart Ventilation Control",
    description: "Reduce ventilation when CO₂ levels are optimal",
    savings: "15% HVAC energy",
    impact: "high"
  },
  {
    title: "Humidity-Based AC Control", 
    description: "Optimize AC operation based on humidity levels",
    savings: "12% cooling energy",
    impact: "medium"
  },
  {
    title: "VOC-Triggered Air Purification",
    description: "Activate air purifiers only when VOC levels rise",
    savings: "8% air quality systems",
    impact: "medium"
  }
];

const getAQIStatus = (aqi: number) => {
  if (aqi >= 80) return { status: "excellent", color: "text-success" };
  if (aqi >= 60) return { status: "good", color: "text-primary" };
  if (aqi >= 40) return { status: "fair", color: "text-energy-medium" };
  return { status: "poor", color: "text-energy-high" };
};

const getCO2Status = (co2: number) => {
  if (co2 <= 400) return "excellent";
  if (co2 <= 600) return "good";
  if (co2 <= 800) return "fair";
  return "poor";
};

const AirQualityMonitoring = () => {
  const avgCO2 = Math.round(buildingAirQuality.reduce((sum, b) => sum + b.co2, 0) / buildingAirQuality.length);
  const avgHumidity = Math.round(buildingAirQuality.reduce((sum, b) => sum + b.humidity, 0) / buildingAirQuality.length);
  const avgAQI = Math.round(buildingAirQuality.reduce((sum, b) => sum + b.aqi, 0) / buildingAirQuality.length);
  const vocAlerts = buildingAirQuality.filter(b => b.voc_warning).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wind className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg CO₂</p>
                <p className="text-xl font-bold">{avgCO2} ppm</p>
                <Badge 
                  variant="secondary"
                  className={
                    getCO2Status(avgCO2) === "excellent" ? "bg-success/10 text-success" :
                    getCO2Status(avgCO2) === "good" ? "bg-primary/10 text-primary" :
                    getCO2Status(avgCO2) === "fair" ? "bg-energy-medium/10 text-energy-medium" :
                    "bg-energy-high/10 text-energy-high"
                  }
                >
                  {getCO2Status(avgCO2)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Humidity className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-xl font-bold">{avgHumidity}%</p>
                <p className="text-xs text-muted-foreground">Optimal: 40-60%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Air Quality</p>
                <p className="text-xl font-bold">{avgAQI}/100</p>
                <Badge 
                  variant="secondary"
                  className={`${getAQIStatus(avgAQI).color.replace('text-', 'bg-')}/10 ${getAQIStatus(avgAQI).color}`}
                >
                  {getAQIStatus(avgAQI).status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-energy-medium" />
              <div>
                <p className="text-sm text-muted-foreground">VOC Alerts</p>
                <p className="text-xl font-bold">{vocAlerts}</p>
                <p className="text-xs text-energy-medium">
                  {vocAlerts > 0 ? "Action needed" : "All clear"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Air Quality Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Air Quality Trends</CardTitle>
          <p className="text-sm text-muted-foreground">
            24-hour environmental monitoring
          </p>
        </CardHeader>
        
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={airQualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line
                type="monotone"
                dataKey="co2"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="CO₂ (ppm)"
              />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                name="Air Quality Index"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Building Status */}
      <Card>
        <CardHeader>
          <CardTitle>Building Air Quality Status</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {buildingAirQuality.map((building, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Wind className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">{building.building}</h4>
                      <p className="text-sm text-muted-foreground">{building.recommendation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary"
                      className={`${getAQIStatus(building.aqi).color.replace('text-', 'bg-')}/10 ${getAQIStatus(building.aqi).color}`}
                    >
                      AQI: {building.aqi}
                    </Badge>
                    {building.voc_warning && (
                      <Badge variant="destructive">
                        VOC Alert
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CO₂ Level</span>
                      <span>{building.co2} ppm</span>
                    </div>
                    <Progress 
                      value={Math.min((building.co2 / 1000) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Humidity</span>
                      <span>{building.humidity}%</span>
                    </div>
                    <Progress 
                      value={building.humidity} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>VOC Level</span>
                      <span>{building.voc} mg/m³</span>
                    </div>
                    <Progress 
                      value={Math.min((building.voc / 2) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Energy Saving Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-accent" />
            <span>Energy-Saving Air Quality Tips</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {energyTips.map((tip, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-success">
                        Savings: {tip.savings}
                      </span>
                      <Badge 
                        variant="secondary"
                        className={
                          tip.impact === "high" ? "bg-success/10 text-success" :
                          "bg-energy-medium/10 text-energy-medium"
                        }
                      >
                        {tip.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirQualityMonitoring;