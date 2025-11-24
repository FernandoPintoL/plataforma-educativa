<template>
  <div class="topic-badge">
    <span class="badge-icon">📚</span>
    <span class="badge-text">{{ topic }}</span>
  </div>
</template>

<script>
export default {
  name: 'TopicBadge',
  props: {
    topic: String,
  },
};
</script>

<style scoped>
.topic-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
