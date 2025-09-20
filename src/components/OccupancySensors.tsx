import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Lightbulb, Thermometer, Timer, MapPin, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const occupancyData = [
  { time: "6:00", occupancy: 5, hvac: 20, lighting: 15 },
  { time: "8:00", occupancy: 45, hvac: 60, lighting: 80 },
  { time: "10:00", occupancy: 78, hvac: 85, lighting: 95 },
  { time: "12:00", occupancy: 85, hvac: 90, lighting: 100 },
  { time: "14:00", occupancy: 70, hvac: 80, lighting: 85 },
  { time: "16:00", occupancy: 60, hvac: 70, lighting: 75 },
  { time: "18:00", occupancy: 25, hvac: 40, lighting: 35 },
  { time: "20:00", occupancy: 10, hvac: 25, lighting: 20 },
];

const roomStatus = [
  {
    room: "Lecture Hall A1",
    building: "Academic Block A",
    capacity: 120,
    currentOccupancy: 78,
    motionDetected: true,
    temperature: 24,
    lightingLevel: 85,
    nextScheduled: "2:00 PM - Physics Lecture",
    energySaving: 0
  },
  {
    room: "Lab Room B2", 
    building: "Engineering Lab",
    capacity: 30,
    currentOccupancy: 12,
    motionDetected: true,
    temperature: 22,
    lightingLevel: 60,
    nextScheduled: "4:00 PM - Workshop",
    energySaving: 15
  },
  {
    room: "Conference Room C1",
    building: "Admin Building", 
    capacity: 20,
    currentOccupancy: 0,
    motionDetected: false,
    temperature: 20,
    lightingLevel: 0,
    nextScheduled: "Tomorrow 9:00 AM",
    energySaving: 45
  },
  {
    room: "Study Hall D1",
    building: "Library",
    capacity: 80,
    currentOccupancy: 23,
    motionDetected: true,
    temperature: 23,
    lightingLevel: 70,
    nextScheduled: "Open Access",
    energySaving: 25
  }
];

const automationRules = [
  {
    id: 1,
    name: "Auto Light Dimming",
    description: "Reduce lighting by 50% when occupancy < 30%",
    status: "active",
    energySaved: "12%",
    trigger: "Low occupancy"
  },
  {
    id: 2,
    name: "HVAC Sleep Mode",
    description: "Set temperature to 18°C when no motion for 30min",
    status: "active", 
    energySaved: "18%",
    trigger: "No motion detected"
  },
  {
    id: 3,
    name: "Weekend Power Down",
    description: "Automatic shutdown on weekends except security areas",
    status: "scheduled",
    energySaved: "35%",
    trigger: "Calendar-based"
  },
  {
    id: 4,
    name: "Peak Hour Optimization",
    description: "Pre-cool rooms 30min before scheduled events",
    status: "active",
    energySaved: "8%",
    trigger: "Schedule-based"
  }
];

const getOccupancyLevel = (current: number, capacity: number) => {
  const percentage = (current / capacity) * 100;
  if (percentage >= 80) return { level: "high", color: "text-energy-high" };
  if (percentage >= 50) return { level: "medium", color: "text-energy-medium" };
  if (percentage >= 20) return { level: "low", color: "text-primary" };
  return { level: "empty", color: "text-muted-foreground" };
};

const OccupancySensors = () => {
  const totalCapacity = roomStatus.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupancy = roomStatus.reduce((sum, room) => sum + room.currentOccupancy, 0);
  const avgEnergySaving = Math.round(roomStatus.reduce((sum, room) => sum + room.energySaving, 0) / roomStatus.length);
  const activeRooms = roomStatus.filter(room => room.motionDetected).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Occupancy</p>
                <p className="text-xl font-bold">{totalOccupancy}/{totalCapacity}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((totalOccupancy / totalCapacity) * 100)}% utilized
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Active Rooms</p>
                <p className="text-xl font-bold">{activeRooms}/4</p>
                <p className="text-xs text-success">Motion detected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Energy Saved</p>
                <p className="text-xl font-bold">{avgEnergySaving}%</p>
                <p className="text-xs text-accent">Smart automation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-energy-medium" />
              <div>
                <p className="text-sm text-muted-foreground">Auto Rules</p>
                <p className="text-xl font-bold">4</p>
                <p className="text-xs text-energy-medium">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Occupancy & Energy Usage</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time correlation between occupancy and energy consumption
          </p>
        </CardHeader>
        
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={occupancyData}>
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
                  `${value}%`,
                  name === 'occupancy' ? 'Occupancy' : 
                  name === 'hvac' ? 'HVAC Usage' : 'Lighting Usage'
                ]}
              />
              <Bar dataKey="occupancy" fill="hsl(var(--primary))" name="occupancy" />
              <Bar dataKey="hvac" fill="hsl(var(--secondary))" name="hvac" />
              <Bar dataKey="lighting" fill="hsl(var(--accent))" name="lighting" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Room Status */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Room Status</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {roomStatus.map((room, index) => {
              const occupancyLevel = getOccupancyLevel(room.currentOccupancy, room.capacity);
              return (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{room.room}</h4>
                        <p className="text-sm text-muted-foreground">{room.building}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary"
                        className={`${occupancyLevel.color.replace('text-', 'bg-')}/10 ${occupancyLevel.color}`}
                      >
                        {occupancyLevel.level}
                      </Badge>
                      {room.motionDetected && (
                        <Badge className="bg-success/10 text-success">
                          <Activity className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      {room.energySaving > 0 && (
                        <Badge className="bg-accent/10 text-accent">
                          -{room.energySaving}% energy
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Occupancy</span>
                        <span>{room.currentOccupancy}/{room.capacity}</span>
                      </div>
                      <Progress 
                        value={(room.currentOccupancy / room.capacity) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Temperature</span>
                        <span>{room.temperature}°C</span>
                      </div>
                      <Progress 
                        value={((room.temperature - 15) / 15) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lighting</span>
                        <span>{room.lightingLevel}%</span>
                      </div>
                      <Progress 
                        value={room.lightingLevel} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Timer className="w-4 h-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-muted-foreground">Next:</p>
                        <p className="font-medium">{room.nextScheduled}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Automation Rules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Intelligent energy optimization based on occupancy patterns
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{rule.name}</h4>
                      <Badge 
                        variant="secondary"
                        className={
                          rule.status === "active" ? "bg-success/10 text-success" :
                          rule.status === "scheduled" ? "bg-energy-medium/10 text-energy-medium" :
                          "bg-muted/50 text-muted-foreground"
                        }
                      >
                        {rule.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-success">
                        Energy Saved: {rule.energySaved}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Trigger: {rule.trigger}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                    <Button 
                      size="sm" 
                      variant={rule.status === "active" ? "secondary" : "default"}
                    >
                      {rule.status === "active" ? "Pause" : "Activate"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OccupancySensors;