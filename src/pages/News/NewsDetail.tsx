import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { NewsItem } from '../../types';
import { mockAPI } from '../../mocks/data';
import { ArrowLeft } from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await mockAPI.getNews();
        const found = all.find(n => n.id === id) || null;
        setNews(found);
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

  if (!news) {
    return (
      <div className="p-6">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
        <p className="mt-4 text-text-body">Noticia no encontrada</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-title-strong text-lg font-medium">{news.title}</h2>
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Volver</Button>
      </div>

      <Card className="overflow-hidden">
        <img src={news.coverImage} alt={news.title} className="w-full h-96 object-cover rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <p className="text-text-body whitespace-pre-line">{news.content}</p>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-text-body">Autor</div>
            <div className="font-medium">{news.author}</div>
            <div className="text-sm text-text-body mt-4">Publicado</div>
            <div className="font-medium">{news.publishDate.toLocaleDateString('es-ES')}</div>
            {news.tags.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-text-body mb-2">Etiquetas</div>
                <div className="flex flex-wrap gap-1">
                  {news.tags.map((t) => (
                    <span key={t} className="px-2 py-1 bg-gray-100 text-xs rounded-full">{t}</span>
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
