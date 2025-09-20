import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Cloud, Sun, CloudRain, Snowflake, Calendar, Power, TrendingDown } from "lucide-react";

const forecastData = [
  { time: "Now", predicted: 847, actual: 847, weather: "sunny", temp: 28 },
  { time: "6h", predicted: 920, actual: null, weather: "cloudy", temp: 26 },
  { time: "12h", predicted: 850, actual: null, weather: "cloudy", temp: 24 },
  { time: "18h", predicted: 780, actual: null, weather: "rainy", temp: 22 },
  { time: "24h", predicted: 650, actual: null, weather: "rainy", temp: 20 },
  { time: "30h", predicted: 720, actual: null, weather: "sunny", temp: 25 },
  { time: "36h", predicted: 890, actual: null, weather: "sunny", temp: 29 },
];

const recommendations = [
  {
    id: 1,
    type: "weather",
    icon: <CloudRain className="w-4 h-4" />,
    title: "Rain Expected - AC Optimization",
    description: "Temperature dropping to 22°C. Reduce AC load by 15% in 6 hours.",
    savings: "45 kWh",
    priority: "high"
  },
  {
    id: 2,
    type: "calendar",
    icon: <Calendar className="w-4 h-4" />,
    title: "Weekend Mode Activation",
    description: "Switch to low power mode starting Friday 6 PM.",
    savings: "120 kWh",
    priority: "medium"
  },
  {
    id: 3,
    type: "optimization",
    icon: <Power className="w-4 h-4" />,
    title: "Peak Hour Preparation",
    description: "Pre-cool buildings before 2 PM peak hours.",
    savings: "67 kWh",
    priority: "low"
  }
];

const getWeatherIcon = (weather: string) => {
  switch (weather) {
    case "sunny": return <Sun className="w-4 h-4 text-yellow-500" />;
    case "cloudy": return <Cloud className="w-4 h-4 text-gray-500" />;
    case "rainy": return <CloudRain className="w-4 h-4 text-blue-500" />;
    case "snowy": return <Snowflake className="w-4 h-4 text-blue-300" />;
    default: return <Sun className="w-4 h-4" />;
  }
};

const EnergyForecasting = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            <span>Energy Forecasting</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-powered predictions with weather integration
          </p>
        </CardHeader>
        
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={forecastData}>
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
                formatter={(value, name) => [
                  `${value} kWh`,
                  name === 'predicted' ? 'Predicted' : 'Actual'
                ]}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
                strokeDasharray="5,5"
                name="Predicted Usage"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--success))"
                fill="hsl(var(--success) / 0.2)"
                strokeWidth={2}
                name="Actual Usage"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {forecastData.map((item, index) => (
              <div key={index} className="text-center p-2 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">{item.time}</div>
                <div className="flex justify-center mb-1">
                  {getWeatherIcon(item.weather)}
                </div>
                <div className="text-xs font-medium">{item.temp}°C</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smart Recommendations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Automated energy optimization suggestions
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-primary">
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary"
                  className={
                    rec.priority === "high" ? "bg-energy-high/10 text-energy-high" :
                    rec.priority === "medium" ? "bg-energy-medium/10 text-energy-medium" :
                    "bg-energy-low/10 text-energy-low"
                  }
                >
                  {rec.priority}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-success">
                    Potential Savings: {rec.savings}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Schedule
                  </Button>
                  <Button size="sm">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyForecasting;