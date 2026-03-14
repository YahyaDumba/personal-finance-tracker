import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Wallet, PieChart, TrendingUp, Search, Target, Shield } from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Future Users! Maybe' },
  { value: '0M+', label: 'Tracked Monthly' },
  { value: '99%', label: 'Uptime' },
];

const features = [
  {
    icon: <Wallet className="w-6 h-6 text-blue-400" />,
    title: 'Expense Tracking',
    desc: 'Record daily expenses with categories and descriptions instantly.'
  },
  {
    icon: <PieChart className="w-6 h-6 text-blue-400" />,
    title: 'Budget Management',
    desc: 'Set monthly budgets and get visual progress indicators.'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
    title: 'Income Management',
    desc: 'Track all income sources with recurring entry support.'
  },
  {
    icon: <Search className="w-6 h-6 text-blue-400" />,
    title: 'Transaction History',
    desc: 'Search and filter all your past transactions with ease.'
  },
  {
    icon: <Target className="w-6 h-6 text-blue-400" />,
    title: 'Financial Goals',
    desc: 'Set goals and track your progress towards financial freedom.'
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-400" />,
    title: 'Secure & Private',
    desc: 'Bank-level security with JWT auth and email verification.'
  },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/95 backdrop-blur border-b border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-white">FinTrack</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
            Take Control of
            <span className="block text-blue-500">Your Finances</span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Track expenses, manage budgets, and achieve your financial goals
            with our powerful yet simple personal finance tracker.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105">
              Start Tracking Free →
            </Link>
            <Link to="/login"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-xl font-semibold text-base transition-all">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-gray-800">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything you need</h2>
            <p className="text-gray-400">Powerful features to manage your financial life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-blue-800 transition-all hover:-translate-y-1">
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center bg-blue-950 border border-blue-900 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-gray-400 mb-6 text-sm md:text-base">Join thousands of users tracking their finances smarter.</p>
          <Link to="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all inline-block hover:scale-105">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-sm">FinTrack</span>
          <p className="text-gray-500 text-sm">Made By Yahya Dumba as a Task for Hyscaler</p>
        </div>
      </footer>
    </div>
  );
}