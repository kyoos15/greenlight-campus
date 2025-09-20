import Header from "@/components/Header";
import QuickStats from "@/components/QuickStats";
import EnergyChart from "@/components/EnergyChart";
import EnergyCard from "@/components/EnergyCard";
import AIInsights from "@/components/AIInsights";
import FeatureNavigation from "@/components/FeatureNavigation";
import VoiceMessenger from "@/components/VoiceMessenger";
import EnergyForecasting from "@/components/EnergyForecasting";
import WaterManagement from "@/components/WaterManagement";
import AirQualityMonitoring from "@/components/AirQualityMonitoring";
import OccupancySensors from "@/components/OccupancySensors";
import heroImage from "@/assets/dashboard-hero.jpg";
import { useState } from "react";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState("dashboard");
  
  const buildings = [
    {
      building: "Academic Block A",
      currentUsage: 124.5,
      maxUsage: 150,
      trend: "up" as const,
      sustainabilityScore: 82,
      status: "warning" as const
    },
    {
      building: "Engineering Lab",
      currentUsage: 89.2,
      maxUsage: 120,
      trend: "down" as const,
      sustainabilityScore: 91,
      status: "normal" as const
    },
    {
      building: "Hostel Block C",
      currentUsage: 156.8,
      maxUsage: 200,
      trend: "stable" as const,
      sustainabilityScore: 95,
      status: "normal" as const
    },
    {
      building: "Admin Building",
      currentUsage: 187.3,
      maxUsage: 180,
      trend: "up" as const,
      sustainabilityScore: 67,
      status: "critical" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Smart Campus Energy Management" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Smart Energy Management for Your Campus
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Monitor, analyze, and optimize energy consumption across your entire campus with AI-powered insights and real-time data visualization.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-primary-foreground font-semibold">847.2 kWh</span>
                <span className="text-primary-foreground/80 ml-2">Live Usage</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-primary-foreground font-semibold">12 Buildings</span>
                <span className="text-primary-foreground/80 ml-2">Connected</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-primary-foreground font-semibold">87/100</span>
                <span className="text-primary-foreground/80 ml-2">Efficiency Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Feature Navigation */}
        <FeatureNavigation 
          activeFeature={activeFeature}
          onFeatureChange={setActiveFeature}
        />

        {/* Render Different Features Based on Selection */}
        {activeFeature === "dashboard" && (
          <>
            {/* Quick Stats */}
            <QuickStats />

            {/* Energy Chart */}
            <EnergyChart />

            {/* Building Cards and AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Building Energy Status</h2>
                  <p className="text-muted-foreground">Real-time monitoring and sustainability scores for all campus buildings</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buildings.map((building, index) => (
                    <EnergyCard key={index} {...building} />
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <AIInsights />
              </div>
            </div>
          </>
        )}

        {activeFeature === "voice" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EnergyChart />
            </div>
            <div className="lg:col-span-1">
              <VoiceMessenger />
            </div>
          </div>
        )}

        {activeFeature === "forecasting" && <EnergyForecasting />}
        
        {activeFeature === "water" && <WaterManagement />}
        
        {activeFeature === "air" && <AirQualityMonitoring />}
        
        {activeFeature === "occupancy" && <OccupancySensors />}
      </div>
    </div>
  );
};

export default Index;
