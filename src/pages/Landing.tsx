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
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi2';
import { useUIStore } from '@/store/uiStore';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const { theme, setTheme } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <HiOutlineDocumentText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">InvoiceAI</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
              >
                {theme === 'dark' ? (
                  <HiOutlineSun className="w-5 h-5 text-foreground" />
                ) : (
                  <HiOutlineMoon className="w-5 h-5 text-foreground" />
                )}
              </button>

              <Link to="/auth" className="text-foreground hover:text-primary transition-colors font-medium">
                Login
              </Link>
              
              <Link to="/auth" className="btn-gradient">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-gradient text-foreground dark:text-white">
        <div className="container mx-auto px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <HiOutlineSparkles className="w-4 h-4" />
              HackXios 2K25 Project
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              AI-Powered<br />
              <span className="text-primary">Invoice Automation</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Process thousands of invoices in seconds — powered by Generative AI + OCR. 
              Extract, validate, and export with unprecedented accuracy.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <Link to="/auth" className="btn-gradient text-lg px-8 py-3 flex items-center gap-2">
                Start Processing <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/auth" className="btn-outline text-lg px-8 py-3">
                Live Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '1,247+', label: 'Invoices Processed' },
            { value: '98.7%', label: 'Accuracy Rate' },
            { value: '<3s', label: 'Avg Processing Time' },
            { value: '$45K+', label: 'Cost Savings' },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Enterprise-Grade AP Automation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: HiOutlineCpuChip, title: 'AI Extraction', desc: 'Automatically extract all invoice fields with confidence scoring and explainability.' },
              { icon: HiOutlineShieldCheck, title: 'Human-in-Loop', desc: 'Smart routing ensures humans review only what matters, with full audit trails.' },
              { icon: HiOutlineChartBar, title: 'Business Insights', desc: 'Real-time analytics on cost savings, processing times, and vendor performance.' },
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card-hover p-8"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Before/After */}
      <div className="py-20">
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
                <li className="flex items-center gap-2"><HiOutlineDocumentText className="w-5 h-5 text-success" /> 98.7% accuracy with AI</li>
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
        <Link to="/auth" className="btn-gradient text-lg px-10 py-4 inline-flex items-center gap-2">
          Launch Dashboard <HiOutlineArrowRight className="w-5 h-5" />
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
