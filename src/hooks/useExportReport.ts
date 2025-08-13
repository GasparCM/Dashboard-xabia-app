import { useCallback } from 'react';
import { KPI, ChartData } from '../types';

export type ExportReportParams = {
  title: string;
  subtitle?: string;
  kpis?: KPI[];
  charts?: Partial<Record<'sessions' | 'visits' | 'hourly' | 'categories' | 'languages', ChartData | null>>;
  extraNotes?: string[];
};

// Utilidad para generar barras HTML simples en el PDF (sin dependencias externas)
const renderBarList = (title: string, data: ChartData | null | undefined, maxItems = 6) => {
  if (!data) return '';
  const pairs = data.labels.map((label, i) => ({ label, value: Number((data.datasets?.[0]?.data?.[i] as any) ?? 0) }));
  const top = pairs
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems);
  const maxVal = Math.max(...top.map(p => p.value), 1);
  const items = top
    .map(p => `
      <div style="margin:6px 0;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
          <span>${p.label}</span>
          <span>${p.value}</span>
        </div>
        <div style="height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden;">
          <div style="height:100%;width:${(p.value / maxVal) * 100}%;background:#00788A;"></div>
        </div>
      </div>`)
    .join('');
  return `
    <div class="card">
      <h2>${title}</h2>
      ${items || '<div style="font-size:12px;color:#6b7280;">Sin datos</div>'}
    </div>`;
};

// Construye narrativa básica a partir de Charts
const buildInsights = (charts: ExportReportParams['charts']) => {
  const insights: string[] = [];
  const sessions = charts?.sessions || charts?.visits;
  if (sessions && sessions.labels.length) {
    const values = sessions.labels.map((_, i) => Number((sessions.datasets?.[0]?.data?.[i] as any) ?? 0));
    const total = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(total / (values.length || 1));
    const peakIdx = values.indexOf(Math.max(...values));
    const peakDay = sessions.labels[peakIdx];
    insights.push(`En el periodo analizado se registraron ${total} sesiones totales (media diaria ~${avg}). El día con mayor actividad fue ${peakDay}.`);
  }
  const languages = charts?.languages;
  if (languages && languages.labels.length) {
    const vals = languages.labels.map((_, i) => Number((languages.datasets?.[0]?.data?.[i] as any) ?? 0));
    const idx = vals.indexOf(Math.max(...vals));
    insights.push(`El idioma más utilizado es ${languages.labels[idx]}.`);
  }
  const categories = charts?.categories;
  if (categories && categories.labels.length) {
    const vals = categories.labels.map((_, i) => Number((categories.datasets?.[0]?.data?.[i] as any) ?? 0));
    const idx = vals.indexOf(Math.max(...vals));
    insights.push(`La categoría con mayor interés es ${categories.labels[idx]}.`);
  }
  const hourly = charts?.hourly;
  if (hourly && hourly.labels.length) {
    const vals = hourly.labels.map((_, i) => Number((hourly.datasets?.[0]?.data?.[i] as any) ?? 0));
    const idx = vals.indexOf(Math.max(...vals));
    insights.push(`La franja horaria con más uso es ${hourly.labels[idx]}.`);
  }
  return insights;
};

export const useExportReport = () => {
  const exportReport = useCallback((params: ExportReportParams) => {
    const { title, subtitle, kpis = [], charts = {}, extraNotes = [] } = params;

    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const userName = (typeof window !== 'undefined' && (localStorage.getItem('userName') || localStorage.getItem('user') || 'Usuario desconocido')) as string;

    const kpiRows = kpis
      .map(
        (k) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${k.label}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${k.value}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${k.change ?? '-'} ${k.change ? '%' : ''}</td>
        </tr>`
      )
      .join('');

    const narrative = buildInsights(charts).concat(extraNotes);

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            @media print { @page { size: A4; margin: 14mm; } .no-print { display:none; } }
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial; color:#111827; }
            .header { display:flex; align-items:center; gap:16px; border-bottom:2px solid #111827; padding-bottom:10px; margin-bottom:14px; }
            .brand { font-size:13px; color:#6b7280; }
            h1 { font-size: 20px; margin: 0 0 2px; }
            h2 { font-size: 15px; margin: 12px 0 6px; }
            .meta { font-size:12px; color:#374151; display:flex; gap:16px; }
            .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
            .footer { margin-top:16px; padding-top:8px; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; font-size:11px; color:#6b7280; }
            .watermark { position:fixed; inset:0; opacity:0.03; font-size:120px; display:flex; align-items:center; justify-content:center; pointer-events:none; }
            .narrative li { margin: 4px 0; }
            table { width:100%; border-collapse:collapse; font-size:12px; }
            th, td { text-align:left; padding:8px; border:1px solid #e5e7eb; }
            th { background:#f9fafb; }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="width:44px;height:44px;border-radius:10px;background:#111827;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">X</div>
            <div>
              <h1>${title}</h1>
              ${subtitle ? `<div class="brand">${subtitle}</div>` : ''}
              <div class="meta"><span>Fecha: ${fecha}</span><span>Hora: ${hora}</span><span>Usuario: ${userName}</span></div>
            </div>
          </div>

          ${kpis.length ? `
          <div class="card">
            <h2>KPIs</h2>
            <table>
              <thead>
                <tr>
                  <th>Métrica</th>
                  <th>Valor</th>
                  <th>Cambio</th>
                </tr>
              </thead>
              <tbody>${kpiRows}</tbody>
            </table>
          </div>` : ''}

          ${renderBarList('Sesiones / Visitas', charts.sessions || charts.visits)}
          ${renderBarList('Uso por hora', charts.hourly)}
          ${renderBarList('Categorías más vistas', charts.categories)}
          ${renderBarList('Idiomas de los usuarios', charts.languages)}

          ${narrative.length ? `
          <div class="card">
            <h2>Conclusiones e insights</h2>
            <ul class="narrative">
              ${narrative.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </div>` : ''}

          <div class="footer">
            <span>Generado automáticamente por Xàbia App</span>
            <span>Página <span class="page-number"></span></span>
          </div>
          <div class="watermark">XÀBIA</div>
          <script>window.print();</script>
        </body>
      </html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }, []);

  return { exportReport };
};
