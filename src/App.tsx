import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { News } from './pages/News/News';
import { Items } from './pages/Items/Items';
import { Activities } from './pages/Activities/Activities';
import { Events } from './pages/Events/Events';
import { Notices } from './pages/Notices/Notices';
import { Users } from './pages/Users/Users';
import { Analytics } from './pages/Analytics/Analytics';
import { Notifications } from './pages/Notifications/Notifications';
import { Settings } from './pages/Settings/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout title="Panel de Administración" />}>
            <Route index element={<Home />} />
            <Route path="news" element={<News />} />
            <Route path="items" element={<Items />} />
            <Route path="activities" element={<Activities />} />
            <Route path="events" element={<Events />} />
            <Route path="notices" element={<Notices />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;