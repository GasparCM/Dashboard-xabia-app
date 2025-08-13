import React, { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Eye,
  Clock,
} from "lucide-react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { CustomLineChart } from "../../components/Charts/LineChart";
import { CustomBarChart } from "../../components/Charts/BarChart";
import { DonutChart } from "../../components/Charts/DonutChart";
import { mockAPI } from "../../mocks/data";
import { KPI, ChartData } from "../../types";
import { useExportReport } from "../../hooks/useExportReport";

export const Analytics: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [sessionsChart, setSessionsChart] = useState<ChartData | null>(null);
  const [categoriesChart, setCategoriesChart] = useState<ChartData | null>(
    null
  );
  const [languagesChart, setLanguagesChart] = useState<ChartData | null>(null);
  const [retentionChart, setRetentionChart] = useState<ChartData | null>(null);
  const [hourlyChart, setHourlyChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const { exportReport } = useExportReport();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [
          kpisData,
          sessionsData,
          categoriesData,
          languagesData,
          hourlyData,
        ] = await Promise.all([
          mockAPI.getKPIs(),
          mockAPI.getChartData("visits"),
          mockAPI.getChartData("categories"),
          mockAPI.getChartData("languages"),
          mockAPI.getChartData("hourly"),
        ]);

        setKpis(kpisData);
        setSessionsChart(sessionsData);
        setCategoriesChart(categoriesData);
        setLanguagesChart(languagesData);
        setHourlyChart(hourlyData);

        // Mock retention data
        setRetentionChart({
          labels: ["D1", "D3", "D7", "D14", "D30"],
          datasets: [
            {
              label: "Retención (%)",
              data: [85, 72, 58, 45, 32],
              borderColor: "#00788A",
              backgroundColor: "rgba(0, 120, 138, 0.1)",
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [dateRange, selectedLanguage]);

  const getKpiIcon = (iconName: string) => {
    const icons = {
      users: Users,
      activity: Activity,
      "map-pin": Eye,
      "check-circle": Clock,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-text-title-strong text-lg font-medium">
            Estadísticas y Analíticas
          </h2>
          <p className="text-text-body mt-1">
            Análisis detallado del uso de Xàbia App
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Download}
            onClick={() =>
              exportReport({
                title: "Informe de Analítica",
                subtitle: "Xàbia App · Gestión y Analítica",
                kpis,
                charts: {
                  sessions: sessionsChart || undefined,
                  hourly: hourlyChart || undefined,
                  categories: categoriesChart || undefined,
                  languages: languagesChart || undefined,
                },
              })
            }
          >
            Exportar Datos
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-text-body" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-text-body" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos los idiomas</option>
              <option value="es">Español</option>
              <option value="va">Valencià</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </Card>

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
                      {Math.abs(kpi.change)}% vs período anterior
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
        {/* Sessions Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Sesiones Diarias
            </h3>
            <Button variant="outline" size="sm">
              Ver detalles
            </Button>
          </div>
          {sessionsChart && <CustomLineChart data={sessionsChart} />}
        </Card>

        {/* Hourly Usage Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">Uso por hora</h3>
            <Button variant="outline" size="sm">
              Ver detalles
            </Button>
          </div>
          {hourlyChart && <CustomLineChart data={hourlyChart} />}
        </Card>

        {/* Categories Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Categorías Más Visitadas
            </h3>
            <Button variant="outline" size="sm">
              Ver detalles
            </Button>
          </div>
          {categoriesChart && <CustomBarChart data={categoriesChart} />}
        </Card>

        {/* Languages Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Distribución por Idioma
            </h3>
            <Button variant="outline" size="sm">
              Ver detalles
            </Button>
          </div>
          {languagesChart && <DonutChart data={languagesChart} />}
        </Card>

        {/* Retention Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-title-strong font-medium">
              Retención de Usuarios
            </h3>
            <Button variant="outline" size="sm">
              Ver detalles
            </Button>
          </div>
          {retentionChart && <CustomLineChart data={retentionChart} />}
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Content */}
        <Card>
          <h3 className="text-text-title-strong font-medium mb-4">
            Contenido Más Popular
          </h3>
          <div className="space-y-3">
            {[
              { name: "Playa del Arenal", views: 1250, change: 12 },
              { name: "Cabo de la Nao", views: 980, change: -5 },
              { name: "Casco Histórico", views: 875, change: 8 },
              { name: "Puerto Deportivo", views: 720, change: 15 },
              { name: "Mercado Municipal", views: 650, change: -2 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-text-title-strong">
                    {item.name}
                  </p>
                  <p className="text-sm text-text-body">
                    {item.views} visualizaciones
                  </p>
                </div>
                <div
                  className={`text-sm ${
                    item.change > 0 ? "text-success" : "text-error"
                  }`}
                >
                  {item.change > 0 ? "+" : ""}
                  {item.change}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User Behavior */}
        <Card>
          <h3 className="text-text-title-strong font-medium mb-4">
            Comportamiento de Usuario
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-body">Tiempo promedio en app</span>
              <span className="font-medium text-text-title-strong">4m 32s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Páginas por sesión</span>
              <span className="font-medium text-text-title-strong">3.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Tasa de rebote</span>
              <span className="font-medium text-text-title-strong">32%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Usuarios recurrentes</span>
              <span className="font-medium text-text-title-strong">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Conversión a favoritos</span>
              <span className="font-medium text-text-title-strong">15%</span>
            </div>
          </div>
        </Card>

        {/* Device Stats */}
        <Card>
          <h3 className="text-text-title-strong font-medium mb-4">
            Dispositivos y Plataformas
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-body">📱 Móvil</span>
                <span className="font-medium text-text-title-strong">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-body">💻 Desktop</span>
                <span className="font-medium text-text-title-strong">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-body">📱 Tablet</span>
                <span className="font-medium text-text-title-strong">7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full"
                  style={{ width: "7%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
