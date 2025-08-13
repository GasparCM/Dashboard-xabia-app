import React, { useState, useEffect } from 'react';
import { Plus, Search, Megaphone, AlertTriangle, Construction, Car, Eye, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { mockAPI } from '../../mocks/data';
import { Notice } from '../../types';
import { usePermissions } from '../../store/AppContext';
import toast from 'react-hot-toast';

export const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const permissions = usePermissions();

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await mockAPI.getNotices();
        setNotices(data);
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este aviso?')) {
      setNotices(notices.filter(notice => notice.id !== id));
      toast.success('Aviso eliminado');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'obras': return Construction;
      case 'trafico': return Car;
      case 'emergencias': return AlertTriangle;
      default: return Megaphone;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'obras': return 'text-warning';
      case 'trafico': return 'text-error';
      case 'emergencias': return 'text-error';
      default: return 'text-primary';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'obras': return 'bg-warning/10';
      case 'trafico': return 'bg-error/10';
      case 'emergencias': return 'bg-error/10';
      default: return 'bg-primary/10';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'obras': return 'Obras';
      case 'trafico': return 'Tráfico';
      case 'emergencias': return 'Emergencias';
      default: return 'General';
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
          <h2 className="text-text-title-strong text-lg font-medium">Gestión de Avisos Municipales</h2>
          <p className="text-text-body mt-1">{filteredNotices.length} avisos encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          {permissions.canCreate && (
            <Button 
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Nuevo Aviso
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-body" />
            <input
              type="text"
              placeholder="Buscar avisos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            <option value="obras">Obras</option>
            <option value="trafico">Tráfico</option>
            <option value="emergencias">Emergencias</option>
            <option value="general">General</option>
          </select>
        </div>
      </Card>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const CategoryIcon = getCategoryIcon(notice.category);
          return (
            <Card key={notice.id} hover>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getCategoryBg(notice.category)}`}>
                  <CategoryIcon className={`w-6 h-6 ${getCategoryColor(notice.category)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-text-title-strong mb-1">{notice.title}</h3>
                      <p className="text-text-body text-sm mb-2">{notice.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-text-body">
                        <span>{notice.date.toLocaleDateString('es-ES')}</span>
                        <span className={`px-2 py-1 rounded-full ${getCategoryBg(notice.category)} ${getCategoryColor(notice.category)}`}>
                          {getCategoryText(notice.category)}
                        </span>
                        {notice.sendPush && (
                          <span className="flex items-center text-primary">
                            <Megaphone className="w-3 h-3 mr-1" />
                            Push enviado
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notice.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-text-body'
                        }`}>
                          {notice.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" icon={Eye}>
                        Ver
                      </Button>
                      {permissions.canEdit && (
                        <Button variant="outline" size="sm" icon={Edit}>
                          Editar
                        </Button>
                      )}
                      {permissions.canDelete && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Trash2}
                          onClick={() => handleDelete(notice.id)}
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
        title="Nuevo Aviso Municipal"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Título</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Título del aviso"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Descripción</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descripción detallada del aviso"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Categoría</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="general">General</option>
                <option value="obras">Obras</option>
                <option value="trafico">Tráfico</option>
                <option value="emergencias">Emergencias</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Fecha</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendPush"
                className="mr-2"
              />
              <label htmlFor="sendPush" className="text-sm text-text-title">
                Enviar notificación push
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                className="mr-2"
                defaultChecked
              />
              <label htmlFor="isActive" className="text-sm text-text-title">
                Aviso activo
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Crear Aviso
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};