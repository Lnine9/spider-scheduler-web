<template>
  <div class="last24h-task-count__container">
    <div class="chart-container">
      <div id="last24-chart" style="width: 100%; height: 360px" />
    </div>
  </div>
</template>

<script>
import * as Echarts from 'echarts'
import * as StatisticApi from '@/api/statistic'
import {parseTime} from "@/utils";
// 最近24小时的每小时运行任务数折线图
const DEFAULT_OPTIONS = {
  grid: {
    left: 70,
    right: 80,
    bottom: 60,
    top: 60,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: 'value',
    name: '运行子任务数',
  },
  series: [
    {
      name: '子任务数',
      type: 'line',
      data: [],
      itemStyle: {
        color: '#409EFF',
      },
      lineStyle: {
        color: '#409EFF',
      },
      smooth: true,
      // 下方遮罩
      areaStyle: {
        color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(64,158,255,0.4)'
        }, {
          offset: 1,
          color: 'rgba(64,158,255,0.16)'
        }])
      }
    }
  ]
}

export default {
  name: "Last24hTaskCount",
  data() {
    return {
      statistics: [],
      chartOptions: DEFAULT_OPTIONS
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    initChart() {
      const chart = Echarts.init(document.getElementById('last24-chart'));
      chart.setOption(this.chartOptions);
    },
    async fetchData() {
      try {
        const {data} = await StatisticApi.last24hTaskCount();
        this.statistics = data;
        this.chartOptions.xAxis.data = this.statistics.map(item => parseTime(item.time, '{h}:{i}'));
        this.chartOptions.series[0].data = this.statistics.map(item => item.task_count);
        this.initChart();
      } catch (e) {
        this.$message.error(e.message);
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
