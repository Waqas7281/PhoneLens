import React from 'react';
import { Link } from 'react-router';
import { Smartphone, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-white">
                <span className="text-indigo-400">Phone</span>Detect AI
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              AI-powered mobile phone recognition and specification finder. Upload any phone image and get instant brand detection with full specifications.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: <Github className="w-4 h-4" />, href: '#', label: 'GitHub' },
                { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
                { icon: <Mail className="w-4 h-4" />, href: '#', label: 'Email' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/compare', label: 'Compare Phones' },
                { to: '/dashboard', label: 'My Dashboard' },
                { to: '/register', label: 'Create Account' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-white text-sm mb-4">Supported Brands</h4>
            <ul className="space-y-2">
              {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola'].map(brand => (
                <li key={brand}>
                  <span className="text-sm text-gray-400">{brand}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PhoneDetect AI. Built as an FYP Project.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              AI Engine Online
            </span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-500">v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
