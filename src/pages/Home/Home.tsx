import React, { useEffect, useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Calendar,
  Users,
  Activity,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { CustomLineChart } from "../../components/Charts/LineChart";
import { CustomBarChart } from "../../components/Charts/BarChart";
import { DonutChart } from "../../components/Charts/DonutChart";
import { mockAPI } from "../../mocks/data";
import { KPI, ChartData, NewsItem, Event, Notice, POI } from "../../types";
import { usePermissions } from "../../store/AppContext";
import { useExportReport } from "../../hooks/useExportReport";

export const Home: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [visitsChart, setVisitsChart] = useState<ChartData | null>(null);
  const [categoriesChart, setCategoriesChart] = useState<ChartData | null>(
    null
  );
  const [languagesChart, setLanguagesChart] = useState<ChartData | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const permissions = usePermissions();
  const { exportReport } = useExportReport();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          kpisData,
          visitsData,
          categoriesData,
          languagesData,
          newsData,
          eventsData,
          noticesData,
          poisData,
        ] = await Promise.all([
          mockAPI.getKPIs(),
          mockAPI.getChartData("visits"),
          mockAPI.getChartData("categories"),
          mockAPI.getChartData("languages"),
          mockAPI.getNews(),
          mockAPI.getEvents(),
          mockAPI.getNotices(),
          mockAPI.getPOIs(),
        ]);

        setKpis(kpisData);
        setVisitsChart(visitsData);
        setCategoriesChart(categoriesData);
        setLanguagesChart(languagesData);
        setLatestNews(newsData.slice(0, 5));
        setUpcomingEvents(eventsData.slice(0, 5));
        setNotices(noticesData);
        setPois(poisData);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getKpiIcon = (iconName: string) => {
    const icons = {
      users: Users,
      activity: Activity,
      "map-pin": MapPin,
      "check-circle": CheckCircle,
    };
    return icons[iconName as keyof typeof icons] || Activity;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 animate-pulse rounded-card"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 animate-pulse rounded-card"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-text-title-strong text-lg font-medium">
            Bienvenido al Panel de Administración
          </h2>
          <p className="text-text-body mt-1">
            Resumen de la actividad de Xàbia App
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Download}
            onClick={() =>
              exportReport({
                title: "Informe del Panel",
                subtitle: "Xàbia App · Resumen general",
                kpis,
                charts: {
                  visits: visitsChart || undefined,
                  categories: categoriesChart || undefined,
                  languages: languagesChart || undefined,
                },
                extraNotes: [
                  `Noticias recientes: ${latestNews.length}`,
                  `Próximos eventos: ${upcomingEvents.length}`,
                  `Avisos activos: ${notices.length}`,
                  `POIs totales: ${pois.length}`,
                ],
              })
            }
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = getKpiIcon(kpi.icon || "activity");
          return (
            <Card key={index} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-body text-sm">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-text-title-strong mt-1">
                    {kpi.value}
                  </p>
                  {kpi.change && (
                    <div
                      className={`flex items-center mt-2 text-sm ${
                        kpi.changeType === "increase"
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {kpi.changeType === "increase" ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(kpi.change)}%
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Visitas Últimos 30 Días
            </h3>
            <Button variant="outline" size="sm">
              Ver más
            </Button>
          </div>
          {visitsChart && <CustomLineChart data={visitsChart} />}
        </Card>

        {/* Categories Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Top Categorías Vistas
            </h3>
            <Button variant="outline" size="sm">
              Ver más
            </Button>
          </div>
          {categoriesChart && <CustomBarChart data={categoriesChart} />}
        </Card>

        {/* Languages Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Distribución de Idioma
            </h3>
            <Button variant="outline" size="sm">
              Ver más
            </Button>
          </div>
          {languagesChart && <DonutChart data={languagesChart} />}
        </Card>

        {/* Latest News */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Últimas Noticias
            </h3>
            <Button variant="outline" size="sm">
              Ver todas
            </Button>
          </div>
          <div className="space-y-3">
            {latestNews.map((news) => (
              <div
                key={news.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <img
                  src={news.coverImage}
                  alt={news.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-title-strong truncate">
                    {news.title}
                  </p>
                  <p className="text-xs text-text-body">
                    {news.publishDate.toLocaleDateString("es-ES")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    news.status === "published"
                      ? "bg-success/10 text-success"
                      : news.status === "scheduled"
                      ? "bg-warning/10 text-warning"
                      : "bg-gray-100 text-text-body"
                  }`}
                >
                  {news.status === "published"
                    ? "Publicado"
                    : news.status === "scheduled"
                    ? "Programado"
                    : "Borrador"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-title-strong font-medium">
            Resumen de Contenidos
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-text-title-strong">
              {latestNews.length}
            </div>
            <div className="text-sm text-text-body">Noticias recientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-text-title-strong">
              {upcomingEvents.length}
            </div>
            <div className="text-sm text-text-body">Próximos eventos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-text-title-strong">
              {notices.length}
            </div>
            <div className="text-sm text-text-body">Avisos activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-text-title-strong">
              {pois.length}
            </div>
            <div className="text-sm text-text-body">POIs totales</div>
          </div>
        </div>
      </Card>

      {/* High Occupancy Beaches Alerts */}
      {pois.filter((p) => p.type === "beach" && p.occupancy > 70).length >
        0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Alertas de ocupación en playas
            </h3>
          </div>
          <div className="space-y-3">
            {pois
              .filter((p) => p.type === "beach" && p.occupancy > 70)
              .slice(0, 5)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-error/5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.featuredImage}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-title-strong">
                        {p.name}
                      </p>
                      <p className="text-xs text-text-body">
                        Ocupación: {p.occupancy}%
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-error/10 text-error">
                    Alta
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Upcoming Events */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-title-strong font-medium flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Próximos Eventos
          </h3>
          <Button variant="outline" size="sm">
            Ver todos
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-text-title-strong mb-1">
                {event.title}
              </h4>
              <p className="text-sm text-text-body mb-2 line-clamp-2">
                {event.description}
              </p>
              <div className="flex items-center justify-between text-xs text-text-body">
                <span>{event.startDate.toLocaleDateString("es-ES")}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {event.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
