import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ChartDataPoint {
  time: string;
  usage: number;
  optimal: number;
}

interface EnergyChartProps {
  data?: ChartDataPoint[];
}

const defaultData = [
  { time: "00:00", usage: 45, optimal: 40 },
  { time: "03:00", usage: 38, optimal: 35 },
  { time: "06:00", usage: 52, optimal: 48 },
  { time: "09:00", usage: 85, optimal: 78 },
  { time: "12:00", usage: 92, optimal: 85 },
  { time: "15:00", usage: 88, optimal: 82 },
  { time: "18:00", usage: 78, optimal: 75 },
  { time: "21:00", usage: 65, optimal: 60 },
];

const EnergyChart = ({ data }: EnergyChartProps) => {
  const chartData = data && data.length > 0 ? data : defaultData;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Energy Consumption</CardTitle>
        <p className="text-sm text-muted-foreground">
          24-hour campus energy usage vs optimal consumption
        </p>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
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
            <Area
              type="monotone"
              dataKey="optimal"
              stroke="hsl(var(--success))"
              fill="hsl(var(--success) / 0.1)"
              strokeWidth={2}
              name="Optimal Usage (kWh)"
            />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.2)"
              strokeWidth={2}
              name="Current Usage (kWh)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EnergyChart;