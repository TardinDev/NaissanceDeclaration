import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardCitizen from '@/pages/citizen/DashboardCitizen';
import NewDeclaration from '@/pages/citizen/NewDeclaration';
import MyDeclarations from '@/pages/citizen/MyDeclarations';
import DashboardAgent from '@/pages/agent/DashboardAgent';
import DeclarationReview from '@/pages/agent/DeclarationReview';
import DashboardAdmin from '@/pages/admin/DashboardAdmin';
import AdminDeclarationDetail from '@/pages/admin/AdminDeclarationDetail';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },

      // Citizen routes
      {
        path: '/citizen/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <DashboardCitizen />
          </ProtectedRoute>
        ),
      },
      {
        path: '/citizen/new-declaration',
        element: (
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <NewDeclaration />
          </ProtectedRoute>
        ),
      },
      {
        path: '/citizen/declarations/:id',
        element: (
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <MyDeclarations />
          </ProtectedRoute>
        ),
      },

      // Agent routes
      {
        path: '/agent/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
            <DashboardAgent />
          </ProtectedRoute>
        ),
      },
      {
        path: '/agent/declarations/:id/review',
        element: (
          <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
            <DeclarationReview />
          </ProtectedRoute>
        ),
      },

      // Admin routes
      {
        path: '/admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/declarations/:id',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDeclarationDetail />
          </ProtectedRoute>
        ),
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);
