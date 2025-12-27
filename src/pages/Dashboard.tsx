import React from 'react';
import { Link } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { motion } from 'framer-motion';
import { 
  HiOutlineDocumentText,
  HiOutlineArrowTrendingUp as HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineCloudArrowUp,
  HiOutlineClipboardDocumentCheck,
  HiOutlineChartBarSquare,
  HiOutlineArrowDownTray,
  HiOutlineBolt,
  HiOutlineTrophy,
  HiOutlineCpuChip,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { invoices, dashboardMetrics } = useInvoiceStore();

  // Volume trend data
  const volumeTrendData = [
    { day: 'Mon', value: 140 },
    { day: 'Tue', value: 185 },
    { day: 'Wed', value: 210 },
    { day: 'Thu', value: 260 },
    { day: 'Fri', value: 240 },
    { day: 'Sat', value: 180 },
    { day: 'Sun', value: 120 },
  ];

  // Processing funnel data
  const funnelData = [
    { name: 'Uploaded', value: 1247, fill: 'hsl(199, 89%, 48%)' },
    { name: 'Extracted', value: 1156, fill: 'hsl(160, 84%, 39%)' },
    { name: 'Approved', value: 1098, fill: 'hsl(152, 69%, 40%)' },
  ];

  // Top vendors data
  const vendorData = [
    { name: 'Acme Corp', count: 234 },
    { name: 'TechFlow', count: 189 },
    { name: 'CloudSoft', count: 156 },
    { name: 'Global Ltd', count: 142 },
    { name: 'InnoLabs', count: 98 },
  ];

  // AI Confidence distribution
  const confidenceData = [
    { name: '90-100%', value: 820, fill: 'hsl(152, 69%, 40%)' },
    { name: '70-89%', value: 280, fill: 'hsl(38, 92%, 50%)' },
    { name: '<70%', value: 147, fill: 'hsl(0, 72%, 51%)' },
  ];

  const pendingReview = invoices.filter(i => i.status === 'review').length;
  const urgentCount = invoices.filter(i => i.overallConfidence < 70).length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          Welcome back, Samir! <span className="text-3xl">👋</span>
        </h1>
        <div className="flex items-center gap-6 mt-2">
          <span className="text-primary text-sm font-medium flex items-center gap-1">
            <HiOutlineBolt className="w-4 h-4" /> 6 day streak — keep going!
          </span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> API</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> OCR</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> GPU</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> DB</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard className="p-5" delay={0.1}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Processed</p>
              <p className="text-3xl font-bold text-foreground mt-1">1,247</p>
              <p className="text-sm text-primary flex items-center gap-1 mt-2">
                <HiOutlineArrowTrendingUp className="w-4 h-4" /> +12%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <HiOutlineDocumentText className="w-5 h-5 text-primary" />
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-5" delay={0.15}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              <p className="text-3xl font-bold text-foreground mt-1">98.7%</p>
              <p className="text-sm text-primary flex items-center gap-1 mt-2">
                <HiOutlineArrowTrendingUp className="w-4 h-4" /> +2.3%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <HiOutlineTrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-5" delay={0.2}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Processing Time</p>
              <p className="text-3xl font-bold text-foreground mt-1">2.3s</p>
              <p className="text-sm text-primary flex items-center gap-1 mt-2">
                <HiOutlineArrowTrendingUp className="w-4 h-4" /> -0.5s
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <HiOutlineClock className="w-5 h-5 text-warning" />
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-5" delay={0.25}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-3xl font-bold text-foreground mt-1">{pendingReview || 12}</p>
              <p className="text-sm text-warning flex items-center gap-1 mt-2">
                ↘ {urgentCount || 5} urgent
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <HiOutlineExclamationCircle className="w-5 h-5 text-warning" />
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/upload" className="btn-gradient flex items-center gap-2">
          <HiOutlineCloudArrowUp className="w-5 h-5" /> Upload Invoice
        </Link>
        <Link to="/review-queue" className="btn-outline flex items-center gap-2">
          <HiOutlineClipboardDocumentCheck className="w-5 h-5" /> Review Queue
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{pendingReview || 12}</span>
        </Link>
        <Link to="/analytics" className="btn-outline flex items-center gap-2">
          <HiOutlineChartBarSquare className="w-5 h-5" /> Analytics
        </Link>
        <button className="btn-outline flex items-center gap-2">
          <HiOutlineArrowDownTray className="w-5 h-5" /> Export All Data
        </button>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Volume Trend */}
        <AnimatedCard className="lg:col-span-3 p-6" delay={0.3}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiOutlineTrendingUp className="w-5 h-5 text-primary" /> Volume Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrendData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#volumeGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Processing Funnel */}
        <AnimatedCard className="lg:col-span-2 p-6" delay={0.35}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiOutlineBolt className="w-5 h-5 text-warning" /> Processing Funnel
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" barSize={32}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Vendors */}
        <AnimatedCard className="p-6" delay={0.4}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiOutlineTrophy className="w-5 h-5 text-warning" /> Top Vendors
          </h3>
          <div className="space-y-4">
            {vendorData.map((vendor, index) => (
              <div key={vendor.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{vendor.name}</span>
                    <span className="text-sm text-muted-foreground">{vendor.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(vendor.count / 234) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* AI Confidence */}
        <AnimatedCard className="p-6" delay={0.45}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiOutlineCpuChip className="w-5 h-5 text-primary" /> AI Confidence
          </h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={confidenceData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {confidenceData.map((entry, index) => (
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
          <div className="flex justify-center gap-4 mt-2">
            {confidenceData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Cost Savings */}
        <div className="savings-card flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5" /> Cost Savings
            </h3>
            <p className="text-4xl font-bold">$45,280</p>
            <p className="text-sm opacity-80 mt-2">
              Estimated savings from automated processing vs manual entry
            </p>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary-foreground/20">
            <span className="text-sm">Per invoice:</span>
            <span className="font-semibold">~$36.30</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
