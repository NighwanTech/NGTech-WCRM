"use client";

import { useEffect, useState, useRef } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Calendar, MessageSquare, Bot, Target, Users, Megaphone, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState("30"); // days
  
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - parseInt(dateRange));

      const res = await fetch(`/api/analytics?startDate=${start.toISOString()}&endDate=${end.toISOString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  const exportCSV = () => {
    if (!data) return;
    
    // 1. Message Volume
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "--- MESSAGE VOLUME ---\n";
    csvContent += "Date,Inbound Messages,Outbound Messages\n";
    data.messageVolume.forEach((row: any) => {
      csvContent += `${row.date},${row.inbound},${row.outbound}\n`;
    });
    
    // 2. AI Performance
    csvContent += "\n--- AI VS HUMAN PERFORMANCE ---\n";
    csvContent += "Category,Count\n";
    data.aiPerformance.forEach((row: any) => {
      csvContent += `${row.name},${row.value}\n`;
    });
    
    // 3. Deal Metrics
    csvContent += "\n--- DEAL METRICS ---\n";
    csvContent += "Status,Count\n";
    data.dealMetrics.forEach((row: any) => {
      csvContent += `${row.name},${row.value}\n`;
    });
    
    // 4. Summary
    csvContent += "\n--- SUMMARY ---\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Messages,${data.summary.totalMessages}\n`;
    csvContent += `AI Resolution Rate,${data.summary.aiResolutionRate}%\n`;
    csvContent += `Total Deals,${data.summary.totalDeals}\n`;
    csvContent += `New Contacts,${data.summary.totalContacts}\n`;
    csvContent += `Broadcasts Sent,${data.summary.totalBroadcasts}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Full_Analytics_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-muted-foreground">{p.name}:</span>
              <span className="font-medium">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Intelligent metrics and automated performance reports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 shadow-lg hover:bg-background/80 transition-all">
            <Calendar className="w-4 h-4 text-primary" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none text-sm outline-none font-medium cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
          
          <Button variant="outline" onClick={exportCSV} disabled={loading || !data} className="rounded-xl border-white/10 hover:bg-white/5 backdrop-blur-md">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button onClick={exportPDF} disabled={loading || !data} className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/20">
            <FileText className="w-4 h-4 mr-2" /> PDF Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
            <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
          </div>
        </div>
      ) : !data ? (
        <div className="text-center p-12 border border-dashed rounded-2xl text-muted-foreground bg-background/50 backdrop-blur-md">
          Failed to load analytics data.
        </div>
      ) : (
        <div ref={reportRef} className="space-y-8 pb-12">
          
          {/* SUMMARY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {/* Messages */}
            <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
                <MessageSquare className="w-32 h-32" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
                  <div className="p-2 bg-indigo-500/10 rounded-lg"><MessageSquare className="w-4 h-4 text-indigo-500" /></div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-extrabold tracking-tight">{data.summary.totalMessages}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500 font-medium bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> +12%
                </div>
              </CardContent>
            </Card>

            {/* AI Resolution */}
            <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-violet-500/5 group-hover:text-violet-500/10 transition-colors duration-500">
                <Bot className="w-32 h-32" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">AI Resolution</CardTitle>
                  <div className="p-2 bg-violet-500/10 rounded-lg"><Bot className="w-4 h-4 text-violet-500" /></div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                  {data.summary.aiResolutionRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">Zero human touch required</p>
              </CardContent>
            </Card>

            {/* Deals */}
            <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors duration-500">
                <Target className="w-32 h-32" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Target className="w-4 h-4 text-emerald-500" /></div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-extrabold tracking-tight">{data.summary.totalDeals}</div>
                <p className="text-xs text-muted-foreground mt-2">Currently in pipeline</p>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-blue-500/5 group-hover:text-blue-500/10 transition-colors duration-500">
                <Users className="w-32 h-32" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">New Contacts</CardTitle>
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-4 h-4 text-blue-500" /></div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-extrabold tracking-tight">{data.summary.totalContacts}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500 font-medium bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> Growth
                </div>
              </CardContent>
            </Card>

            {/* Broadcasts */}
            <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
              <div className="absolute -right-4 -bottom-4 text-amber-500/5 group-hover:text-amber-500/10 transition-colors duration-500">
                <Megaphone className="w-32 h-32" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Broadcasts</CardTitle>
                  <div className="p-2 bg-amber-500/10 rounded-lg"><Megaphone className="w-4 h-4 text-amber-500" /></div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-extrabold tracking-tight">{data.summary.totalBroadcasts}</div>
                <p className="text-xs text-muted-foreground mt-2">Campaigns launched</p>
              </CardContent>
            </Card>

          </div>

          {/* MAIN CHART AREA */}
          <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl pt-6 overflow-hidden">
            <CardHeader className="px-8 pb-8">
              <CardTitle className="text-xl">Message Volume Over Time</CardTitle>
              <CardDescription className="text-sm">Daily inbound requests vs AI and human outbound replies</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.messageVolume} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10} 
                    />
                    <YAxis 
                      tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} 
                      tickLine={false} 
                      axisLine={false} 
                      dx={-10}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                    <Area 
                      type="monotone" 
                      dataKey="inbound" 
                      name="Inbound (Customer)" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorInbound)" 
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#8b5cf6' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outbound" 
                      name="Outbound (Agent/AI)" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorOutbound)" 
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* SECONDARY CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle>AI vs Human Performance</CardTitle>
                <CardDescription>Distribution of conversation handlers</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <div className="h-[280px] w-full relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-violet-600">
                      {data.summary.aiResolutionRate}%
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">AI</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.aiPerformance}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={110}
                        paddingAngle={5}
                        cornerRadius={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.aiPerformance.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-2xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle>Deal Pipeline Metrics</CardTitle>
                <CardDescription>Status of all CRM deals across the organization</CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.dealMetrics} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                      />
                      <YAxis 
                        tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} 
                        tickLine={false} 
                        axisLine={false} 
                        dx={-10}
                      />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--muted))', opacity: 0.2}} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        {data.dealMetrics.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
