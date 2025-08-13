import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../../store/AppContext';
import { mockUsers } from '../../mocks/data';

interface LayoutProps {
  title: string;
  breadcrumb?: string[];
}

export const Layout: React.FC<LayoutProps> = ({ title, breadcrumb }) => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Simulate user login on app start
    dispatch({ type: 'SET_USER', payload: mockUsers[0] });
  }, [dispatch]);

  return (
    <div className="h-screen flex bg-bg-app">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};