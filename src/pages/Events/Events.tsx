import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Grid,
  List,
} from "lucide-react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Modal } from "../../components/UI/Modal";
import { mockAPI } from "../../mocks/data";
import { Event } from "../../types";
import { usePermissions } from "../../store/AppContext";
import toast from "react-hot-toast";
import { useTranslation } from "../../hooks/useTranslation";
// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import esLocale from "@fullcalendar/core/locales/es";
import caLocale from "@fullcalendar/core/locales/ca";

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">(
    "grid"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const permissions = usePermissions();

  const localeCode = language === 'va' ? 'ca-ES' : language === 'es' ? 'es-ES' : 'en-GB';

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

  // Mapear eventos a formato FullCalendar
  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.startDate,
    end: e.endDate,
    allDay: false,
  }));

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || event.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm(t('events.confirmDelete'))) {
      setEvents(events.filter((event) => event.id !== id));
      toast.success(t('events.deleted'));
    }
  };

  const openEdit = (ev: Event) => {
    setEditingEvent({ ...ev });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingEvent) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === editingEvent.id ? { ...e, ...editingEvent } : e
      )
    );
    setShowEditModal(false);
    toast.success(t('events.updated'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-success/10 text-success";
      default:
        return "bg-gray-100 text-text-body";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return t('status.published');
      default:
        return t('status.draft');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <h2 className="text-text-title-strong text-lg font-medium">
            {t('events.title')}
          </h2>
          <p className="text-text-body mt-1">
            {t('events.found').replace('{count}', String(filteredEvents.length))}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {permissions.canCreate && (
            <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
              {t('events.new')}
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
              placeholder={t('events.searchPlaceholder')}
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
            <option value="all">{t('events.allCategories')}</option>
            <option value="Tradiciones">{t('events.cat.traditions')}</option>
            <option value="Cultura">{t('events.cat.culture')}</option>
            <option value="Deportes">{t('events.cat.sports')}</option>
            <option value="Música">{t('events.cat.music')}</option>
            <option value="Gastronomía">{t('events.cat.food')}</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{t('events.allStatuses')}</option>
            <option value="draft">{t('status.draft')}</option>
            <option value="published">{t('status.published')}</option>
          </select>

          <div className="flex border border-border rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-l-lg ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-text-body hover:bg-gray-50"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-text-body hover:bg-gray-50"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-r-lg ${
                viewMode === "calendar"
                  ? "bg-primary text-white"
                  : "text-text-body hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "calendar" ? (
        <Card>
          <div className="p-2">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              height="70vh"
              events={calendarEvents}
              locales={[esLocale, caLocale]}
              eventClick={(info) => {
                const ev = events.find((e) => e.id === info.event.id);
                if (ev) openEdit(ev);
              }}
              dateClick={() => {
                // Vista previa: dejamos solo navegación por ahora
              }}
              locale={language === 'va' ? 'ca' : language}
            />
          </div>
        </Card>
      ) : viewMode === "grid" ? (
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
                  <h3 className="font-medium text-text-title-strong line-clamp-2">
                    {event.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusText(event.status)}
                  </span>
                </div>
                <p className="text-sm text-text-body line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-text-body">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.startDate.toLocaleDateString(localeCode)}
                    {event.startDate.getTime() !== event.endDate.getTime() &&
                      ` - ${event.endDate.toLocaleDateString(localeCode)}`}
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
                    <span className="text-xs text-success">{t('common.public')}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" icon={Eye} onClick={() => navigate(`/events/${event.id}`)}>
                    Ver
                  </Button>
                  {permissions.canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit}
                      onClick={() => openEdit(event)}
                    >
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
                  <th className="text-left py-3 px-4 font-medium text-text-title">{t('events.event')}</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">{t('events.date')}</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">{t('events.location')}</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">{t('events.category')}</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">{t('events.status')}</th>
                  <th className="text-left py-3 px-4 font-medium text-text-title">{t('events.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-text-title-strong">
                            {event.title}
                          </p>
                          <p className="text-sm text-text-body truncate max-w-xs">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-body">
                      {event.startDate.toLocaleDateString(localeCode)}
                    </td>
                    <td className="py-3 px-4 text-text-body max-w-xs truncate">
                      {event.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {event.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" icon={Eye} onClick={() => navigate(`/events/${event.id}`)}>
                          {t('common.view')}
                        </Button>
                        {permissions.canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit}
                            onClick={() => openEdit(event)}
                          >
                            {t('common.edit')}
                          </Button>
                        )}
                        {permissions.canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDelete(event.id)}
                          >
                            {t('common.delete')}
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
            <label className="block text-sm font-medium text-text-title mb-1">
              Título
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Título del evento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-title mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descripción del evento"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">
                Fecha inicio
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">
                Fecha fin
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">
                Ubicación
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ubicación del evento"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">
                Categoría
              </label>
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
              <input type="checkbox" id="isPublic" className="mr-2" />
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

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Evento"
        size="lg"
      >
        {editingEvent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">
                Título
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-title mb-1">
                Descripción
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={editingEvent.description}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">
                  Fecha inicio
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={
                    editingEvent.startDate
                      ? new Date(editingEvent.startDate)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      startDate: e.target.value
                        ? new Date(e.target.value)
                        : editingEvent.startDate,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">
                  Fecha fin
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={
                    editingEvent.endDate
                      ? new Date(editingEvent.endDate)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      endDate: e.target.value
                        ? new Date(e.target.value)
                        : editingEvent.endDate,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-title mb-1">
                  Categoría
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={editingEvent.category}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      category: e.target.value as any,
                    })
                  }
                >
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
                  id="isPublicEdit"
                  className="mr-2"
                  checked={!!editingEvent.isPublic}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      isPublic: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="isPublicEdit"
                  className="text-sm text-text-title"
                >
                  Evento público
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
