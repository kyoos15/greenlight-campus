import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BuildingData {
  building: string;
  currentUsage: number;
  maxUsage: number;
  trend: 'up' | 'down' | 'stable';
  sustainabilityScore: number;
  status: 'normal' | 'warning' | 'critical';
}

interface ChartDataPoint {
  time: string;
  usage: number;
  optimal: number;
}

interface InsightData {
  id: number;
  building_id?: number;
  insight_type: string;
  title: string;
  description: string;
  priority: string;
  potential_savings?: number;
}

interface DashboardStats {
  totalUsage: number;
  connectedBuildings: number;
  avgSustainabilityScore: number;
}

interface DashboardData {
  buildings: BuildingData[];
  chartData: ChartDataPoint[];
  insights: InsightData[];
  stats: DashboardStats;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: response, error } = await supabase.functions.invoke('get-dashboard-data');
      
      if (error) throw error;
      
      setData(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('seed-energy-data');
      
      if (error) throw error;
      
      // Refresh dashboard data after seeding
      await fetchDashboardData();
    } catch (err) {
      console.error('Error seeding data:', err);
      setError(err instanceof Error ? err.message : 'Failed to seed data');
    }
  };

  const runMLPredictions = async () => {
    try {
      const { error } = await supabase.functions.invoke('energy-ml-prediction');
      
      if (error) throw error;
      
      // Refresh dashboard data after predictions
      await fetchDashboardData();
    } catch (err) {
      console.error('Error running ML predictions:', err);
      setError(err instanceof Error ? err.message : 'Failed to run ML predictions');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription for energy data updates
    const subscription = supabase
      .channel('energy-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'energy_consumption'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
    seedData,
    runMLPredictions
  };
};