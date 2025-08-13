import React, { useState, useEffect } from 'react';
import { Plus, Search, Bell, AlertCircle, Info, Gift, Eye, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { mockAPI } from '../../mocks/data';
import { Notification } from '../../types';
import { usePermissions } from '../../store/AppContext';
import toast from 'react-hot-toast';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const permissions = usePermissions();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await mockAPI.getNotifications();
        setNotifications(data);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const openEdit = (n: Notification) => {
    setEditingNotification(n);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingNotification) return;
    setNotifications(prev => prev.map(n => n.id === editingNotification.id ? { ...n, ...editingNotification } : n));
    setShowEditModal(false);
    toast.success('Notificación actualizada');
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      setNotifications(notifications.filter(notification => notification.id !== id));
      toast.success('Notificación eliminada');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return Bell;
      case 'update': return Info;
      case 'promotion': return Gift;
      case 'alert': return AlertCircle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'text-primary';
      case 'update': return 'text-success';
      case 'promotion': return 'text-warning';
      case 'alert': return 'text-error';
      default: return 'text-primary';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-primary/10';
      case 'update': return 'bg-success/10';
      case 'promotion': return 'bg-warning/10';
      case 'alert': return 'bg-error/10';
      default: return 'bg-primary/10';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'reminder': return 'Recordatorio';
      case 'update': return 'Actualización';
      case 'promotion': return 'Promoción';
      case 'alert': return 'Alerta';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-success/10 text-success';
      case 'scheduled': return 'bg-warning/10 text-warning';
      default: return 'bg-gray-100 text-text-body';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviada';
      case 'scheduled': return 'Programada';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-text-title-strong text-lg font-medium">Gestión de Notificaciones</h2>
          <p className="text-text-body mt-1">{filteredNotifications.length} notificaciones encontradas</p>
        </div>
        <div className="flex items-center gap-3">
          {permissions.canCreate && (
            <Button 
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Nueva Notificación
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-text-title-strong">{notifications.length}</div>
            <div className="text-sm text-text-body">Total</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-success">{notifications.filter(n => n.status === 'sent').length}</div>
            <div className="text-sm text-text-body">Enviadas</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning">{notifications.filter(n => n.status === 'scheduled').length}</div>
            <div className="text-sm text-text-body">Programadas</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">85%</div>
            <div className="text-sm text-text-body">Tasa Apertura</div>
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
              placeholder="Buscar notificaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="reminder">Recordatorio</option>
            <option value="update">Actualización</option>
            <option value="promotion">Promoción</option>
            <option value="alert">Alerta</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="scheduled">Programada</option>
            <option value="sent">Enviada</option>
          </select>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const TypeIcon = getTypeIcon(notification.type);
          return (
            <Card key={notification.id} hover>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getTypeBg(notification.type)}`}>
                  <TypeIcon className={`w-6 h-6 ${getTypeColor(notification.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-text-title-strong mb-1">{notification.title}</h3>
                      <p className="text-text-body text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-text-body">
                        <span className={`px-2 py-1 rounded-full ${getTypeBg(notification.type)} ${getTypeColor(notification.type)}`}>
                          {getTypeText(notification.type)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notification.status)}`}>
                          {getStatusText(notification.status)}
                        </span>
                        {notification.scheduledDate && (
                          <span>
                            Programada: {notification.scheduledDate.toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {notification.sentDate && (
                          <span>
                            Enviada: {notification.sentDate.toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {notification.targetUser && (
                          <span>
                            Usuario: {notification.targetUser}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" icon={Eye}>
                        Ver
                      </Button>
                      {permissions.canEdit && notification.status === 'scheduled' && (
                        <Button variant="outline" size="sm" icon={Edit} onClick={() => openEdit(notification)}>
                          Editar
                        </Button>
                      )}
                      {permissions.canDelete && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Trash2}
                          onClick={() => handleDelete(notification.id)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nueva Notificación"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Título</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Título de la notificación"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Mensaje</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Contenido del mensaje"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="reminder">Recordatorio</option>
                <option value="update">Actualización</option>
                <option value="promotion">Promoción</option>
                <option value="alert">Alerta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Fecha programada</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Enlace interno (opcional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="/events/123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Usuario específico (opcional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Dejar vacío para enviar a todos"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Crear Notificación
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Notificación"
        size="lg"
      >
        {editingNotification && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Título</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={editingNotification.title}
                onChange={(e) => setEditingNotification({ ...editingNotification, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Mensaje</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={editingNotification.message}
                onChange={(e) => setEditingNotification({ ...editingNotification, message: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">Tipo</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={editingNotification.type}
                  onChange={(e) => setEditingNotification({ ...editingNotification, type: e.target.value as any })}
                >
                  <option value="reminder">Recordatorio</option>
                  <option value="update">Actualización</option>
                  <option value="promotion">Promoción</option>
                  <option value="alert">Alerta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">Fecha programada</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={editingNotification.scheduledDate ? new Date(editingNotification.scheduledDate).toISOString().slice(0,16) : ''}
                  onChange={(e) => setEditingNotification({ ...editingNotification, scheduledDate: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">Usuario específico (opcional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={editingNotification.targetUser || ''}
                  onChange={(e) => setEditingNotification({ ...editingNotification, targetUser: e.target.value || undefined })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">Enlace interno (opcional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={(editingNotification as any).link || ''}
                  onChange={(e) => setEditingNotification({ ...(editingNotification as any), link: e.target.value || undefined })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancelar</Button>
              <Button onClick={handleSaveEdit}>Guardar cambios</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};