<template>
  <div class="correlation-panel">
    <div v-if="!correlations || Object.keys(correlations).length === 0" class="empty-state">
      Sin datos de correlación disponibles
    </div>

    <div v-else class="correlations-content">
      <!-- Correlation strength -->
      <div v-if="correlations.correlation" class="correlation-item">
        <h4 class="correlation-title">📊 Fuerza de Correlación</h4>
        <div class="correlation-bar">
          <div class="correlation-value" :style="{ width: correlations.correlation * 100 + '%' }"></div>
        </div>
        <div class="correlation-text">
          {{ Math.round(correlations.correlation * 100) }}%
        </div>
      </div>

      <!-- Relationship description -->
      <div v-if="correlations.relationship" class="correlation-item">
        <h4 class="correlation-title">🔗 Relación Detectada</h4>
        <p class="relationship-text">{{ correlations.relationship }}</p>
      </div>

      <!-- Key factors -->
      <div v-if="correlations.key_factors" class="correlation-item">
        <h4 class="correlation-title">⭐ Factores Clave</h4>
        <ul class="factors-list">
          <li v-for="(factor, idx) in correlations.key_factors" :key="idx">
            {{ factor }}
          </li>
        </ul>
      </div>

      <!-- Implications -->
      <div v-if="correlations.implications" class="correlation-item">
        <h4 class="correlation-title">💡 Implicaciones</h4>
        <div v-if="Array.isArray(correlations.implications)">
          <ul class="implications-list">
            <li v-for="(impl, idx) in correlations.implications" :key="idx">
              {{ impl }}
            </li>
          </ul>
        </div>
        <div v-else class="implications-text">
          {{ correlations.implications }}
        </div>
      </div>

      <!-- Predictive factors -->
      <div v-if="correlations.predictive_factors" class="correlation-item">
        <h4 class="correlation-title">🔮 Factores Predictivos</h4>
        <div class="factors-grid">
          <div v-for="factor in correlations.predictive_factors" :key="factor" class="factor-card">
            {{ factor }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CorrelationPanel',
  props: {
    correlations: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped>
.correlation-panel {
  padding: 1rem;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 2rem 1rem;
}

.correlations-content {
  space-y: 1.5rem;
}

.correlation-item {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border-left: 4px solid #3b82f6;
}

.correlation-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
  margin-top: 0;
}

.correlation-bar {
  width: 100%;
  height: 20px;
  background: #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.correlation-value {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  transition: width 0.5s ease;
}

.correlation-text {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.125rem;
}

.relationship-text {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.factors-list,
.implications-list {
  margin: 0;
  padding-left: 1.5rem;
}

.factors-list li,
.implications-list li {
  color: #6b7280;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.implications-text {
  color: #6b7280;
  line-height: 1.6;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.factor-card {
  background: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  text-align: center;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.factor-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}
</style>
