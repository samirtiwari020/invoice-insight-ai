import React from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { KPICard } from '@/components/ui/KPICard';
import { HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineChartBar, HiOutlineCheckCircle } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics: React.FC = () => {
  const { invoices, dashboardMetrics } = useInvoiceStore();

  const vendorData = invoices.reduce((acc, inv) => {
    const existing = acc.find(v => v.vendor === inv.vendor);
    if (existing) { existing.count++; existing.amount += inv.totalAmount; }
    else acc.push({ vendor: inv.vendor, count: 1, amount: inv.totalAmount });
    return acc;
  }, [] as { vendor: string; count: number; amount: number }[]).slice(0, 5);

  const accuracyData = [
    { range: '90-100%', count: invoices.filter(i => i.overallConfidence >= 90).length },
    { range: '80-90%', count: invoices.filter(i => i.overallConfidence >= 80 && i.overallConfidence < 90).length },
    { range: '70-80%', count: invoices.filter(i => i.overallConfidence >= 70 && i.overallConfidence < 80).length },
    { range: '<70%', count: invoices.filter(i => i.overallConfidence < 70).length },
  ];

  const savingsData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    cost: Math.floor(Math.random() * 5000) + 2000,
    time: Math.floor(Math.random() * 100) + 50,
  }));

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Business intelligence and AI performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Savings" value={`$${(dashboardMetrics.estimatedCostSavings * 12).toLocaleString()}`} subtitle="Annual projection" icon={<HiOutlineCurrencyDollar className="w-6 h-6" />} variant="success" />
        <KPICard title="Time Saved" value={`${Math.floor(dashboardMetrics.manualTimeSavedMinutes * 12 / 60)}h`} subtitle="Annual projection" icon={<HiOutlineClock className="w-6 h-6" />} variant="info" />
        <KPICard title="Accuracy" value={`${dashboardMetrics.averageConfidence.toFixed(1)}%`} subtitle="Avg confidence" icon={<HiOutlineChartBar className="w-6 h-6" />} variant="primary" />
        <KPICard title="Auto-Approved" value={`${dashboardMetrics.autoApprovalRate.toFixed(0)}%`} subtitle="≥85% confidence" icon={<HiOutlineCheckCircle className="w-6 h-6" />} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Savings Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${v}`, 'Savings']} />
                <Line type="monotone" dataKey="cost" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Top Vendors by Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="vendor" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={accuracyData} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={80} label>
                  {accuracyData.map((_, i) => (
                    <Cell key={i} fill={['hsl(var(--success))', 'hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--destructive))'][i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">ROI Calculator</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm text-muted-foreground">Monthly Savings</p>
              <p className="text-2xl font-bold text-success">${dashboardMetrics.estimatedCostSavings.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground">Hours Saved Monthly</p>
              <p className="text-2xl font-bold text-primary">{Math.floor(dashboardMetrics.manualTimeSavedMinutes / 60)} hours</p>
            </div>
            <div className="p-4 rounded-lg bg-info/10 border border-info/20">
              <p className="text-sm text-muted-foreground">Productivity Gain</p>
              <p className="text-2xl font-bold text-info">{dashboardMetrics.productivityImprovement}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
