<template>
  <div class="anomaly-badge">
    <span class="badge-icon">⚠️</span>
    <span class="badge-text">{{ anomaly }}</span>
  </div>
</template>

<script>
export default {
  name: 'AnomalyBadge',
  props: {
    anomaly: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.anomaly-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
