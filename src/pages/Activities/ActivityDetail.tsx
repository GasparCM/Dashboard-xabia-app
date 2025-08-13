import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Activity } from '../../types';
import { mockAPI } from '../../mocks/data';
import { ArrowLeft, Clock, Users, Link2 } from 'lucide-react';

export const ActivityDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await mockAPI.getActivities();
        const found = all.find(a => a.id === id) || null;
        setActivity(found);
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

  if (!activity) {
    return (
      <div className="p-6">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
        <p className="mt-4 text-text-body">Actividad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-title-strong text-lg font-medium">{activity.name}</h2>
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <img src={activity.featuredImage} alt={activity.name} className="w-full h-80 object-cover rounded-lg" />
            <p className="mt-4 text-text-body whitespace-pre-line">{activity.description}</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-text-body">Categoría</div>
              <div className="font-medium">{activity.category}</div>
            </div>
            <div className="flex items-center text-sm text-text-body">
              <Clock className="w-4 h-4 mr-2" />
              <span>Duración: {activity.duration} min</span>
            </div>
            <div className="flex items-center text-sm text-text-body">
              <Users className="w-4 h-4 mr-2" />
              <span>Aforo máximo: {activity.maxCapacity}</span>
            </div>
            <div>
              <div className="text-sm text-text-body">Precio</div>
              <div className="font-medium">{activity.price} €</div>
            </div>
            {activity.requiresReservation && (
              <div className="bg-warning/10 text-warning px-3 py-2 rounded-lg text-sm">
                ⚠️ Requiere reserva previa
              </div>
            )}
            {activity.reservationUrl && (
              <a href={activity.reservationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary hover:underline text-sm">
                <Link2 className="w-4 h-4 mr-1" /> Reservar
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
