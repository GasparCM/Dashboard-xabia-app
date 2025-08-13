import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { News } from './pages/News/News';
import { NewsDetail } from './pages/News/NewsDetail';
import { Items } from './pages/Items/Items';
import { ItemDetail } from './pages/Items/ItemDetail';
import { Activities } from './pages/Activities/Activities';
import { ActivityDetail } from './pages/Activities/ActivityDetail';
import { Events } from './pages/Events/Events';
import { EventDetail } from './pages/Events/EventDetail';
import { Notices } from './pages/Notices/Notices';
import { Users } from './pages/Users/Users';
import { Analytics } from './pages/Analytics/Analytics';
import { Notifications } from './pages/Notifications/Notifications';
import { Settings } from './pages/Settings/Settings';
import { Login } from './pages/Auth/Login';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { Profile } from './pages/Profile/Profile';
import { useApp } from './store/AppContext';
import { useTranslation } from './hooks/useTranslation';

const RequireAuth: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useApp();
  const { currentUser, loading } = state;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-app">
        <div className="text-text-body">{t('common.loading')}</div>
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;

// Separamos las rutas para poder usar useTranslation dentro del AppProvider
const AppRoutes: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Rutas protegidas */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout title={t('app.title')} />}>
            <Route index element={<Home />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="items" element={<Items />} />
            <Route path="items/:id" element={<ItemDetail />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activities/:id" element={<ActivityDetail />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="notices" element={<Notices />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};