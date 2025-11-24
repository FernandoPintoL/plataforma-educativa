<template>
  <div class="adaptive-actions-panel">
    <div v-if="!actions || Object.keys(actions).length === 0" class="empty-state">
      Sin acciones adaptativas disponibles
    </div>

    <div v-else class="actions-content">
      <!-- Learning Path -->
      <div v-if="actions.personalized_learning_path" class="action-section">
        <h4 class="section-title">📚 Ruta de Aprendizaje Personalizada</h4>
        <ol class="action-list">
          <li v-for="(path, idx) in actions.personalized_learning_path" :key="idx">
            {{ path }}
          </li>
        </ol>
      </div>

      <!-- Intervention Strategy -->
      <div v-if="actions.intervention_strategy" class="action-section">
        <h4 class="section-title">🎯 Estrategia de Intervención</h4>
        <div v-if="Array.isArray(actions.intervention_strategy)">
          <ul class="action-list">
            <li v-for="(strat, idx) in actions.intervention_strategy" :key="idx">
              {{ strat }}
            </li>
          </ul>
        </div>
        <div v-else class="action-text">
          {{ actions.intervention_strategy }}
        </div>
      </div>

      <!-- Resource Recommendations -->
      <div v-if="actions.resource_recommendations" class="action-section">
        <h4 class="section-title">🎁 Recursos Recomendados</h4>
        <div class="resources-grid">
          <div v-for="(resource, idx) in actions.resource_recommendations" :key="idx" class="resource-item">
            <span class="resource-type">{{ resource.type || 'recurso' }}</span>
            <span class="resource-priority">{{ resource.priority }}</span>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div v-if="actions.timeline" class="action-section">
        <h4 class="section-title">⏱️ Timeline</h4>
        <div class="timeline">
          <div v-for="(period, key) in actions.timeline" :key="key" class="timeline-item">
            <span class="timeline-label">{{ formatLabel(key) }}:</span>
            <span class="timeline-value">{{ period }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdaptiveActionsPanel',
  props: {
    actions: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatLabel(key) {
      const labels = {
        immediate: 'Inmediato',
        short_term: 'Corto Plazo',
        medium_term: 'Mediano Plazo',
        long_term: 'Largo Plazo',
      };
      return labels[key] || key;
    },
  },
};
</script>

<style scoped>
.adaptive-actions-panel {
  padding: 1rem;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 2rem 1rem;
}

.actions-content {
  space-y: 1.5rem;
}

.action-section {
  margin-bottom: 2rem;
}

.section-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.action-list {
  padding-left: 1.5rem;
  color: #4b5563;
  line-height: 1.8;
}

.action-list li {
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.action-text {
  color: #6b7280;
  line-height: 1.6;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.resource-item {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid #e5e7eb;
}

.resource-type {
  font-weight: 600;
  color: #111827;
  text-transform: capitalize;
}

.resource-priority {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: white;
  border-radius: 0.25rem;
  text-transform: uppercase;
  font-weight: 500;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.timeline-item {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
  border-left: 4px solid #3b82f6;
}

.timeline-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.timeline-value {
  display: block;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
