<template>
  <div class="card" :class="{ 'card-collapsed': isCollapsed }">
    <div class="card-header" @click="isCollapsible && toggleCollapse()">
      <h3 class="card-title">{{ title }}</h3>
      <button v-if="isCollapsible" class="collapse-btn">
        <span v-if="!isCollapsed">▼</span>
        <span v-else>▶</span>
      </button>
    </div>
    <div v-if="!isCollapsed" class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      required: true,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    isCollapsible() {
      return this.collapsible;
    },
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.card-header:hover {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.card-header[class] {
  cursor: pointer;
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

.collapse-btn:hover {
  color: #374151;
}

.card-body {
  padding: 1.5rem;
  animation: slideDown 0.3s ease-in;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 100%;
  }
}

.card-collapsed {
  opacity: 0.8;
}
</style>
