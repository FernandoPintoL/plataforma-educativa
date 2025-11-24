<template>
  <div class="health-indicator">
    <div class="indicator-label">{{ label }}</div>
    <div class="indicator-status" :class="statusClass">
      <span class="status-dot"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HealthIndicator',
  props: {
    label: String,
    status: {
      type: String,
      default: 'unknown',
    },
  },
  computed: {
    statusClass() {
      return `status-${this.status}`;
    },
    statusText() {
      const map = {
        healthy: 'Saludable',
        degraded: 'Degradado',
        unhealthy: 'No disponible',
        unknown: 'Desconocido',
      };
      return map[this.status] || 'Desconocido';
    },
  },
};
</script>

<style scoped>
.health-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.health-indicator:last-child {
  border-bottom: none;
}

.indicator-label {
  font-weight: 500;
  color: #374151;
}

.indicator-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-healthy .status-dot {
  background-color: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-degraded .status-dot {
  background-color: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
}

.status-unhealthy .status-dot {
  background-color: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.status-unknown .status-dot {
  background-color: #9ca3af;
}

.status-healthy {
  color: #10b981;
}

.status-degraded {
  color: #f59e0b;
}

.status-unhealthy {
  color: #ef4444;
}

.status-unknown {
  color: #9ca3af;
}
</style>
