import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Eye, Edit, Trash2, Map, List, Grid } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { mockAPI } from '../../mocks/data';
import { POI } from '../../types';
import { usePermissions } from '../../store/AppContext';
import toast from 'react-hot-toast';

export const Items: React.FC = () => {
  const [items, setItems] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOccupancy, setSelectedOccupancy] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const permissions = usePermissions();

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await mockAPI.getPOIs();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesOccupancy = selectedOccupancy === 'all' || 
      (selectedOccupancy === 'low' && item.occupancy <= 30) ||
      (selectedOccupancy === 'medium' && item.occupancy > 30 && item.occupancy <= 70) ||
      (selectedOccupancy === 'high' && item.occupancy > 70);
    return matchesSearch && matchesType && matchesOccupancy;
  });

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy <= 30) return 'text-success';
    if (occupancy <= 70) return 'text-warning';
    return 'text-error';
  };

  const getOccupancyBg = (occupancy: number) => {
    if (occupancy <= 30) return 'bg-success/10';
    if (occupancy <= 70) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      beach: '🏖️',
      viewpoint: '🏔️',
      restaurant: '🍽️',
      activity: '🎯',
      shop: '🛍️',
      park: '🌳',
      sports: '⚽'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ítem?')) {
      setItems(items.filter(item => item.id !== id));
      toast.success('Ítem eliminado');
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
          <h2 className="text-text-title-strong text-lg font-medium">Gestión de Ítems/POIs</h2>
          <p className="text-text-body mt-1">{filteredItems.length} ítems encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          {permissions.canCreate && (
            <Button 
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Nuevo Ítem
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-text-body" />
            <input
              type="text"
              placeholder="Buscar ítems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="beach">Playas</option>
            <option value="viewpoint">Miradores</option>
            <option value="restaurant">Restaurantes</option>
            <option value="activity">Actividades</option>
            <option value="shop">Tiendas</option>
            <option value="park">Parques</option>
            <option value="sports">Deportes</option>
          </select>

          {/* Occupancy Filter */}
          <select
            value={selectedOccupancy}
            onChange={(e) => setSelectedOccupancy(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Toda ocupación</option>
            <option value="low">Baja (0-30%)</option>
            <option value="medium">Media (31-70%)</option>
            <option value="high">Alta (71-100%)</option>
          </select>

          {/* View Mode Toggle */}
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
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-r-lg ${
                viewMode === 'map' ? 'bg-primary text-white' : 'text-text-body hover:bg-gray-50'
              }`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'map' ? (
        <Card>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-text-body mx-auto mb-4" />
              <p className="text-text-body">Vista de mapa - Integración con Leaflet</p>
              <p className="text-sm text-text-body mt-2">
                Aquí se mostraría un mapa interactivo con los {filteredItems.length} ítems
              </p>
            </div>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden" hover>
              <img 
                src={item.featuredImage} 
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(item.type)}</span>
                    <h3 className="font-medium text-text-title-strong">{item.name}</h3>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${getOccupancyBg(item.occupancy)} ${getOccupancyColor(item.occupancy)}`}>
                    {item.occupancy}%
                  </div>
                </div>
                <p className="text-sm text-text-body line-clamp-2">{item.description}</p>
                <div className="flex items-center text-xs text-text-body">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{item.address}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                  {item.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      +{item.features.length - 3}
                    </span>
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
                      onClick={() => handleDelete(item.id)}
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
                  <th className="text-left py-3 px-4 font-medium text-text-title">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Ocupación</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Ubicación</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.featuredImage} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-text-title-strong">{item.name}</p>
                          <p className="text-sm text-text-body">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                        <span className="text-text-body capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getOccupancyBg(item.occupancy)} ${getOccupancyColor(item.occupancy)}`}>
                        {item.occupancy}%
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-body max-w-xs truncate">{item.address}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-text-body'
                      }`}>
                        {item.isActive ? 'Activo' : 'Inactivo'}
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
                            onClick={() => handleDelete(item.id)}
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
        title="Nuevo Ítem/POI"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nombre del lugar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="beach">Playa</option>
                <option value="viewpoint">Mirador</option>
                <option value="restaurant">Restaurante</option>
                <option value="activity">Actividad</option>
                <option value="shop">Tienda</option>
                <option value="park">Parque</option>
                <option value="sports">Deportes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Descripción</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descripción del lugar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Dirección</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Dirección completa"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Crear Ítem
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};