import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartWrapper } from '../dashboard/chart-wrapper';
import type { DatoTendencia } from '@/types/analisis-riesgo';

interface RiskTrendChartProps {
  data: DatoTendencia[];
  title?: string;
  description?: string;
  height?: string;
  isLoading?: boolean;
}

export function RiskTrendChart({
  data,
  title = 'Tendencia de Riesgo',
  description = 'Evolución del score promedio de riesgo en el tiempo',
  height = '400px',
  isLoading = false,
}: RiskTrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-gray-500">Cargando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-gray-500">Sin datos disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar datos para el gráfico
  const chartData = {
    labels: data.map((d) =>
      new Date(d.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Score de Riesgo Promedio',
        data: data.map((d) => (d.score_promedio * 100).toFixed(1)),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
          afterLabel: function (context: any) {
            const dataIndex = context.dataIndex;
            const estudiantes = data[dataIndex]?.total || 0;
            return `Estudiantes: ${estudiantes}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value: number) {
            return value + '%';
          },
        },
        title: {
          display: true,
          text: 'Score de Riesgo (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <ChartWrapper
          type="line"
          data={chartData}
          options={options}
          height={height}
        />

        {/* Resumen estadístico */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Score Promedio</p>
            <p className="text-lg font-bold">
              {(
                (data.reduce((sum, d) => sum + d.score_promedio, 0) / data.length) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Score Máximo</p>
            <p className="text-lg font-bold">
              {(Math.max(...data.map((d) => d.score_promedio)) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Score Mínimo</p>
            <p className="text-lg font-bold">
              {(Math.min(...data.map((d) => d.score_promedio)) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Período</p>
            <p className="text-lg font-bold">{data.length} días</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RiskTrendChart;
