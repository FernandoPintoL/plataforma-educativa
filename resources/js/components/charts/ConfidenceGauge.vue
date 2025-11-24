<template>
  <div class="confidence-gauge">
    <svg viewBox="0 0 200 120" class="gauge-svg">
      <!-- Background arc -->
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="#e5e7eb"
        stroke-width="8"
      />

      <!-- Score arc -->
      <path
        :d="`M 20 100 A 80 80 0 0 1 ${20 + (160 * score / 100)} ${100 - (80 * Math.sin(Math.PI * score / 100))}`"
        fill="none"
        :stroke="scoreColor"
        stroke-width="8"
        stroke-linecap="round"
      />

      <!-- Score text -->
      <text x="100" y="70" text-anchor="middle" font-size="32" font-weight="bold" :fill="scoreColor">
        {{ score }}%
      </text>
      <text x="100" y="90" text-anchor="middle" font-size="12" fill="#6b7280">
        Confianza
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'ConfidenceGauge',
  props: {
    score: {
      type: Number,
      default: 50,
      validator: (v) => v >= 0 && v <= 100,
    },
  },
  computed: {
    scoreColor() {
      if (this.score >= 80) return '#10b981'; // green
      if (this.score >= 60) return '#f59e0b'; // yellow
      if (this.score >= 40) return '#f97316'; // orange
      return '#ef4444'; // red
    },
  },
};
</script>

<style scoped>
.confidence-gauge {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-svg {
  width: 100%;
  max-width: 200px;
  height: 100%;
}
</style>
