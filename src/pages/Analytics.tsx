import React from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { motion } from 'framer-motion';
import { 
  HiOutlineDocumentText,
  HiOutlineArrowTrendingUp as HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineArrowDownTray,
  HiOutlineEnvelope,
} from 'react-icons/hi2';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const Analytics: React.FC = () => {
  const { invoices, dashboardMetrics } = useInvoiceStore();

  // Volume over time data
  const volumeData = [
    { week: 'Week 1', invoices: 245 },
    { week: 'Week 2', invoices: 278 },
    { week: 'Week 3', invoices: 289 },
    { week: 'Week 4', invoices: 310 },
  ];

  // Status breakdown
  const statusData = [
    { name: 'Approved', value: 1156, fill: 'hsl(152, 69%, 40%)' },
    { name: 'Pending Review', value: 42, fill: 'hsl(38, 92%, 50%)' },
    { name: 'Rejected', value: 28, fill: 'hsl(0, 72%, 51%)' },
    { name: 'Processing', value: 21, fill: 'hsl(199, 89%, 48%)' },
  ];

  // Accuracy by field
  const accuracyData = [
    { field: 'Invoice #', accuracy: 99.2 },
    { field: 'Vendor', accuracy: 98.5 },
    { field: 'Amount', accuracy: 97.8 },
    { field: 'Date', accuracy: 96.4 },
    { field: 'Tax', accuracy: 94.2 },
    { field: 'Line Items', accuracy: 91.8 },
  ];

  // Processing time trend
  const processingTimeData = [
    { month: 'Jan', time: 3.2 },
    { month: 'Feb', time: 2.8 },
    { month: 'Mar', time: 2.5 },
    { month: 'Apr', time: 2.3 },
  ];

  // Top vendors by invoice count
  const vendorChartData = [
    { name: 'Acme Corporation', count: 234 },
    { name: 'TechFlow Inc', count: 189 },
    { name: 'CloudSoft Solutions', count: 156 },
    { name: 'Global Supplies Ltd', count: 142 },
    { name: 'Innovation Labs', count: 98 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your invoice processing performance</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline flex items-center gap-2">
            <HiOutlineArrowDownTray className="w-4 h-4" /> PDF
          </button>
          <button className="btn-outline flex items-center gap-2">
            <HiOutlineDocumentText className="w-4 h-4" /> Excel
          </button>
          <button className="btn-outline flex items-center gap-2">
            <HiOutlineEnvelope className="w-4 h-4" /> Email Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnimatedCard className="p-4" delay={0.1}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <HiOutlineDocumentText className="w-4 h-4" /> Total Processed
          </div>
          <p className="text-2xl font-bold">1,247</p>
          <p className="text-xs text-muted-foreground mt-1">+156 this week</p>
        </AnimatedCard>

        <AnimatedCard className="p-4" delay={0.15}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <HiOutlineTrendingUp className="w-4 h-4" /> Avg Accuracy
          </div>
          <p className="text-2xl font-bold">98.7%</p>
          <p className="text-xs text-primary mt-1">+2.3% vs last month</p>
        </AnimatedCard>

        <AnimatedCard className="p-4" delay={0.2}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <HiOutlineClock className="w-4 h-4" /> Avg Time
          </div>
          <p className="text-2xl font-bold">2.3s</p>
          <p className="text-xs text-primary mt-1">-0.5s vs last month</p>
        </AnimatedCard>

        <AnimatedCard className="p-4" delay={0.25}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <HiOutlineUsers className="w-4 h-4" /> Manual Interventions
          </div>
          <p className="text-2xl font-bold">42</p>
          <p className="text-xs text-muted-foreground mt-1">3.4% of total</p>
        </AnimatedCard>

        <AnimatedCard className="p-4" delay={0.3}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <HiOutlineCurrencyDollar className="w-4 h-4" /> Cost Saved
          </div>
          <p className="text-2xl font-bold">$45,280</p>
          <p className="text-xs text-primary mt-1">+$8,420 this month</p>
        </AnimatedCard>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Over Time */}
        <AnimatedCard className="p-6" delay={0.35}>
          <h3 className="text-lg font-semibold mb-4">Volume Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}`, 'invoices']}
                />
                <Area 
                  type="monotone" 
                  dataKey="invoices" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#volumeGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Status Breakdown */}
        <AnimatedCard className="p-6" delay={0.4}>
          <h3 className="text-lg font-semibold mb-4">Status Breakdown</h3>
          <div className="flex items-center gap-8">
            <div className="h-56 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={statusData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-8">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: item.fill }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy by Field */}
        <AnimatedCard className="p-6" delay={0.45}>
          <h3 className="text-lg font-semibold mb-4">Accuracy by Field</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData} layout="vertical" barSize={24}>
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="field" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                />
                <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Processing Time Trend */}
        <AnimatedCard className="p-6" delay={0.5}>
          <h3 className="text-lg font-semibold mb-4">Processing Time Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingTimeData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} domain={[0, 4]} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value}s`, 'Avg Time']}
                />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="hsl(var(--info))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--info))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      </div>

      {/* Top Vendors Chart */}
      <AnimatedCard className="p-6" delay={0.55}>
        <h3 className="text-lg font-semibold mb-4">Top Vendors by Invoice Count</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendorChartData} barSize={60}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AnimatedCard>
    </motion.div>
  );
};

export default Analytics;
