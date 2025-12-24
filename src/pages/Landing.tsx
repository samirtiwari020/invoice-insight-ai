import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineSparkles, 
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from 'react-icons/hi2';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="hero-gradient text-primary-foreground">
        <div className="container mx-auto px-6 py-20">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <HiOutlineSparkles className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl">InvoiceAI</span>
            </div>
            <Link to="/dashboard" className="btn-gradient">
              Get Started
            </Link>
          </nav>

          <div className="max-w-4xl mx-auto text-center fade-in-up">
            <div className="badge-primary mb-6 inline-flex">Powered by AI</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Invoice Processing with{' '}
              <span className="text-gradient">AI Intelligence</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Automate accounts payable with 95%+ accuracy. Extract, validate, and approve invoices in seconds, not hours.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/dashboard" className="btn-gradient text-lg px-8 py-3">
                Start Demo <HiOutlineArrowRight className="inline ml-2" />
              </Link>
              <Link to="/upload" className="px-8 py-3 rounded-lg border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-colors">
                Upload Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
          {[
            { value: '95%+', label: 'Extraction Accuracy' },
            { value: '12min', label: 'Saved per Invoice' },
            { value: '340%', label: 'Productivity Boost' },
            { value: '$45', label: 'Cost Savings/Invoice' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Enterprise-Grade AP Automation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: HiOutlineCpuChip, title: 'AI Extraction', desc: 'Automatically extract all invoice fields with confidence scoring and explainability.' },
            { icon: HiOutlineShieldCheck, title: 'Human-in-Loop', desc: 'Smart routing ensures humans review only what matters, with full audit trails.' },
            { icon: HiOutlineChartBar, title: 'Business Insights', desc: 'Real-time analytics on cost savings, processing times, and vendor performance.' },
          ].map((feature) => (
            <div key={feature.title} className="glass-card-hover p-8">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Before/After */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Before vs After InvoiceAI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-destructive mb-4">Manual Process</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2"><HiOutlineClock className="w-5 h-5 text-destructive" /> 15-20 minutes per invoice</li>
                <li className="flex items-center gap-2"><HiOutlineDocumentText className="w-5 h-5 text-destructive" /> Error-prone data entry</li>
                <li className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-destructive" /> No audit trail</li>
              </ul>
            </div>
            <div className="bg-success/5 border border-success/20 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-success mb-4">With InvoiceAI</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2"><HiOutlineClock className="w-5 h-5 text-success" /> 30 seconds average</li>
                <li className="flex items-center gap-2"><HiOutlineDocumentText className="w-5 h-5 text-success" /> 95%+ accuracy with AI</li>
                <li className="flex items-center gap-2"><HiOutlineCheckCircle className="w-5 h-5 text-success" /> Complete audit compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your AP Process?</h2>
        <p className="text-muted-foreground mb-8">Start processing invoices with AI today</p>
        <Link to="/dashboard" className="btn-gradient text-lg px-10 py-4">
          Launch Dashboard <HiOutlineArrowRight className="inline ml-2" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HackXios • Enterprise AP Automation</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
