import React, { useState, useEffect } from 'react';
import { Plus, Search, UserPlus, Shield, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { mockAPI } from '../../mocks/data';
import { User } from '../../types';
import { usePermissions } from '../../store/AppContext';
import toast from 'react-hot-toast';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const permissions = usePermissions();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await mockAPI.getUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesLanguage = selectedLanguage === 'all' || user.language === selectedLanguage;
    return matchesSearch && matchesRole && matchesLanguage;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuario eliminado');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-error/10 text-error';
      case 'editor': return 'bg-warning/10 text-warning';
      case 'auditor': return 'bg-primary/10 text-primary';
      default: return 'bg-gray-100 text-text-body';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'editor': return 'Editor';
      case 'auditor': return 'Auditor';
      default: return role;
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'es': return '🇪🇸';
      case 'va': return '🏴';
      case 'en': return '🇬🇧';
      default: return '🌐';
    }
  };

  const getActivityStatus = (lastActive?: Date) => {
    if (!lastActive) return { text: 'Nunca', color: 'text-text-body' };
    
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Hoy', color: 'text-success' };
    if (diffDays <= 7) return { text: `Hace ${diffDays}d`, color: 'text-warning' };
    return { text: `Hace ${diffDays}d`, color: 'text-text-body' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-80 bg-gray-200 rounded-card"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-text-title-strong text-lg font-medium">Gestión de Usuarios</h2>
          <p className="text-text-body mt-1">{filteredUsers.length} usuarios encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Download}>
            Exportar
          </Button>
          {permissions.canManageUsers && (
            <Button 
              icon={UserPlus}
              onClick={() => setShowCreateModal(true)}
            >
              Nuevo Usuario
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-text-title-strong">{users.length}</div>
            <div className="text-sm text-text-body">Total Usuarios</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-success">{users.filter(u => u.isActive).length}</div>
            <div className="text-sm text-text-body">Activos</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-sm text-text-body">Administradores</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">{users.filter(u => u.language === 'es').length}</div>
            <div className="text-sm text-text-body">Español</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-body" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="editor">Editor</option>
            <option value="auditor">Auditor</option>
          </select>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los idiomas</option>
            <option value="es">Español</option>
            <option value="va">Valencià</option>
            <option value="en">English</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-title">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-text-title">Rol</th>
                <th className="text-left py-3 px-4 font-medium text-text-title">Idioma</th>
                <th className="text-left py-3 px-4 font-medium text-text-title">Fecha Alta</th>
                <th className="text-left py-3 px-4 font-medium text-text-title">Última Actividad</th>
                <th className="text-left py-3 px-4 font-medium text-text-title">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-text-title">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const activityStatus = getActivityStatus(user.lastActive);
                return (
                  <tr key={user.id} className="border-b border-border hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-title-strong">{user.name}</p>
                          <p className="text-sm text-text-body">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-text-body" />
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getLanguageFlag(user.language)}</span>
                        <span className="text-text-body uppercase">{user.language}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-body">
                      {user.createdAt.toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={activityStatus.color}>
                        {activityStatus.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-text-body'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" icon={Eye}>Ver</Button>
                        {permissions.canManageUsers && (
                          <>
                            <Button variant="outline" size="sm" icon={Edit}>Editar</Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              icon={Trash2}
                              onClick={() => handleDelete(user.id)}
                            >
                              Eliminar
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nuevo Usuario"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="email@ejemplo.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Rol</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="auditor">Auditor</option>
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Idioma</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="es">Español</option>
                <option value="va">Valencià</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Contraseña temporal</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Contraseña temporal"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="isActive" className="text-sm text-text-title">
              Usuario activo
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Crear Usuario
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};