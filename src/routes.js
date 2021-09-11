import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import User from './pages/User';
import NotFound from './pages/Page404';
import Profile from './pages/Profile';
import Note from './pages/Note';
import Store from './pages/Store';
import Attendance from './pages/Attendance';
import Timecard from './pages/Timecard';
import Reports from './pages/Reports';
import RegularMessage from './pages/RegularMessage';
import ReportsByMonth from './pages/ReportsByMonth';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element:  localStorage.getItem('jwt')?<DashboardLayout />:<Navigate to="/login" replace />,
      children: [
        { path: '/', element: localStorage.getItem('jwt')?<Navigate to="/dashboard/app" replace />:<Navigate to="/login" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'users', element: <User /> },
        { path: 'profile', element: <Profile/>},
        { path: 'notes', element: <Note />},
        { path: 'regular-messages', element: <RegularMessage />},
        { path: 'stores', element: <Store/>},
        { path: 'attendances', element: <Attendance />},
        { path: 'timecards', element: <Timecard />},
        { path: 'reports/employee', element: <Reports />},
        { path: 'reports/month', element: <ReportsByMonth />}
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
