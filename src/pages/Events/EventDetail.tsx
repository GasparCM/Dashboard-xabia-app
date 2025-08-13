import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Event } from '../../types';
import { mockAPI } from '../../mocks/data';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

export const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await mockAPI.getEvents();
        const found = all.find(e => e.id === id) || null;
        setEvent(found);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-10 w-1/4 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="h-80 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
        <p className="mt-4 text-text-body">Evento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-title-strong text-lg font-medium">{event.title}</h2>
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
      </div>

      <Card className="overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-96 object-cover rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <p className="text-text-body whitespace-pre-line">{event.description}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-sm text-text-body">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(event.startDate).toLocaleString('es-ES')} — {new Date(event.endDate).toLocaleString('es-ES')}</span>
            </div>
            <div className="flex items-center text-sm text-text-body">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <div>
              <div className="text-sm text-text-body">Categoría</div>
              <div className="font-medium">{event.category}</div>
            </div>
            <div>
              <div className="text-sm text-text-body">Estado</div>
              <div className="font-medium">{event.status}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
