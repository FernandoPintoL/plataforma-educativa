import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';

interface CronbachAlpha {
  dimension: string;
  cronbach_alpha: number;
  num_items: number;
  num_respondents: number;
  interpretation: string;
  status: string;
}

interface Correlation {
  dimension1: string;
  dimension2: string;
  correlation: number;
  num_students: number;
  interpretation: string;
}

interface Descriptives {
  dimension: string;
  n: number;
  mean: number;
  median: number;
  std_dev: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
}

interface PsychometricReport {
  test_id: number;
  cronbachs_alphas: {
    dimensions: CronbachAlpha[];
    average_alpha: number;
    overall_status: string;
  };
  correlation_matrix: {
    correlations: Correlation[];
  };
  descriptive_statistics: Descriptives[];
  generated_at: string;
}

interface RiasecPsychometricDashboardProps {
  testId: number;
}

const RiasecPsychometricDashboard: React.FC<RiasecPsychometricDashboardProps> = ({ testId }) => {
  const [report, setReport] = useState<PsychometricReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('alphas');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/psychometric/test/${testId}/full-report`);

        if (response.data.success) {
          setReport(response.data.data);
          setError(null);
        } else {
          setError('Error al cargar el reporte');
        }
      } catch (err) {
        setError('Error al conectar con el servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando análisis psicométrico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-semibold">Error</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">No hay datos disponibles</p>
      </div>
    );
  }

  const alphasData = report.cronbachs_alphas.dimensions.map(d => ({
    name: d.dimension,
    alpha: d.cronbach_alpha,
    status: d.status,
  }));

  const correlationsData = report.correlation_matrix.correlations.map(c => ({
    pair: `${c.dimension1.charAt(0)} ↔ ${c.dimension2.charAt(0)}`,
    correlation: c.correlation,
    interpretation: c.interpretation,
  }));

  const descriptivesData = report.descriptive_statistics.map(d => ({
    dimension: d.dimension,
    mean: d.mean,
    median: d.median,
    std_dev: d.std_dev,
  }));

  const getAlphaColor = (alpha: number): string => {
    if (alpha >= 0.90) return 'bg-green-100 border-green-500';
    if (alpha >= 0.80) return 'bg-blue-100 border-blue-500';
    if (alpha >= 0.70) return 'bg-yellow-100 border-yellow-500';
    return 'bg-red-100 border-red-500';
  };

  const getAlphaInterpretation = (alpha: number): string => {
    if (alpha >= 0.90) return 'Excelente';
    if (alpha >= 0.80) return 'Bueno';
    if (alpha >= 0.70) return 'Aceptable';
    return 'Necesita revisión';
  };

  const getCorrelationColor = (r: number): string => {
    const abs_r = Math.abs(r);
    if (abs_r >= 0.90) return '#ff4444'; // Very Strong - Red
    if (abs_r >= 0.70) return '#ff8844'; // Strong - Orange
    if (abs_r >= 0.50) return '#ffaa44'; // Moderate - Light Orange
    if (abs_r >= 0.30) return '#aaaa44'; // Weak - Yellow
    return '#44aa44'; // Very Weak - Green
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Análisis Psicométrico RIASEC</h1>
        <p className="text-gray-600 mt-2">Validación de confiabilidad y validez del test vocacional</p>
        <p className="text-sm text-gray-500 mt-2">Generado: {new Date(report.generated_at).toLocaleString('es-ES')}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-semibold">Alfa Promedio</p>
          <p className="text-2xl font-bold text-blue-600">{report.cronbachs_alphas.average_alpha.toFixed(4)}</p>
          <p className="text-xs text-gray-500 mt-1">{getAlphaInterpretation(report.cronbachs_alphas.average_alpha)}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-semibold">Dimensiones</p>
          <p className="text-2xl font-bold text-green-600">{report.cronbachs_alphas.dimensions.length}</p>
          <p className="text-xs text-gray-500 mt-1">6 RIASEC validadas</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-semibold">Correlaciones</p>
          <p className="text-2xl font-bold text-purple-600">{report.correlation_matrix.correlations.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pares analizados</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm font-semibold">Respondentes</p>
          <p className="text-2xl font-bold text-orange-600">
            {report.cronbachs_alphas.dimensions[0]?.num_respondents || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Estudiantes en dataset</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('alphas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alphas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Cronbach's Alpha
          </button>
          <button
            onClick={() => setActiveTab('correlations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'correlations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Correlaciones
          </button>
          <button
            onClick={() => setActiveTab('descriptives')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'descriptives'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Estadísticas Descriptivas
          </button>
          <button
            onClick={() => setActiveTab('interpretation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'interpretation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Interpretación
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'alphas' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Consistencia Interna (Cronbach's Alpha)</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Mide si los ítems dentro de cada dimensión miden el mismo constructo. Valores > 0.70 indican buena consistencia.
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alphasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value) => (value as number).toFixed(4)} />
                <Bar dataKey="alpha" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {alphasData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.alpha >= 0.90
                          ? '#10b981'
                          : entry.alpha >= 0.80
                          ? '#3b82f6'
                          : entry.alpha >= 0.70
                          ? '#f59e0b'
                          : '#ef4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dimensión</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Alpha</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Ítems</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Respondentes</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Interpretación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.cronbachs_alphas.dimensions.map((dim, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{dim.dimension}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getAlphaColor(dim.cronbach_alpha)}`}>
                        {dim.cronbach_alpha.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{dim.num_items}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{dim.num_respondents}</td>
                    <td className="px-4 py-3 text-gray-700">{dim.interpretation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'correlations' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Matriz de Correlaciones</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Correlaciones de Pearson entre dimensiones. Valores cercanos a 0 indican validez discriminante.
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="pair"
                  name="Pares de Dimensiones"
                  type="category"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis dataKey="correlation" name="Correlación" domain={[-1, 1]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={correlationsData} fill="#8884d8">
                  {correlationsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCorrelationColor(entry.correlation)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dimensión 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dimensión 2</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Correlación</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Interpretación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.correlation_matrix.correlations.map((corr, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{corr.dimension1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{corr.dimension2}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        style={{
                          backgroundColor: getCorrelationColor(corr.correlation),
                          color: 'white',
                        }}
                        className="px-3 py-1 rounded-full text-sm font-bold"
                      >
                        {corr.correlation.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{corr.interpretation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'descriptives' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Estadísticas Descriptivas por Dimensión</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Resumen de medidas centrales y de dispersión para cada dimensión RIASEC.
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={descriptivesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dimension" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => (value as number).toFixed(3)} />
                <Legend />
                <Bar dataKey="mean" fill="#3b82f6" name="Media" />
                <Bar dataKey="median" fill="#10b981" name="Mediana" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Dimensión</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">n</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Media</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Mediana</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">DE</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Mín</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Máx</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Q1</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Q3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.descriptive_statistics.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{stat.dimension}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.n}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.mean.toFixed(3)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.median.toFixed(3)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.std_dev.toFixed(3)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.min.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.max.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.q1.toFixed(3)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{stat.q3.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'interpretation' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">📋 Guía de Interpretación</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Cronbach's Alpha</h4>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• <strong>α > 0.90:</strong> Excelente - Posible redundancia entre ítems</li>
                  <li>• <strong>α > 0.80:</strong> Bueno - Fuerte consistencia interna</li>
                  <li>• <strong>α > 0.70:</strong> Aceptable - Consistencia interna adecuada</li>
                  <li>• <strong>α < 0.70:</strong> Necesita revisión - Consistencia interna débil</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Correlación entre Dimensiones</h4>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• <strong>r ≥ 0.90:</strong> Muy Fuerte - Posible redundancia conceptual</li>
                  <li>• <strong>0.70 ≤ r < 0.90:</strong> Fuerte - Relación clara</li>
                  <li>• <strong>0.50 ≤ r < 0.70:</strong> Moderada - Relación evidente</li>
                  <li>• <strong>0.30 ≤ r < 0.50:</strong> Débil - Relación leve</li>
                  <li>• <strong>0.10 ≤ r < 0.30:</strong> Muy Débil - Relación minimal</li>
                  <li>• <strong>r < 0.10:</strong> Negligible - Prácticamente sin relación</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Patrón Hexagonal de Holland</h4>
                <p className="text-sm text-blue-700 mb-2">
                  El modelo RIASEC sigue un patrón hexagonal donde:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• Dimensiones <strong>adyacentes</strong> en el hexágono tienen correlaciones MODERADAS (0.40-0.55)</li>
                  <li>• Dimensiones <strong>opuestas</strong> tienen correlaciones BAJAS (0.10-0.25)</li>
                  <li>• Dimensiones con 1 paso de distancia tienen correlaciones DÉBIL-MODERADAS (0.20-0.40)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-3">✅ Estado de Validación</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className={`mt-1 mr-3 text-lg ${report.cronbachs_alphas.average_alpha >= 0.70 ? '✓' : '✗'} ${report.cronbachs_alphas.average_alpha >= 0.70 ? 'text-green-600' : 'text-red-600'}`}></span>
                <div>
                  <p className="font-semibold text-green-900">Consistencia Interna</p>
                  <p className="text-sm text-green-700">
                    Alfa promedio: <strong>{report.cronbachs_alphas.average_alpha.toFixed(4)}</strong> - {report.cronbachs_alphas.overall_status}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="mt-1 mr-3 text-lg text-green-600">✓</span>
                <div>
                  <p className="font-semibold text-green-900">Validez Discriminante</p>
                  <p className="text-sm text-green-700">
                    {report.correlation_matrix.correlations.filter(c => Math.abs(c.correlation) < 0.70).length}/{report.correlation_matrix.correlations.length} pares con discriminancia adecuada (r < 0.70)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="mt-1 mr-3 text-lg text-blue-600">ℹ</span>
                <div>
                  <p className="font-semibold text-green-900">Tamaño de Muestra</p>
                  <p className="text-sm text-green-700">
                    {report.cronbachs_alphas.dimensions[0]?.num_respondents || 0} estudiantes respondieron el test completo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
        <p>
          <strong>Normas Aplicadas:</strong> AERA/APA/NCME Standards for Educational Testing, ITC Guidelines
        </p>
        <p className="mt-1">
          <strong>Modelo:</strong> RIASEC (Holland, 1997) - 6 dimensiones de intereses vocacionales
        </p>
      </div>
    </div>
  );
};

export default RiasecPsychometricDashboard;
