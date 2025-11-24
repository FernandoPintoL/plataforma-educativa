<template>
  <div class="cluster-chart">
    <div class="chart-placeholder">
      <svg viewBox="0 0 400 300" class="bar-chart">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- Y-axis -->
        <line x1="40" y1="30" x2="40" y2="270" stroke="#e5e7eb" stroke-width="2" />
        <!-- X-axis -->
        <line x1="40" y1="270" x2="380" y2="270" stroke="#e5e7eb" stroke-width="2" />

        <!-- Bars -->
        <g v-for="(count, idx) in data.datasets[0].data" :key="idx">
          <rect
            :x="50 + idx * 100"
            :y="270 - (count / maxCount) * 200"
            width="60"
            :height="(count / maxCount) * 200"
            :fill="data.datasets[0].backgroundColor[idx]"
            rx="4"
          />
          <text
            :x="80 + idx * 100"
            y="290"
            text-anchor="middle"
            font-size="12"
            fill="#6b7280"
          >
            {{ data.labels[idx] }}
          </text>
          <text
            :x="80 + idx * 100"
            :y="265 - (count / maxCount) * 200"
            text-anchor="middle"
            font-size="14"
            font-weight="bold"
            fill="#374151"
          >
            {{ count }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClusterChart',
  props: {
    data: Object,
  },
  computed: {
    maxCount() {
      if (!this.data?.datasets?.[0]?.data) return 1;
      return Math.max(...this.data.datasets[0].data);
    },
  },
};
</script>

<style scoped>
.cluster-chart {
  width: 100%;
  height: 300px;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
