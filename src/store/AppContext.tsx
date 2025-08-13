import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
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
  | { type: 'LOGOUT' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' };

const initialState: AppState = {
  currentUser: null,
  language: 'es',
  sidebarCollapsed: false,
  loading: true,
  theme: 'auto',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
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
  const SESSION_KEY = 'ts_session';

  // Hydrate session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { user: User; expiry: number };
        if (parsed && parsed.user && typeof parsed.expiry === 'number') {
          const now = Date.now();
          if (now < parsed.expiry) {
            dispatch({ type: 'SET_USER', payload: parsed.user });
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        }
      }
    } catch (e) {
      // noop
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Sync session when user changes
  useEffect(() => {
    if (state.currentUser) {
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      const payload = JSON.stringify({ user: state.currentUser, expiry });
      localStorage.setItem(SESSION_KEY, payload);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [state.currentUser]);

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