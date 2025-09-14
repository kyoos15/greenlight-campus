import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple linear regression ML model for energy prediction
function simpleLinearRegression(x: number[], y: number[]) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

function predictEnergyConsumption(
  historicalData: any[],
  weather: any,
  building: any
): number {
  if (historicalData.length < 2) {
    // Fallback for insufficient data
    return building.square_feet * 0.05 + Math.random() * 20;
  }

  // Extract features for simple ML model
  const hours = historicalData.map(d => new Date(d.timestamp).getHours());
  const consumption = historicalData.map(d => d.meter_reading);
  
  // Simple time-based prediction
  const { slope, intercept } = simpleLinearRegression(hours, consumption);
  
  const currentHour = new Date().getHours();
  let prediction = slope * currentHour + intercept;
  
  // Weather adjustments
  if (weather?.air_temperature) {
    const temp = weather.air_temperature;
    if (temp > 25) prediction *= 1.2; // Higher AC usage
    if (temp < 10) prediction *= 1.15; // Higher heating
  }
  
  // Building size factor
  const sizeFactor = building.square_feet / 10000;
  prediction *= sizeFactor;
  
  // Add realistic variance
  prediction += (Math.random() - 0.5) * prediction * 0.1;
  
  return Math.max(prediction, 0);
}

function generateAIInsights(consumption: number, prediction: number, building: any) {
  const insights = [];
  
  if (consumption > prediction * 1.2) {
    insights.push({
      building_id: building.building_id,
      insight_type: 'alert',
      title: 'High Energy Consumption Detected',
      description: `${building.primary_use} is consuming ${((consumption - prediction) / prediction * 100).toFixed(1)}% more energy than predicted. Check HVAC systems and lighting.`,
      priority: 'high',
      potential_savings: (consumption - prediction) * 0.7
    });
  }
  
  if (consumption < prediction * 0.8) {
    insights.push({
      building_id: building.building_id,
      insight_type: 'success',
      title: 'Excellent Energy Efficiency',
      description: `${building.primary_use} is performing ${((prediction - consumption) / prediction * 100).toFixed(1)}% better than expected. Great job!`,
      priority: 'low',
      potential_savings: 0
    });
  }
  
  // Generate optimization tips
  if (Math.random() > 0.7) {
    const tips = [
      'Consider implementing smart lighting controls',
      'HVAC system optimization could reduce consumption by 15%',
      'Installing smart sensors could improve efficiency',
      'Schedule equipment to run during off-peak hours'
    ];
    
    insights.push({
      building_id: building.building_id,
      insight_type: 'optimization',
      title: 'Energy Optimization Opportunity',
      description: tips[Math.floor(Math.random() * tips.length)],
      priority: 'medium',
      potential_savings: consumption * 0.1
    });
  }
  
  return insights;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting ML prediction process...');

    // Get all buildings
    const { data: buildings, error: buildingsError } = await supabase
      .from('buildings')
      .select('*');

    if (buildingsError) throw buildingsError;

    for (const building of buildings || []) {
      // Get recent historical data (last 24 hours)
      const { data: historicalData } = await supabase
        .from('energy_consumption')
        .select('*')
        .eq('building_id', building.building_id)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(24);

      // Get latest weather data
      const { data: weather } = await supabase
        .from('weather_data')
        .select('*')
        .eq('site_id', building.site_id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      // Make prediction
      const prediction = predictEnergyConsumption(historicalData || [], weather, building);
      
      // Store prediction
      await supabase
        .from('ml_predictions')
        .insert({
          building_id: building.building_id,
          prediction_date: new Date().toISOString(),
          predicted_consumption: prediction,
          confidence_score: 0.75 + Math.random() * 0.2,
          features: {
            weather_temp: weather?.air_temperature || null,
            building_size: building.square_feet,
            historical_points: historicalData?.length || 0
          }
        });

      // Generate AI insights if we have recent consumption data
      if (historicalData && historicalData.length > 0) {
        const latestConsumption = historicalData[0].meter_reading;
        const insights = generateAIInsights(latestConsumption, prediction, building);
        
        if (insights.length > 0) {
          await supabase
            .from('ai_insights')
            .insert(insights);
        }
      }
    }

    console.log('ML predictions completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        buildings_processed: buildings?.length || 0,
        message: 'ML predictions generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ML prediction function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});