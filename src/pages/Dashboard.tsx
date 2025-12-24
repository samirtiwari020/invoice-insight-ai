import React from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { KPICard } from '@/components/ui/KPICard';
import { WorkflowFunnel } from '@/components/ui/WorkflowStages';
import { ConfidenceBar } from '@/components/ui/ConfidenceBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { invoices, dashboardMetrics, isExecutiveMode } = useInvoiceStore();

  const confidenceData = [
    { range: '90-100%', count: invoices.filter(i => i.overallConfidence >= 90).length, fill: 'hsl(var(--success))' },
    { range: '70-90%', count: invoices.filter(i => i.overallConfidence >= 70 && i.overallConfidence < 90).length, fill: 'hsl(var(--warning))' },
    { range: '<70%', count: invoices.filter(i => i.overallConfidence < 70).length, fill: 'hsl(var(--destructive))' },
  ];

  const recentActivity = invoices.slice(0, 5);

  const funnelCounts = {
    upload: invoices.length,
    extraction: invoices.filter(i => i.status !== 'processing').length,
    review: invoices.filter(i => i.status === 'review').length,
    approved: invoices.filter(i => i.status === 'approved').length,
    archived: invoices.filter(i => i.stage === 'archive').length,
  };

  const savingsData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    savings: Math.floor(Math.random() * 500) + 200,
  }));

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            {isExecutiveMode ? 'Business Overview' : 'AI Processing Overview'}
          </p>
        </div>
        {isExecutiveMode && (
          <div className="badge-primary">Executive Mode</div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <KPICard
          title="Total Invoices"
          value={dashboardMetrics.totalInvoices}
          subtitle={`${dashboardMetrics.processedToday} processed today`}
          icon={<HiOutlineDocumentText className="w-6 h-6" />}
          variant="primary"
          trend={{ value: 12, label: 'vs last week' }}
        />
        <KPICard
          title="Time Saved"
          value={`${Math.floor(dashboardMetrics.manualTimeSavedMinutes / 60)}h ${dashboardMetrics.manualTimeSavedMinutes % 60}m`}
          subtitle="Manual processing time"
          icon={<HiOutlineClock className="w-6 h-6" />}
          variant="success"
          trend={{ value: 23, label: 'efficiency gain' }}
        />
        <KPICard
          title="Cost Savings"
          value={`$${dashboardMetrics.estimatedCostSavings.toLocaleString()}`}
          subtitle="This month"
          icon={<HiOutlineCurrencyDollar className="w-6 h-6" />}
          variant="success"
          trend={{ value: 18, label: 'vs last month' }}
        />
        <KPICard
          title="Productivity"
          value={`${dashboardMetrics.productivityImprovement}%`}
          subtitle="Improvement"
          icon={<HiOutlineChartBar className="w-6 h-6" />}
          variant="info"
          trend={{ value: 45, label: 'increase' }}
        />
      </div>

      {!isExecutiveMode && (
        <>
          {/* AI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Auto-Approval Rate"
              value={`${dashboardMetrics.autoApprovalRate.toFixed(0)}%`}
              subtitle="Confidence ≥ 85%"
              icon={<HiOutlineSparkles className="w-6 h-6" />}
              variant="primary"
            />
            <KPICard
              title="Pending Review"
              value={dashboardMetrics.pendingReview}
              subtitle="Awaiting human verification"
              icon={<HiOutlineExclamationTriangle className="w-6 h-6" />}
              variant="warning"
            />
            <KPICard
              title="Avg Confidence"
              value={`${dashboardMetrics.averageConfidence.toFixed(1)}%`}
              subtitle="Across all extractions"
              icon={<HiOutlineCheckCircle className="w-6 h-6" />}
              variant="success"
            />
          </div>
        </>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Funnel */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Processing Funnel</h3>
          <WorkflowFunnel counts={funnelCounts} />
        </div>

        {/* Confidence Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={confidenceData} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={70} label>
                  {confidenceData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {confidenceData.map((d) => (
              <div key={d.range} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                <span>{d.range}: {d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Cost Savings</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${v}`, 'Savings']} />
                <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" fill="url(#savingsGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HiOutlineDocumentText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inv.vendor}</p>
                    <p className="text-xs text-muted-foreground">{inv.invoiceNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ConfidenceBar confidence={inv.overallConfidence} className="w-20" showPercentage={false} />
                  <StatusBadge status={inv.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
