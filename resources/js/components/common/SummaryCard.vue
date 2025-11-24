<template>
  <div class="summary-card" :class="colorClass">
    <div class="summary-icon">{{ icon }}</div>
    <div class="summary-content">
      <h3 class="summary-title">{{ title }}</h3>
      <div class="summary-value">
        {{ value }}<span class="summary-unit">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummaryCard',
  props: {
    title: String,
    value: [Number, String],
    unit: String,
    icon: String,
    color: {
      type: String,
      default: 'blue',
      validator: (v) => ['blue', 'green', 'red', 'yellow', 'purple'].includes(v),
    },
  },
  computed: {
    colorClass() {
      return `summary-${this.color}`;
    },
  },
};
</script>

<style scoped>
.summary-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
}

.summary-content {
  flex: 1;
}

.summary-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-top: 0.5rem;
}

.summary-unit {
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.5rem;
  color: #9ca3af;
}

.summary-blue {
  border-left-color: #3b82f6;
}

.summary-blue .summary-title {
  color: #3b82f6;
}

.summary-green {
  border-left-color: #10b981;
}

.summary-green .summary-title {
  color: #10b981;
}

.summary-red {
  border-left-color: #ef4444;
}

.summary-red .summary-title {
  color: #ef4444;
}

.summary-yellow {
  border-left-color: #f59e0b;
}

.summary-yellow .summary-title {
  color: #f59e0b;
}

.summary-purple {
  border-left-color: #8b5cf6;
}

.summary-purple .summary-title {
  color: #8b5cf6;
}
</style>
