import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { POI } from '../../types';
import { mockAPI } from '../../mocks/data';
import { ArrowLeft, MapPin } from 'lucide-react';

export const ItemDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<POI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await mockAPI.getPOIs();
        const found = all.find(it => it.id === id) || null;
        setItem(found);
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

  if (!item) {
    return (
      <div className="p-6">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
        <p className="mt-4 text-text-body">Ítem no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-title-strong text-lg font-medium">{item.name}</h2>
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <img src={item.featuredImage} alt={item.name} className="w-full h-80 object-cover rounded-lg" />
            <p className="mt-4 text-text-body whitespace-pre-line">{item.description}</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-text-body">Tipo</div>
              <div className="font-medium">{item.type}</div>
            </div>
            <div>
              <div className="text-sm text-text-body">Categoría</div>
              <div className="font-medium">{item.category}</div>
            </div>
            <div className="flex items-center text-sm text-text-body">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{item.address || '—'}</span>
            </div>
            <div>
              <div className="text-sm text-text-body">Ocupación</div>
              <div className="font-medium">{item.occupancy}%</div>
            </div>
            {!!item.features?.length && (
              <div>
                <div className="text-sm text-text-body mb-2">Características</div>
                <div className="flex flex-wrap gap-1">
                  {item.features.map((f) => (
                    <span key={f} className="px-2 py-1 bg-gray-100 text-xs rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
