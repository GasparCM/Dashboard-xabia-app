import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Newspaper,
  MapPin,
  Calendar,
  Megaphone,
  Users,
  BarChart3,
  Bell,
  Settings,
  Search,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { useTranslation } from "../../hooks/useTranslation";

const menuItems = [
  { id: "home", path: "/", icon: Home, roles: [] },
  { id: "news", path: "/news", icon: Newspaper, roles: ["admin", "editor"] },
  { id: "items", path: "/items", icon: MapPin, roles: ["admin", "editor"] },
  {
    id: "activities",
    path: "/activities",
    icon: Activity,
    roles: ["admin", "editor"],
  },
  { id: "events", path: "/events", icon: Calendar, roles: ["admin", "editor"] },
  {
    id: "notices",
    path: "/notices",
    icon: Megaphone,
    roles: ["admin", "editor"],
  },
  { id: "users", path: "/users", icon: Users, roles: ["admin"] },
  { id: "analytics", path: "/analytics", icon: BarChart3, roles: [] },
  {
    id: "notifications",
    path: "/notifications",
    icon: Bell,
    roles: ["admin", "editor"],
  },
  { id: "settings", path: "/settings", icon: Settings, roles: ["admin"] },
];

export const Sidebar: React.FC = () => {
  const { state, dispatch } = useApp();
  const { sidebarCollapsed, currentUser } = state;
  const { t } = useTranslation();
  const location = useLocation();

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roles.length === 0) return true;
    return currentUser && item.roles.includes(currentUser.role);
  });

  return (
    <div
      className={`bg-white border-r border-border transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img
                src="https://marioschumacher.com/wp-content/uploads/2014/05/Ayuntamiento-de-X%C3%A0bia-J%C3%A1vea.jpg"
                alt=""
              />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-text-title-strong">
                {t('branding.name')}
              </h1>
              <p className="text-xs text-text-body">{t('branding.entity')}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${
              sidebarCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-body" />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-body hover:bg-gray-50 hover:text-text-title"
                  }`}
                  title={sidebarCollapsed ? t(`nav.${item.id}`) : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="ml-3">{t(`nav.${item.id}`)}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
