import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, MapPin, Eye, Edit, Trash2, Grid, List } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { mockAPI } from '../../mocks/data';
import { Event } from '../../types';
import { usePermissions } from '../../store/AppContext';
import toast from 'react-hot-toast';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const permissions = usePermissions();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await mockAPI.getEvents();
        setEvents(data);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      setEvents(events.filter(event => event.id !== id));
      toast.success('Evento eliminado');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success/10 text-success';
      default: return 'bg-gray-100 text-text-body';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      default: return 'Borrador';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded-card"></div>
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
          <h2 className="text-text-title-strong text-lg font-medium">Gestión de Eventos</h2>
          <p className="text-text-body mt-1">{filteredEvents.length} eventos encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          {permissions.canCreate && (
            <Button 
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Nuevo Evento
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-body" />
            <input
              type="text"
              placeholder="Buscar eventos..."
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
            <option value="Tradiciones">Tradiciones</option>
            <option value="Cultura">Cultura</option>
            <option value="Deportes">Deportes</option>
            <option value="Música">Música</option>
            <option value="Gastronomía">Gastronomía</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>

          <div className="flex border border-border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-body hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-text-body hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-r-lg ${
                viewMode === 'calendar' ? 'bg-primary text-white' : 'text-text-body hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'calendar' ? (
        <Card>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-text-body mx-auto mb-4" />
              <p className="text-text-body">Vista de calendario - Eventos programados</p>
              <p className="text-sm text-text-body mt-2">
                Aquí se mostraría un calendario mensual con los {filteredEvents.length} eventos
              </p>
            </div>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden" hover>
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-text-title-strong line-clamp-2">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                </div>
                <p className="text-sm text-text-body line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 text-sm text-text-body">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.startDate.toLocaleDateString('es-ES')}
                    {event.startDate.getTime() !== event.endDate.getTime() && 
                      ` - ${event.endDate.toLocaleDateString('es-ES')}`
                    }
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {event.category}
                  </span>
                  {event.isPublic && (
                    <span className="text-xs text-success">🌐 Público</span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
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
                      onClick={() => handleDelete(event.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-text-title">Evento</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Ubicación</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-border hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-text-title-strong">{event.title}</p>
                          <p className="text-sm text-text-body truncate max-w-xs">{event.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-body">
                      {event.startDate.toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-text-body max-w-xs truncate">{event.location}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {event.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" icon={Eye}>Ver</Button>
                        {permissions.canEdit && (
                          <Button variant="outline" size="sm" icon={Edit}>Editar</Button>
                        )}
                        {permissions.canDelete && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={Trash2}
                            onClick={() => handleDelete(event.id)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nuevo Evento"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Título</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Título del evento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Descripción</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descripción del evento"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Fecha inicio</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Fecha fin</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Ubicación</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ubicación del evento"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Categoría</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="Tradiciones">Tradiciones</option>
                <option value="Cultura">Cultura</option>
                <option value="Deportes">Deportes</option>
                <option value="Música">Música</option>
                <option value="Gastronomía">Gastronomía</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm text-text-title">
                Evento público
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Crear Evento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};