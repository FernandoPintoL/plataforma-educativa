<template>
  <div class="agent-insights-panel">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Sintetizando descubrimientos con IA...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn">Reintentar</button>
    </div>

    <!-- Success State -->
    <div v-else-if="synthesis" class="synthesis-container">
      <!-- Synthesis Text -->
      <div class="synthesis-section">
        <h3 class="section-title">Síntesis Inteligente</h3>
        <div class="synthesis-text">
          {{ synthesis.synthesis?.text || synthesisText }}
        </div>
      </div>

      <!-- Key Insights -->
      <div class="insights-section">
        <h3 class="section-title">Insights Principales</h3>
        <div class="insights-list">
          <div
            v-for="(insight, index) in insights"
            :key="index"
            class="insight-item"
          >
            <span class="insight-icon">💡</span>
            <span class="insight-text">{{ insight }}</span>
          </div>
        </div>
      </div>

      <!-- Reasoning Steps -->
      <div class="reasoning-section">
        <h3 class="section-title">Proceso de Razonamiento</h3>
        <div class="reasoning-steps">
          <div
            v-for="(step, index) in reasoningSteps"
            :key="index"
            class="reasoning-step"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">{{ step }}</div>
          </div>
        </div>
      </div>

      <!-- Confidence Score -->
      <div class="confidence-section">
        <div class="confidence-label">Confianza del Análisis</div>
        <div class="confidence-bar">
          <div class="confidence-fill" :style="{ width: confidencePercent }"></div>
        </div>
        <div class="confidence-text">{{ confidencePercent }}</div>
      </div>

      <!-- Method Indicator -->
      <div class="method-indicator">
        <span v-if="isLLM" class="method-badge llm">🤖 Síntesis LLM (Groq)</span>
        <span v-else class="method-badge local">📊 Síntesis Local</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No hay datos de síntesis disponibles</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgentInsightsPanel',
  props: {
    studentId: {
      type: Number,
      required: true,
    },
    discoveries: {
      type: Object,
      default: () => ({}),
    },
    predictions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      synthesis: null,
      loading: false,
      error: null,
    };
  },
  computed: {
    insights() {
      if (this.synthesis?.synthesis?.insights) {
        return this.synthesis.synthesis.insights;
      }
      if (this.synthesis?.synthesis?.key_insights) {
        return this.synthesis.synthesis.key_insights;
      }
      return [];
    },
    reasoningSteps() {
      return this.synthesis?.reasoning || [];
    },
    synthesisText() {
      if (this.synthesis?.synthesis?.text) {
        return this.synthesis.synthesis.text;
      }
      if (this.synthesis?.synthesis?.key_insights) {
        return this.synthesis.synthesis.key_insights.join('. ');
      }
      return 'Análisis completado.';
    },
    confidence() {
      return this.synthesis?.confidence || 0;
    },
    confidencePercent() {
      return Math.round(this.confidence * 100) + '%';
    },
    isLLM() {
      return this.synthesis?.method === 'agent_llm';
    },
  },
  watch: {
    studentId: {
      handler() {
        this.fetchSynthesis();
      },
    },
    discoveries: {
      handler() {
        this.fetchSynthesis();
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchSynthesis();
  },
  methods: {
    async fetchSynthesis() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(
          `/api/agent/synthesize/${this.studentId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content'),
            },
            body: JSON.stringify({
              discoveries: this.discoveries,
              predictions: this.predictions,
              context: 'unified_learning_pipeline',
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Error al obtener síntesis');
        }

        this.synthesis = await response.json();
      } catch (err) {
        this.error = err.message || 'Error desconocido';
        console.error('Error fetching synthesis:', err);
      } finally {
        this.loading = false;
      }
    },
    retry() {
      this.fetchSynthesis();
    },
  },
};
</script>

<style scoped>
.agent-insights-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.synthesis-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.synthesis-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.synthesis-text {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
}

.insights-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 14px;
}

.insight-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.insight-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
}

.reasoning-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.reasoning-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reasoning-step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  min-width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  padding-top: 6px;
}

.confidence-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.confidence-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.confidence-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #fbbf24);
  transition: width 0.3s ease;
}

.confidence-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
}

.method-indicator {
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.method-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.method-badge.llm {
  background: rgba(76, 175, 80, 0.3);
  color: #4ade80;
}

.method-badge.local {
  background: rgba(33, 150, 243, 0.3);
  color: #60a5fa;
}

.error-state {
  padding: 30px;
}

.error-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .agent-insights-panel {
    padding: 16px;
  }

  .section-title {
    font-size: 16px;
  }

  .synthesis-text,
  .insight-text,
  .step-content {
    font-size: 13px;
  }
}
</style>
