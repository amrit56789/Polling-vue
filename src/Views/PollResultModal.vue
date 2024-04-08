<template>
  <div>
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'BarChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
  },
  setup(props) {
    const barChart = ref(null);

    onMounted(() => {
      const ctx = barChart.value.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: props.chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

    return {
      barChart,
    };
  },
};
</script>
