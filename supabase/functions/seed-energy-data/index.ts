import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample building data inspired by ASHRAE dataset
const buildingData = [
  { building_id: 1, site_id: 1, primary_use: 'Academic Block A', square_feet: 15000, year_built: 2010, floor_count: 4 },
  { building_id: 2, site_id: 1, primary_use: 'Engineering Lab', square_feet: 12000, year_built: 2015, floor_count: 3 },
  { building_id: 3, site_id: 1, primary_use: 'Hostel Block C', square_feet: 20000, year_built: 2008, floor_count: 5 },
  { building_id: 4, site_id: 1, primary_use: 'Admin Building', square_feet: 8000, year_built: 2005, floor_count: 2 },
  { building_id: 5, site_id: 1, primary_use: 'Library', square_feet: 18000, year_built: 2012, floor_count: 4 },
  { building_id: 6, site_id: 1, primary_use: 'Sports Complex', square_feet: 25000, year_built: 2018, floor_count: 2 }
];

function generateWeatherData(startDate: Date, days: number) {
  const weather = [];
  for (let i = 0; i < days * 24; i++) {
    const timestamp = new Date(startDate.getTime() + i * 60 * 60 * 1000);
    const hour = timestamp.getHours();
    
    // Realistic temperature patterns
    const baseTemp = 22 + Math.sin((hour - 6) / 24 * Math.PI * 2) * 8;
    const seasonalVariation = Math.sin(timestamp.getMonth() / 12 * Math.PI * 2) * 5;
    
    weather.push({
      site_id: 1,
      timestamp: timestamp.toISOString(),
      air_temperature: baseTemp + seasonalVariation + (Math.random() - 0.5) * 4,
      cloud_coverage: Math.random() * 10,
      dew_temperature: baseTemp - 5 + (Math.random() - 0.5) * 3,
      precip_depth_1_hr: Math.random() > 0.9 ? Math.random() * 5 : 0,
      sea_level_pressure: 1013 + (Math.random() - 0.5) * 20,
      wind_direction: Math.random() * 360,
      wind_speed: Math.random() * 15
    });
  }
  return weather;
}

function generateEnergyData(buildings: any[], startDate: Date, days: number) {
  const energyData = [];
  
  for (const building of buildings) {
    for (let i = 0; i < days * 24; i++) {
      const timestamp = new Date(startDate.getTime() + i * 60 * 60 * 1000);
      const hour = timestamp.getHours();
      const dayOfWeek = timestamp.getDay();
      
      // Base consumption based on building size and type
      let baseConsumption = building.square_feet * 0.003;
      
      // Time-based patterns
      const hourlyPattern = building.primary_use.includes('Hostel') 
        ? [0.6, 0.5, 0.4, 0.4, 0.5, 0.7, 0.9, 1.0, 0.8, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7]
        : [0.3, 0.2, 0.2, 0.2, 0.3, 0.5, 0.8, 1.0, 1.2, 1.3, 1.2, 1.1, 1.0, 1.1, 1.2, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5, 0.4, 0.4, 0.3];
      
      baseConsumption *= hourlyPattern[hour];
      
      // Weekend reduction for academic buildings
      if ((dayOfWeek === 0 || dayOfWeek === 6) && !building.primary_use.includes('Hostel')) {
        baseConsumption *= 0.4;
      }
      
      // Add realistic variance and anomalies
      const variance = (Math.random() - 0.5) * 0.2;
      const anomaly = Math.random() > 0.95 ? 1.5 : 1; // 5% chance of anomaly
      
      const finalConsumption = baseConsumption * (1 + variance) * anomaly;
      
      // Generate data for different meter types (electricity, chilled water, etc.)
      for (let meter = 0; meter < 2; meter++) {
        let meterReading = finalConsumption;
        if (meter === 1) meterReading *= 0.3; // Chilled water is typically less
        
        energyData.push({
          building_id: building.building_id,
          timestamp: timestamp.toISOString(),
          meter: meter,
          meter_reading: Math.max(meterReading, 0),
          sustainability_score: Math.floor(70 + Math.random() * 25)
        });
      }
    }
  }
  
  return energyData;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting data seeding...');

    // Clear existing data
    await supabase.from('energy_consumption').delete().neq('id', 0);
    await supabase.from('weather_data').delete().neq('id', 0);
    await supabase.from('buildings').delete().neq('id', 0);

    // Insert buildings
    const { error: buildingsError } = await supabase
      .from('buildings')
      .insert(buildingData);

    if (buildingsError) throw buildingsError;

    // Generate and insert weather data (last 7 days)
    const weatherData = generateWeatherData(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 7);
    const { error: weatherError } = await supabase
      .from('weather_data')
      .insert(weatherData);

    if (weatherError) throw weatherError;

    // Generate and insert energy consumption data
    const energyData = generateEnergyData(buildingData, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 7);
    
    // Insert in batches to avoid timeouts
    const batchSize = 1000;
    for (let i = 0; i < energyData.length; i += batchSize) {
      const batch = energyData.slice(i, i + batchSize);
      const { error: energyError } = await supabase
        .from('energy_consumption')
        .insert(batch);
      
      if (energyError) throw energyError;
    }

    console.log('Data seeding completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        buildings: buildingData.length,
        weather_points: weatherData.length,
        energy_points: energyData.length,
        message: 'Sample energy data seeded successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in seed-energy-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});