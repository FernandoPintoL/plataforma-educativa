<template>
  <div class="insights-panel">
    <div v-if="insights.length === 0" class="empty-state">
      Sin insights disponibles
    </div>

    <div v-else class="insights-list">
      <div v-for="(insight, idx) in insights" :key="idx" class="insight-item">
        <!-- Type badge -->
        <div class="insight-type" :class="`type-${insight.type}`">
          {{ getTypeLabel(insight.type) }}
        </div>

        <!-- Content -->
        <div class="insight-content">
          <div class="insight-title">{{ insight.description || insight.type }}</div>
          <div v-if="insight.importance" class="insight-meta">
            Importancia: <span class="importance-badge">{{ insight.importance }}</span>
          </div>
          <div v-if="insight.example" class="insight-example">
            Ejemplo: {{ insight.example }}
          </div>
          <div v-if="insight.type === 'confidence_score'" class="insight-score">
            Confianza: {{ Math.round(insight.value * 100) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InsightsPanel',
  props: {
    insights: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getTypeLabel(type) {
      const labels = {
        consensus: 'Consenso',
        divergence: 'Divergencia',
        emergent_patterns: 'Patrones Emergentes',
        confidence_score: 'Puntuación de Confianza',
      };
      return labels[type] || type;
    },
  },
};
</script>

<style scoped>
.insights-panel {
  padding: 1rem;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 2rem 1rem;
}

.insights-list {
  space-y: 1rem;
}

.insight-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border-left: 4px solid #3b82f6;
}

.insight-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  color: white;
}

.type-consensus {
  background-color: #10b981;
}

.type-divergence {
  background-color: #f59e0b;
}

.type-emergent_patterns {
  background-color: #8b5cf6;
}

.type-confidence_score {
  background-color: #3b82f6;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.insight-meta {
  font-size: 0.875rem;
  color: #6b7280;
}

.importance-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.insight-example {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  border-left: 2px solid #d1d5db;
  padding-left: 0.75rem;
}

.insight-score {
  margin-top: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #10b981;
}
</style>
