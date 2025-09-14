-- Fix security warning by updating function with proper search path
-- First drop triggers, then function, then recreate with proper search path

DROP TRIGGER IF EXISTS update_buildings_updated_at ON public.buildings;
DROP TRIGGER IF EXISTS update_energy_consumption_updated_at ON public.energy_consumption;
DROP TRIGGER IF EXISTS update_ai_insights_updated_at ON public.ai_insights;

DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate function with proper search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate triggers
CREATE TRIGGER update_buildings_updated_at 
BEFORE UPDATE ON public.buildings 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_energy_consumption_updated_at 
BEFORE UPDATE ON public.energy_consumption 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at 
BEFORE UPDATE ON public.ai_insights 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();