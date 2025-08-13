import React, { useState } from 'react';
import { ChevronDown, Search, Bell, User, LogOut, Globe } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../types';

export const TopBar: React.FC<{ title: string; breadcrumb?: string[] }> = ({ title, breadcrumb = [] }) => {
  const { state, dispatch } = useApp();
  const { currentUser, language } = state;
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'es' as Language, name: 'Español' },
    { code: 'va' as Language, name: 'Valencià' },
    { code: 'en' as Language, name: 'English' },
  ];

  const handleLanguageChange = (newLanguage: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
    setShowLangMenu(false);
  };

  return (
    <div className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title and Breadcrumb */}
        <div>
          <h1 className="text-2xl font-semibold text-text-title-strong">{title}</h1>
          {breadcrumb.length > 0 && (
            <nav className="text-sm text-text-body mt-1">
              {breadcrumb.map((crumb, index) => (
                <span key={index}>
                  {index > 0 && <span className="mx-2">/</span>}
                  <span className={index === breadcrumb.length - 1 ? 'text-primary' : ''}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-body" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-50 relative">
            <Bell className="w-5 h-5 text-text-body" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full text-xs"></span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
            >
              <Globe className="w-4 h-4 text-text-body" />
              <span className="text-sm text-text-body uppercase">{language}</span>
              <ChevronDown className="w-4 h-4 text-text-body" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded-lg shadow-lg z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      language === lang.code ? 'bg-primary/10 text-primary' : 'text-text-body'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-text-title-strong">{currentUser?.name}</div>
                <div className="text-xs text-text-body capitalize">{currentUser?.role}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-text-body" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-medium text-text-title-strong">{currentUser?.name}</div>
                  <div className="text-xs text-text-body">{currentUser?.email}</div>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-text-body hover:bg-gray-50 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-50 flex items-center space-x-2 rounded-b-lg">
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};