import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Language } from '../types';

interface AppState {
  currentUser: User | null;
  language: Language;
  sidebarCollapsed: boolean;
  loading: boolean;
  theme: 'light' | 'dark' | 'auto';
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' };

const initialState: AppState = {
  currentUser: null,
  language: 'es',
  sidebarCollapsed: false,
  loading: false,
  theme: 'auto',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const usePermissions = () => {
  const { state } = useApp();
  const { currentUser } = state;

  return {
    canCreate: currentUser?.role === 'admin' || currentUser?.role === 'editor',
    canEdit: currentUser?.role === 'admin' || currentUser?.role === 'editor',
    canDelete: currentUser?.role === 'admin',
    canViewAnalytics: !!currentUser,
    canManageUsers: currentUser?.role === 'admin',
    canExport: !!currentUser,
  };
};