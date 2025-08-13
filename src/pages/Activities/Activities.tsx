import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Clock, Users, Euro, Eye, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { mockAPI } from '../../mocks/data';
import { Activity } from '../../types';
import { usePermissions } from '../../store/AppContext';
import toast from 'react-hot-toast';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export const Activities: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Deportes Acuáticos');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(60);
  const [editMaxCapacity, setEditMaxCapacity] = useState<number>(0);
  const [editDescription, setEditDescription] = useState('');
  const [editRequiresReservation, setEditRequiresReservation] = useState(false);
  const permissions = usePermissions();

  // Eventos de calendario inventados a partir de las actividades
  const calendarEvents = useMemo(() => {
    const events: { id: string; title: string; start: string; end: string }[] = [];
    // Obtener próximo lunes
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = (1 - day + 7) % 7 || 7; // próximo lunes siempre en el futuro
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + diffToMonday);
    nextMonday.setHours(10, 0, 0, 0);

    activities.forEach((a) => {
      // Dos sesiones por actividad: lunes 10:00 y miércoles 17:00 de la próxima semana
      const d1 = new Date(nextMonday);
      const d2 = new Date(nextMonday);
      d2.setDate(d2.getDate() + 2); // miércoles
      d2.setHours(17, 0, 0, 0);

      const dur = Math.max(30, a.duration || 60); // duración segura

      const end1 = new Date(d1.getTime() + dur * 60000);
      const end2 = new Date(d2.getTime() + dur * 60000);

      events.push({
        id: `${a.id}-1`,
        title: `${a.name} (${a.category})`,
        start: d1.toISOString(),
        end: end1.toISOString(),
      });
      events.push({
        id: `${a.id}-2`,
        title: `${a.name} (${a.category})`,
        start: d2.toISOString(),
        end: end2.toISOString(),
      });
    });
    // Si no hay actividades aún, poner un placeholder
    if (events.length === 0) {
      const s = new Date(nextMonday);
      const e = new Date(s.getTime() + 60 * 60000);
      events.push({ id: 'placeholder', title: 'Sesión de demostración', start: s.toISOString(), end: e.toISOString() });
    }
    return events;
  }, [activities]);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await mockAPI.getActivities();
        setActivities(data);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      setActivities(activities.filter(activity => activity.id !== id));
      toast.success('Actividad eliminada');
    }
  };

  const openEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setEditName(activity.name);
    setEditCategory(activity.category);
    setEditPrice(activity.price);
    setEditDuration(activity.duration);
    setEditMaxCapacity(activity.maxCapacity);
    setEditDescription(activity.description);
    setEditRequiresReservation(activity.requiresReservation);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editingActivity) return;
    const updated: Activity = {
      ...editingActivity,
      name: editName,
      category: editCategory,
      price: editPrice,
      duration: editDuration,
      maxCapacity: editMaxCapacity,
      description: editDescription,
      requiresReservation: editRequiresReservation,
    };
    setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    setShowEditModal(false);
    setEditingActivity(null);
    toast.success('Actividad actualizada');
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
          <h2 className="text-text-title-strong text-lg font-medium">Gestión de Actividades</h2>
          <p className="text-text-body mt-1">{filteredActivities.length} actividades encontradas</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            icon={Calendar}
            onClick={() => setShowCalendar(true)}
          >
            Ver Calendario
          </Button>
          {permissions.canCreate && (
            <Button 
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Nueva Actividad
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
              placeholder="Buscar actividades..."
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
            <option value="Deportes Acuáticos">Deportes Acuáticos</option>
            <option value="Excursiones">Excursiones</option>
            <option value="Instalaciones Deportivas">Instalaciones Deportivas</option>
            <option value="Turismo Activo">Turismo Activo</option>
          </select>
        </div>
      </Card>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden" hover>
            <img 
              src={activity.featuredImage} 
              alt={activity.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-text-title-strong">{activity.name}</h3>
                <div className="flex items-center text-primary font-semibold">
                  <Euro className="w-4 h-4 mr-1" />
                  {activity.price}
                </div>
              </div>
              <p className="text-sm text-text-body line-clamp-2">{activity.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-text-body">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {activity.duration} min
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Max {activity.maxCapacity}
                </div>
              </div>

              {activity.requiresReservation && (
                <div className="bg-warning/10 text-warning px-3 py-2 rounded-lg text-sm">
                  ⚠️ Requiere reserva previa
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {activity.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" icon={Eye} onClick={() => navigate(`/activities/${activity.id}`)}>
                  Ver
                </Button>
                {permissions.canEdit && (
                  <Button variant="outline" size="sm" icon={Edit} onClick={() => openEdit(activity)}>
                    Editar
                  </Button>
                )}
                {permissions.canDelete && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={Trash2}
                    onClick={() => handleDelete(activity.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nueva Actividad"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nombre de la actividad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Categoría</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="Deportes Acuáticos">Deportes Acuáticos</option>
                <option value="Excursiones">Excursiones</option>
                <option value="Instalaciones Deportivas">Instalaciones Deportivas</option>
                <option value="Turismo Activo">Turismo Activo</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Precio (€)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Duración (min)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Aforo máximo</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Descripción</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descripción de la actividad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requiresReservation"
              className="mr-2"
            />
            <label htmlFor="requiresReservation" className="text-sm text-text-title">
              Requiere reserva previa
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Crear Actividad
            </Button>
          </div>
        </div>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        title="Calendario de Disponibilidad"
        size="xl"
      >
        <div className="h-[600px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            height="100%"
            events={calendarEvents}
            selectable={true}
            selectMirror={true}
            nowIndicator={true}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Actividad"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Nombre</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nombre de la actividad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Categoría</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Deportes Acuáticos">Deportes Acuáticos</option>
                <option value="Excursiones">Excursiones</option>
                <option value="Instalaciones Deportivas">Instalaciones Deportivas</option>
                <option value="Turismo Activo">Turismo Activo</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Precio (€)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Duración (min)</label>
              <input
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">Aforo máximo</label>
              <input
                type="number"
                value={editMaxCapacity}
                onChange={(e) => setEditMaxCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Descripción</label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descripción de la actividad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="editRequiresReservation"
              checked={editRequiresReservation}
              onChange={(e) => setEditRequiresReservation(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="editRequiresReservation" className="text-sm text-text-title">
              Requiere reserva previa
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEdit}>
              Guardar cambios
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};