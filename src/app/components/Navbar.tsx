import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Smartphone, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-900 transition-shadow">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 dark:text-white hidden sm:block">
              <span className="text-indigo-600 dark:text-indigo-400">Phone</span>Lens
              <span className="ml-1.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/spare-parts', label: 'Spare Parts' },
              { path: '/marketplace', label: 'Marketplace' },
              { path: '/compare', label: 'Compare' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive(path)
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                    <span className="text-white text-xs">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200 max-w-24 truncate">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">Admin</span>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/my-ads"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Smartphone className="w-4 h-4" /> My Ads
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${isActive('/') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'}`}
          >
            Home
          </Link>
          <Link
            to="/spare-parts"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${isActive('/spare-parts') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'}`}
          >
            Spare Parts
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${isActive('/marketplace') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'}`}
          >
            Marketplace
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm ${isActive('/compare') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'}`}
          >
            Compare
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200">
                Dashboard
              </Link>
              <Link to="/my-ads" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200">
                My Ads
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      {/* Backdrop */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </nav>
  );
}
