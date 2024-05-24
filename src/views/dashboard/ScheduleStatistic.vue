<template>
<div class="schedule-statistic">
  <div class="filter">
    <el-form inline :model="filter" size="small" ref="filterForm">
      <el-form-item label="统计范围">
        <el-date-picker
          v-model="filter.range"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        />
      </el-form-item>
      <el-form-item label="统计指标">
        <el-radio-group v-model="filter.mode" @change="renderChart" style="transform: translateY(-2px)">
          <el-radio-button :label="Mode.crawlCount">抓取数量</el-radio-button>
          <el-radio-button :label="Mode.resolveCount">解析数量</el-radio-button>
          <el-radio-button :label="Mode.projectCount">生成任务数量</el-radio-button>
          <el-radio-button :label="Mode.aveRunTime">平均运行时间</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
  <div class="chart-container" v-loading="loading">
    <div id="chart" style="width: 100%; height: 360px" />
  </div>
</div>
</template>

<script>
import * as Echarts from 'echarts'
import * as StatisticApi from '@/api/statistic'

const formatScheduleStatistics = (data) => {
  if (!data) return [];
  return data.map(item => ({
    scheduleName: item.schedule_info.name,
    ...item,
  }));
}

const Mode = {
  crawlCount: 'crawl_count',
  resolveCount: 'resolve_count',
  projectCount: 'project_count',
  aveRunTime: 'ave_run_time',
}

const OPTIONS_MAP = {
  [Mode.crawlCount]: {
    title: '定时计划抓取数量统计',
    yAxis: {
      name: '抓取数量(条)',
      type: 'value',
    },
  },
  [Mode.resolveCount]: {
    title: '定时计划解析数量统计',
    yAxis: {
      name: '解析数量(条)',
      type: 'value',
    },
  },
  [Mode.projectCount]: {
    title: '定时计划生成任务数量统计',
    yAxis: {
      name: '生成任务数量(条)',
      type: 'value',
    },
  },
  [Mode.aveRunTime]: {
    title: '定时计划平均运行时间统计',
    yAxis: {
      name: '平均运行时间(秒)',
      type: 'value',
    },
  },
}

const makeMultiLine = (str, charQty) => {
  const strs = str.split('')
  const len = strs.length
  if (len < charQty + 1) {
    return str
  }
  let result = ''
  strs.forEach((_, index) => {
    result += _
    if ((index + 1) % charQty === 0 && index < len - 1) {
      result += '\n'
    }
  })
  return result
}

const DEFAULT_OPTIONS = {
  title: {
    text: '',
    x:'center',
    y:'top',
    textAlign:'left'
  },
  grid: {
    left: 70,
    right: 80,
    bottom: 60,
    top: 60,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params) => {
      const {name, value} = params[0];
      return `<div>
          <span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:#2d8cf0;"></span>
          <span>${value}</span>
      </div>`
    }
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine:{
      show:false //不显示横轴线
    },
    axisTick: {
      alignWithLabel: true, //柱状图中心是否对齐刻度位置
      show: false //不显示刻度
    },
    axisLabel: {
      show:true,
      formatter: (value) => makeMultiLine(value, 7),
      interval: 0
    },
  },
  yAxis: {
    type: 'value',
  },
  series: [],
}

const mockData = [
  {
    scheduleName: '定时计划1',
    crawl_count: 100,
    resolve_count: 80,
    project_count: 50,
    ave_run_time_min: 10,
  },
  {
    scheduleName: '定时计划2',
    crawl_count: 120,
    resolve_count: 90,
    project_count: 60,
    ave_run_time_min: 12,
  },
  {
    scheduleName: '定时计划3',
    crawl_count: 80,
    resolve_count: 60,
    project_count: 40,
    ave_run_time_min: 8,
  },
  {
    scheduleName: '定时计划4',
    crawl_count: 110,
    resolve_count: 70,
    project_count: 45,
    ave_run_time_min: 11,
  },
  {
    scheduleName: '定时计划3',
    crawl_count: 70,
    resolve_count: 40,
    project_count: 30,
    ave_run_time_min: 8,
  },
  {
    scheduleName: '定时计划4',
    crawl_count: 120,
    resolve_count: 80,
    project_count: 45,
    ave_run_time_min: 11,
  },
]

export default {
  name: "ScheduleStatistic",
  data() {
    return {
      filter: {
        range: [],
        mode: Mode.crawlCount,
      },
      scheduleStatistics: [],
      chartOptions: DEFAULT_OPTIONS,
      loading: false,
    };
  },
  computed: {
    Mode() {
      return Mode;
    },
  },
  async mounted() {
    await this.fetchData();
    this.renderChart();
  },
  methods: {
    async fetchData() {
      try {
        const params = {
          start_time: this.filter.range[0],
          end_time: this.filter.range[1],
        }
        this.loading = true
        const {data} = await StatisticApi.scheduleStatistic(params);
        this.scheduleStatistics = formatScheduleStatistics(data);
      } catch (error) {
        this.$message.error(`获取数据失败: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },
    renderChart(mode = Mode.crawlCount) {
      const chart = Echarts.init(document.getElementById("chart"));
      this.chartOptions = DEFAULT_OPTIONS;
      this.chartOptions.title.text = OPTIONS_MAP[mode].title;
      const temp = [...this.scheduleStatistics].sort((a, b) => b[mode] - a[mode]).slice(0,8);
      console.log(temp)
      this.chartOptions.xAxis.data = temp.map(item => item.scheduleName);
      this.chartOptions.yAxis = OPTIONS_MAP[mode].yAxis;
      this.chartOptions.series = [{
        type: "bar",
        data: temp.map(item => item[mode]),
        barMaxWidth: 40,
        itemStyle: {
          color: '#2d8cf0',
        },
      }]
      chart.setOption(this.chartOptions);
    },
  },
}
</script>

<style scoped lang="scss">

</style>
