"use client";

import { useEffect, useState, useRef } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Calendar } from "lucide-react";

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

  const exportPDF = async () => {
    if (typeof window === 'undefined' || !reportRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin:       0.5,
        filename:     `CRM_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      
      html2pdf().set(opt).from(reportRef.current).save();
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to export PDF.");
    }
  };

  const exportCSV = () => {
    if (!data) return;
    
    // Create CSV for Message Volume
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Inbound Messages,Outbound Messages\n";
    
    data.messageVolume.forEach((row: any) => {
      csvContent += `${row.date},${row.inbound},${row.outbound}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Message_Volume_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">Exportable metrics and performance reports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
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
          
          <Button variant="outline" onClick={exportCSV} disabled={loading || !data}>
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button onClick={exportPDF} disabled={loading || !data} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <FileText className="w-4 h-4 mr-2" /> PDF Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !data ? (
        <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
          Failed to load analytics data.
        </div>
      ) : (
        <div ref={reportRef} className="space-y-6 bg-background p-2 rounded-xl">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.summary.totalMessages}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">AI Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">{data.summary.aiResolutionRate}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.summary.totalDeals}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Message Volume Over Time</CardTitle>
              <CardDescription>Daily inbound vs outbound messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.messageVolume} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Legend />
                    <Line type="monotone" dataKey="inbound" name="Inbound (Customer)" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="outbound" name="Outbound (Agent/AI)" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI vs Human Performance</CardTitle>
                <CardDescription>Distribution of conversation handlers</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.aiPerformance}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.aiPerformance.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deal Pipeline Metrics</CardTitle>
                <CardDescription>Status of all CRM deals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.dealMetrics} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.dealMetrics.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
