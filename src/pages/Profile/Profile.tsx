import React from 'react';
import { Card } from '../../components/UI/Card';
import { useApp } from '../../store/AppContext';

export const Profile: React.FC = () => {
  const { state } = useApp();
  const user = state.currentUser;

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <p>No hay usuario autenticado.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <h2 className="text-text-title-strong text-lg font-medium mb-4">Perfil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-text-body">Nombre</div>
            <div className="text-text-title-strong">{user.name}</div>
          </div>
          <div>
            <div className="text-text-body">Email</div>
            <div className="text-text-title-strong">{user.email}</div>
          </div>
          <div>
            <div className="text-text-body">Rol</div>
            <div className="text-text-title-strong capitalize">{user.role}</div>
          </div>
          <div>
            <div className="text-text-body">Idioma</div>
            <div className="text-text-title-strong uppercase">{user.language}</div>
          </div>
          <div>
            <div className="text-text-body">Alta</div>
            <div className="text-text-title-strong">{user.createdAt.toLocaleDateString('es-ES')}</div>
          </div>
          {user.lastActive && (
            <div>
              <div className="text-text-body">Última actividad</div>
              <div className="text-text-title-strong">{user.lastActive.toLocaleString('es-ES')}</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
