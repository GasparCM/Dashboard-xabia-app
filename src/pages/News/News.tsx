import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { mockAPI } from '../../mocks/data';
import { NewsItem } from '../../types';
import { usePermissions } from '../../store/AppContext';
import toast from 'react-hot-toast';

export const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem[]>([]);
  const permissions = usePermissions();

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await mockAPI.getNews();
        setNews(data);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNews = async (newsData: any) => {
    try {
      const newNews = await mockAPI.createNews(newsData);
      setNews([newNews, ...news]);
      setShowCreateModal(false);
      toast.success('Noticia creada exitosamente');
    } catch (error) {
      toast.error('Error al crear la noticia');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      setNews(news.filter(item => item.id !== id));
      toast.success('Noticia eliminada');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success/10 text-success';
      case 'scheduled': return 'bg-warning/10 text-warning';
      default: return 'bg-gray-100 text-text-body';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'scheduled': return 'Programado';
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
          <h2 className="text-text-title-strong text-lg font-medium">Gestión de Noticias</h2>
          <p className="text-text-body mt-1">{filteredNews.length} noticias encontradas</p>
        </div>
        <div className="flex items-center gap-3">
          {permissions.canCreate && (
            <Button 
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Nueva Noticia
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
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="scheduled">Programado</option>
            <option value="published">Publicado</option>
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
              className={`p-2 rounded-r-lg ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-text-body hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* News Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Card key={item.id} className="overflow-hidden" hover>
              <img 
                src={item.coverImage} 
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-text-title-strong line-clamp-2">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
                <p className="text-sm text-text-body line-clamp-3">{item.summary}</p>
                <div className="flex items-center justify-between text-xs text-text-body">
                  <span>{item.author}</span>
                  <span>{item.publishDate.toLocaleDateString('es-ES')}</span>
                </div>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
                  <th className="text-left py-3 px-4 font-medium text-text-title">Título</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Autor</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.coverImage} 
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-text-title-strong">{item.title}</p>
                          <p className="text-sm text-text-body truncate max-w-xs">{item.summary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-body">{item.author}</td>
                    <td className="py-3 px-4 text-text-body">
                      {item.publishDate.toLocaleDateString('es-ES')}
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
        title="Nueva Noticia"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Título</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Título de la noticia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Resumen</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Resumen breve de la noticia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Estado</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="draft">Borrador</option>
              <option value="scheduled">Programar</option>
              <option value="published">Publicar</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleCreateNews({})}>
              Crear Noticia
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};