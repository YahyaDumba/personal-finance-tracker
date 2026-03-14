import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {Wallet, PieChart, TrendingUp, Search, Target, Shield} from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Future Users! Maybe' },
  { value: '0M+', label: 'Tracked Monthly' },
  { value: '99%', label: 'Uptime' },
];

const features = [
  {
    icon: <Wallet className="w-7 h-7 text-blue-400" />,
    title: 'Expense Tracking',
    desc: 'Record daily expenses with categories and descriptions instantly.'
  },
  {
    icon: <PieChart className="w-7 h-7 text-blue-400" />,
    title: 'Budget Management',
    desc: 'Set monthly budgets and get visual progress indicators.'
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-blue-400" />,
    title: 'Income Management',
    desc: 'Track all income sources with recurring entry support.'
  },
  {
    icon: <Search className="w-7 h-7 text-blue-400" />,
    title: 'Transaction History',
    desc: 'Search and filter all your past transactions with ease.'
  },
  {
    icon: <Target className="w-7 h-7 text-blue-400" />,
    title: 'Financial Goals',
    desc: 'Set goals and track your progress towards financial freedom.'
  },
  {
    icon: <Shield className="w-7 h-7 text-blue-400" />,
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
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-white">FinTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 bg-blue-950 border border-blue-800 text-blue-400 text-sm px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Free to use — No credit card required
          </div> */}

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Take Control of
            <span className="block text-blue-500"> Your Finances</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Track expenses, manage budgets, and achieve your financial goals
            with our powerful yet simple personal finance tracker.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105">
              Start Tracking Free →
            </Link>
            <Link to="/login"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-800">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-400 text-lg">Powerful features to manage your financial life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-800 transition-all hover:-translate-y-1">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-blue-950 border border-blue-900 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">Join thousands of users tracking their finances smarter.</p>
          <Link to="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all inline-block hover:scale-105">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">FinTrack</span>
          </div>
          <p className="text-gray-500 text-sm">Made By Yahya Dumba as a Task for Hyscaler</p>
        </div>
      </footer>
    </div>
  );
}