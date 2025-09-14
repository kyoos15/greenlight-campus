-- Create buildings table
CREATE TABLE public.buildings (
  id SERIAL PRIMARY KEY,
  building_id INTEGER NOT NULL UNIQUE,
  site_id INTEGER NOT NULL,
  primary_use TEXT NOT NULL,
  square_feet NUMERIC NOT NULL,
  year_built INTEGER,
  floor_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weather data table
CREATE TABLE public.weather_data (
  id SERIAL PRIMARY KEY,
  site_id INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  air_temperature NUMERIC,
  cloud_coverage NUMERIC,
  dew_temperature NUMERIC,
  precip_depth_1_hr NUMERIC,
  sea_level_pressure NUMERIC,
  wind_direction NUMERIC,
  wind_speed NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create energy consumption table
CREATE TABLE public.energy_consumption (
  id SERIAL PRIMARY KEY,
  building_id INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  meter INTEGER NOT NULL, -- 0: electricity, 1: chilled water, 2: steam, 3: hot water
  meter_reading NUMERIC NOT NULL,
  predicted_reading NUMERIC,
  anomaly_score NUMERIC,
  sustainability_score INTEGER DEFAULT 75,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ML predictions table
CREATE TABLE public.ml_predictions (
  id SERIAL PRIMARY KEY,
  building_id INTEGER NOT NULL,
  prediction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  predicted_consumption NUMERIC NOT NULL,
  confidence_score NUMERIC DEFAULT 0.8,
  model_version TEXT DEFAULT 'v1.0',
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI insights table
CREATE TABLE public.ai_insights (
  id SERIAL PRIMARY KEY,
  building_id INTEGER,
  insight_type TEXT NOT NULL, -- 'optimization', 'alert', 'success'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL, -- 'high', 'medium', 'low'
  potential_savings NUMERIC,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is campus-wide data)
CREATE POLICY "Buildings are viewable by everyone" ON public.buildings FOR SELECT USING (true);
CREATE POLICY "Weather data is viewable by everyone" ON public.weather_data FOR SELECT USING (true);
CREATE POLICY "Energy consumption is viewable by everyone" ON public.energy_consumption FOR SELECT USING (true);
CREATE POLICY "ML predictions are viewable by everyone" ON public.ml_predictions FOR SELECT USING (true);
CREATE POLICY "AI insights are viewable by everyone" ON public.ai_insights FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_energy_consumption_building_timestamp ON public.energy_consumption(building_id, timestamp);
CREATE INDEX idx_weather_data_site_timestamp ON public.weather_data(site_id, timestamp);
CREATE INDEX idx_ml_predictions_building_date ON public.ml_predictions(building_id, prediction_date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_energy_consumption_updated_at BEFORE UPDATE ON public.energy_consumption FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON public.ai_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();