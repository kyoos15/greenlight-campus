import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, AlertTriangle, TrendingUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const mockAlerts = [
  {
    id: 1,
    type: "critical",
    building: "Admin Building",
    message: "Unusual energy spike detected. AC unit may be faulty.",
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    spoken: false
  },
  {
    id: 2,
    type: "warning", 
    building: "Lab Complex",
    message: "Equipment left running after hours detected.",
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    spoken: true
  }
];

const VoiceMessenger = () => {
  const [isListening, setIsListening] = useState(false);
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleVoiceAlert = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Alert from ${alert.building}: ${alert.message}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, spoken: true } : a
      ));
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  useEffect(() => {
    // Simulate new alert
    const timer = setTimeout(() => {
      const newAlert = {
        id: 3,
        type: "warning" as const,
        building: "Hostel Block B",
        message: "Water heater running at 15% above normal temperature.",
        timestamp: new Date(),
        spoken: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-primary" />
          <span>AI Voice Messenger</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time voice notifications for energy anomalies
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Mic className={`w-4 h-4 ${isListening ? 'text-success' : 'text-muted-foreground'}`} />
            <span className="text-sm font-medium">
              Voice Assistant {isListening ? 'Active' : 'Inactive'}
            </span>
          </div>
          <Button 
            size="sm" 
            variant={isListening ? "secondary" : "default"}
            onClick={toggleListening}
          >
            {isListening ? 'Disable' : 'Enable'}
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Recent Alerts</h4>
          {alerts.map((alert) => (
            <div key={alert.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {alert.type === 'critical' ? (
                    <AlertTriangle className="w-4 h-4 text-energy-high mt-0.5" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-energy-medium mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{alert.building}</span>
                      <Badge 
                        variant="secondary"
                        className={
                          alert.type === 'critical' 
                            ? "bg-energy-high/10 text-energy-high" 
                            : "bg-energy-medium/10 text-energy-medium"
                        }
                      >
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {alert.spoken && (
                    <Badge variant="outline" className="text-xs">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Announced
                    </Badge>
                  )}
                </div>
                {!alert.spoken && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleVoiceAlert(alert.id)}
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    Speak
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">AI Status: Monitoring</span>
          </div>
          <p className="text-xs text-success/80 mt-1">
            Analyzing 12 buildings • 847 data points/min
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceMessenger;