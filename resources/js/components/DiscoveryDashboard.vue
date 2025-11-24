<template>
  <div class="discovery-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="text-3xl font-bold text-gray-900">Descubrimiento de Patrones ML</h1>
      <p class="text-gray-600 mt-2">Pipeline Unificado: No Supervisado → Supervisado → Agent → Acciones</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Ejecutando análisis de descubrimiento...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <h3>Error al ejecutar pipeline</h3>
      <p>{{ error }}</p>
      <button @click="executeDiscovery" class="btn btn-primary mt-4">Reintentar</button>
    </div>

    <!-- Main Content -->
    <div v-else-if="pipelineResult" class="dashboard-content">
      <!-- Top Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="Confianza Integrada"
          :value="confidenceScore"
          unit="%"
          icon="🎯"
          :color="getConfidenceColor"
        />
        <SummaryCard
          title="Clusters Detectados"
          :value="totalClusters"
          unit="grupos"
          icon="👥"
          color="blue"
        />
        <SummaryCard
          title="Anomalías"
          :value="anomalyCount"
          unit="patrones"
          icon="⚠️"
          :color="anomalyCount > 0 ? 'red' : 'green'"
        />
        <SummaryCard
          title="Temas Identificados"
          :value="topicsCount"
          unit="temas"
          icon="📚"
          color="purple"
        />
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Left Column: Clustering Analysis -->
        <div class="lg:col-span-2">
          <Card title="📊 Análisis de Clustering" :collapsible="true">
            <div class="space-y-4">
              <!-- Cluster Distribution -->
              <div v-if="clusterData" class="section">
                <h4 class="font-semibold text-gray-900 mb-3">Distribución de Estudiantes</h4>
                <ClusterChart :data="clusterData" />

                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div v-for="(count, idx) in clusterSizes" :key="idx" class="cluster-badge">
                    <div class="badge-number">Cluster {{ idx }}</div>
                    <div class="badge-count">{{ count }} estudiantes</div>
                  </div>
                </div>
              </div>

              <!-- Cluster Details -->
              <div v-if="clusterDescriptions" class="section border-t pt-4 mt-4">
                <h4 class="font-semibold text-gray-900 mb-3">Características por Cluster</h4>
                <div class="space-y-2">
                  <div v-for="(desc, idx) in clusterDescriptions" :key="idx" class="cluster-detail">
                    <span class="cluster-label">Cluster {{ idx }}:</span>
                    <span class="cluster-desc">{{ desc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Right Column: Health Status -->
        <div>
          <Card title="🏥 Estado del Sistema" :collapsible="true">
            <div class="space-y-3">
              <HealthIndicator
                label="ML No Supervisada"
                :status="platformHealth?.layers?.unsupervised_ml?.status"
              />
              <HealthIndicator
                label="ML Supervisada"
                :status="platformHealth?.layers?.supervised_ml?.status"
              />
              <HealthIndicator
                label="Agent IA"
                :status="platformHealth?.layers?.agent?.status"
              />
              <HealthIndicator
                label="Base de Datos"
                :status="platformHealth?.layers?.database?.status"
              />
            </div>
          </Card>

          <!-- Confidence Score Gauge -->
          <Card title="⚡ Puntuación de Confianza" class="mt-4">
            <ConfidenceGauge :score="confidenceScore" />
          </Card>
        </div>
      </div>

      <!-- Middle Row: Topics and Anomalies -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Topics -->
        <Card title="📚 Temas Conceptuales Descubiertos" :collapsible="true">
          <div v-if="topics.length > 0" class="space-y-2">
            <TopicBadge v-for="topic in topics" :key="topic" :topic="topic" />
          </div>
          <div v-else class="text-gray-500 italic">
            No se detectaron temas específicos
          </div>
        </Card>

        <!-- Anomalies -->
        <Card title="⚠️ Patrones Anómalos Detectados" :collapsible="true">
          <div v-if="anomalies.length > 0" class="space-y-2">
            <AnomalyBadge v-for="(anomaly, idx) in anomalies" :key="idx" :anomaly="anomaly" />
          </div>
          <div v-else class="text-green-600 italic">
            ✓ No se detectaron anomalías
          </div>
        </Card>
      </div>

      <!-- Insights Section -->
      <Card title="💡 Insights Integrados" :collapsible="true" class="mb-8">
        <InsightsPanel :insights="integratedInsights" />
      </Card>

      <!-- Adaptive Actions -->
      <Card title="🎯 Acciones Adaptativas Recomendadas" :collapsible="true" class="mb-8">
        <AdaptiveActionsPanel :actions="adaptiveActions" />
      </Card>

      <!-- Correlations -->
      <Card title="🔗 Análisis de Correlaciones" :collapsible="true" class="mb-8">
        <CorrelationPanel :correlations="correlationData" />
      </Card>

      <!-- Agent Insights (LLM Synthesis) -->
      <AgentInsightsPanel
        :studentId="studentId"
        :discoveries="pipelineResult?.layers?.unsupervised_discovery?.discoveries || {}"
        :predictions="pipelineResult?.layers?.supervised_ml?.predictions || {}"
        class="mb-8"
      />

      <!-- Action Buttons -->
      <div class="action-buttons mt-8 pt-6 border-t">
        <button @click="executeDiscovery" class="btn btn-primary">
          🔄 Ejecutar análisis nuevamente
        </button>
        <button @click="exportResults" class="btn btn-secondary ml-2">
          📥 Exportar resultados
        </button>
        <button @click="shareInsights" class="btn btn-secondary ml-2">
          📤 Compartir insights
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>Sin análisis ejecutados</h3>
      <p>Ejecuta un análisis de descubrimiento para ver los patrones detectados</p>
      <button @click="executeDiscovery" class="btn btn-primary mt-4">
        Ejecutar análisis
      </button>
    </div>
  </div>
</template>

<script>
import Card from '@/components/common/Card.vue';
import SummaryCard from '@/components/common/SummaryCard.vue';
import ClusterChart from '@/components/charts/ClusterChart.vue';
import HealthIndicator from '@/components/indicators/HealthIndicator.vue';
import ConfidenceGauge from '@/components/charts/ConfidenceGauge.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import AnomalyBadge from '@/components/badges/AnomalyBadge.vue';
import InsightsPanel from '@/components/panels/InsightsPanel.vue';
import AdaptiveActionsPanel from '@/components/panels/AdaptiveActionsPanel.vue';
import CorrelationPanel from '@/components/panels/CorrelationPanel.vue';
import AgentInsightsPanel from '@/components/panels/AgentInsightsPanel.vue';

export default {
  name: 'DiscoveryDashboard',
  components: {
    Card,
    SummaryCard,
    ClusterChart,
    HealthIndicator,
    ConfidenceGauge,
    TopicBadge,
    AnomalyBadge,
    InsightsPanel,
    AdaptiveActionsPanel,
    CorrelationPanel,
    AgentInsightsPanel,
  },
  data() {
    return {
      studentId: null,
      pipelineResult: null,
      platformHealth: null,
      loading: false,
      error: null,
    };
  },
  computed: {
    // Scores and Counts
    confidenceScore() {
      const insights = this.pipelineResult?.integrated_insights || [];
      const conf = insights.find(i => i.type === 'confidence_score');
      return conf ? Math.round(conf.value * 100) : 0;
    },

    getConfidenceColor() {
      const score = this.confidenceScore;
      if (score >= 80) return 'green';
      if (score >= 60) return 'yellow';
      if (score >= 40) return 'orange';
      return 'red';
    },

    totalClusters() {
      const dist = this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.cluster_analysis?.data;
      return dist?.distribution?.length || 0;
    },

    anomalyCount() {
      const anom = this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.anomalies?.data;
      return anom?.detected_patterns?.length || 0;
    },

    topicsCount() {
      const topics = this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.concept_topics?.data;
      return topics ? Object.keys(topics).length : 0;
    },

    // Cluster Data
    clusterData() {
      const dist = this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.cluster_analysis?.data?.distribution;
      if (!dist) return null;

      return {
        labels: dist.map((d, i) => `Cluster ${i}`),
        datasets: [{
          label: 'Estudiantes por Cluster',
          data: dist.map(d => d.count),
          backgroundColor: this.getClusterColors(dist.length),
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
        }],
      };
    },

    clusterSizes() {
      const dist = this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.cluster_analysis?.data?.distribution;
      return dist ? dist.map(d => d.count) : [];
    },

    clusterDescriptions() {
      // This would come from the cluster analysis data
      return [
        'Alto desempeño, participación activa',
        'Desempeño promedio, necesita intervención',
        'Bajo desempeño, requiere apoyo inmediato',
      ];
    },

    // Topics
    topics() {
      const topics = this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.concept_topics?.data;
      if (!topics) return [];

      const topicList = [];
      if (topics.dominant_topic) topicList.push(topics.dominant_topic);
      if (topics.topics) topicList.push(...(Array.isArray(topics.topics) ? topics.topics : []));
      return topicList.slice(0, 5); // Max 5 topics
    },

    // Anomalies
    anomalies() {
      const anom = this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.anomalies?.data?.detected_patterns;
      return anom ? (Array.isArray(anom) ? anom : [anom]) : [];
    },

    // Insights
    integratedInsights() {
      return this.pipelineResult?.integrated_insights || [];
    },

    // Adaptive Actions
    adaptiveActions() {
      return this.pipelineResult?.layers?.adaptive_actions?.actions || {};
    },

    // Correlations
    correlationData() {
      return this.pipelineResult?.layers?.unsupervised_discovery?.discoveries?.correlations?.data || {};
    },
  },
  methods: {
    async executeDiscovery() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(
          `/api/discovery/unified-pipeline/${this.studentId || 'all'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.getAuthToken()}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        this.pipelineResult = await response.json();
        await this.getHealthStatus();
      } catch (err) {
        this.error = err.message;
        console.error('Discovery error:', err);
      } finally {
        this.loading = false;
      }
    },

    async getHealthStatus() {
      try {
        const response = await fetch('/api/discovery/health', {
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`,
          },
        });

        if (response.ok) {
          this.platformHealth = await response.json();
        }
      } catch (err) {
        console.error('Health check error:', err);
      }
    },

    exportResults() {
      const data = {
        timestamp: new Date().toISOString(),
        pipeline: this.pipelineResult,
        health: this.platformHealth,
      };

      const element = document.createElement('a');
      element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
      element.setAttribute('download', `discovery-results-${Date.now()}.json`);
      element.style.display = 'none';

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    shareInsights() {
      const insights = this.pipelineResult?.integrated_insights || [];
      const summary = `Análisis de Descubrimiento ML:\n
- Confianza: ${this.confidenceScore}%\n
- Clusters: ${this.totalClusters}\n
- Anomalías: ${this.anomalyCount}\n
- Temas: ${this.topicsCount}`;

      if (navigator.share) {
        navigator.share({
          title: 'Descubrimiento de Patrones',
          text: summary,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(summary);
        alert('Insights copiados al portapapeles');
      }
    },

    getAuthToken() {
      // Get from localStorage or from meta tag
      return document.querySelector('meta[name="auth-token"]')?.content || '';
    },

    getClusterColors(count) {
      const colors = [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // amber
        '#EF4444', // red
        '#8B5CF6', // purple
        '#EC4899', // pink
      ];

      return colors.slice(0, Math.min(count, colors.length));
    },
  },
  mounted() {
    this.studentId = this.$route.params.studentId || null;
    this.executeDiscovery();
  },
};
</script>

<style scoped>
.discovery-dashboard {
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-content {
  animation: fadeIn 0.3s ease-in;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.alert-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  margin-top: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.cluster-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.badge-number {
  font-weight: bold;
  font-size: 0.875rem;
}

.badge-count {
  font-size: 1.25rem;
  margin-top: 0.5rem;
}

.cluster-detail {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
}

.cluster-label {
  font-weight: 600;
  color: #374151;
  min-width: 80px;
}

.cluster-desc {
  color: #6b7280;
}

.section {
  padding: 1rem 0;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>
