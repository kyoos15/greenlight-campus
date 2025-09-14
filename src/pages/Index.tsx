import Header from "@/components/Header";
import QuickStats from "@/components/QuickStats";
import EnergyChart from "@/components/EnergyChart";
import EnergyCard from "@/components/EnergyCard";
import AIInsights from "@/components/AIInsights";
import heroImage from "@/assets/dashboard-hero.jpg";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Brain } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { data, loading, error, refetch, seedData, runMLPredictions } = useDashboardData();

  const handleSeedData = async () => {
    toast.info("Seeding energy dataset...");
    await seedData();
    toast.success("Energy dataset seeded successfully!");
  };

  const handleRunML = async () => {
    toast.info("Running ML predictions...");
    await runMLPredictions();
    toast.success("ML predictions completed!");
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error: {error}</p>
          <Button onClick={handleSeedData} className="mr-2">
            <Database className="h-4 w-4 mr-2" />
            Seed Sample Data
          </Button>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                <span className="text-primary-foreground font-semibold">
                  {data?.stats.totalUsage || 0} kWh
                </span>
                <span className="text-primary-foreground/80 ml-2">Live Usage</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-primary-foreground font-semibold">
                  {data?.stats.connectedBuildings || 0} Buildings
                </span>
                <span className="text-primary-foreground/80 ml-2">Connected</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-primary-foreground font-semibold">
                  {data?.stats.avgSustainabilityScore || 0}/100
                </span>
                <span className="text-primary-foreground/80 ml-2">Efficiency Score</span>
              </div>
            </div>
            
            {/* Data Management Controls */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Button 
                onClick={handleSeedData} 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/20"
              >
                <Database className="h-4 w-4 mr-2" />
                Seed Data
              </Button>
              <Button 
                onClick={handleRunML} 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/20"
              >
                <Brain className="h-4 w-4 mr-2" />
                Run ML Predictions
              </Button>
              <Button 
                onClick={refetch} 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <QuickStats data={data?.stats} />

        {/* Energy Chart */}
        <EnergyChart data={data?.chartData} />

        {/* Building Cards and AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Building Energy Status</h2>
              <p className="text-muted-foreground">Real-time monitoring and sustainability scores for all campus buildings</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.buildings.map((building, index) => (
                <EnergyCard key={index} {...building} />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <AIInsights insights={data?.insights} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
