import React from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { ComparePage } from './pages/ComparePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SparePartsFinderPage } from './pages/SparePartsFinderPage';
import { PartsResultsPage } from './pages/PartsResultsPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CreateAdPage } from './pages/CreateAdPage';
import { AdDetailPage } from './pages/AdDetailPage';
import { MyAdsPage } from './pages/MyAdsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'results', Component: ResultsPage },
      { path: 'compare', Component: ComparePage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
      // Spare Parts Routes
      { path: 'spare-parts', Component: SparePartsFinderPage },
      { path: 'spare-parts/results', Component: PartsResultsPage },
      // Marketplace Routes
      { path: 'marketplace', Component: MarketplacePage },
      { path: 'marketplace/:id', Component: AdDetailPage },
      { path: 'sell', Component: CreateAdPage },
      {
        path: 'my-ads',
        element: (
          <ProtectedRoute>
            <MyAdsPage />
          </ProtectedRoute>
        ),
      },
      // Protected Routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);