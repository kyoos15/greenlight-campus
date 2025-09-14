import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get buildings with latest energy data
    const { data: buildings, error: buildingsError } = await supabase
      .from('buildings')
      .select('*');

    if (buildingsError) throw buildingsError;

    // Get latest energy consumption for each building
    const buildingsWithData = await Promise.all(
      (buildings || []).map(async (building) => {
        // Get latest consumption data
        const { data: latestData } = await supabase
          .from('energy_consumption')
          .select('*')
          .eq('building_id', building.building_id)
          .eq('meter', 0) // Electricity meter
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        // Get 24-hour data for trend calculation
        const { data: trendData } = await supabase
          .from('energy_consumption')
          .select('meter_reading, timestamp')
          .eq('building_id', building.building_id)
          .eq('meter', 0)
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: true });

        // Calculate trend
        let trend = 'stable';
        if (trendData && trendData.length > 2) {
          const recent = trendData.slice(-3).reduce((sum, d) => sum + d.meter_reading, 0) / 3;
          const earlier = trendData.slice(0, 3).reduce((sum, d) => sum + d.meter_reading, 0) / 3;
          if (recent > earlier * 1.1) trend = 'up';
          else if (recent < earlier * 0.9) trend = 'down';
        }

        // Determine status based on consumption vs capacity
        const maxUsage = building.square_feet * 0.01; // Estimated max capacity
        const currentUsage = latestData?.meter_reading || 0;
        const usagePercent = (currentUsage / maxUsage) * 100;
        
        let status = 'normal';
        if (usagePercent > 90) status = 'critical';
        else if (usagePercent > 75) status = 'warning';

        return {
          building: building.primary_use,
          currentUsage: currentUsage,
          maxUsage: maxUsage,
          trend: trend as 'up' | 'down' | 'stable',
          sustainabilityScore: latestData?.sustainability_score || 75,
          status: status as 'normal' | 'warning' | 'critical'
        };
      })
    );

    // Get chart data (last 24 hours)
    const { data: chartData } = await supabase
      .from('energy_consumption')
      .select('timestamp, meter_reading, meter')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: true });

    // Process chart data - aggregate by hour
    const hourlyData = new Map();
    chartData?.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      const timeKey = String(hour).padStart(2, '0') + ':00';
      
      if (!hourlyData.has(timeKey)) {
        hourlyData.set(timeKey, { time: timeKey, usage: 0, count: 0 });
      }
      
      const existing = hourlyData.get(timeKey);
      existing.usage += record.meter_reading;
      existing.count += 1;
    });

    const processedChartData = Array.from(hourlyData.values()).map(item => ({
      time: item.time,
      usage: Math.round(item.usage / item.count),
      optimal: Math.round((item.usage / item.count) * 0.85) // 15% reduction target
    }));

    // Get AI insights
    const { data: insights } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate quick stats
    const totalUsage = buildingsWithData.reduce((sum, b) => sum + b.currentUsage, 0);
    const avgSustainabilityScore = Math.round(
      buildingsWithData.reduce((sum, b) => sum + b.sustainabilityScore, 0) / buildingsWithData.length
    );

    return new Response(
      JSON.stringify({
        buildings: buildingsWithData,
        chartData: processedChartData,
        insights: insights || [],
        stats: {
          totalUsage: Math.round(totalUsage),
          connectedBuildings: buildingsWithData.length,
          avgSustainabilityScore
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-dashboard-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});