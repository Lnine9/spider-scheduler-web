<template>
  <div class="dashboard-container">
    <div class="pane schedule-pane">
      <div class="title">
        <i class="el-icon-timer"/> 定时计划统计
      </div>
      <ScheduleStatistic />
    </div>
    <div class="pane last24h-pane">
      <div class="title">
        <i class="el-icon-time" /> 最近24H子任务统计
      </div>
      <Last24hTaskCount />
    </div>
    <div class="pane project-pane">
      <div class="title">
        <i class="el-icon-notebook-2" /> 运行中任务
      </div>
      <ProjectStatistic />
    </div>
    <div class="pane node-pane">
      <div class="title">
        <i class="el-icon-s-help"/> 节点状态
      </div>
      <NodeStatistic />
    </div>
  </div>
</template>

<script>
import ScheduleStatistic from "@/views/dashboard/ScheduleStatistic.vue";
import ProjectStatistic from "@/views/dashboard/ProjectStatistic.vue";
import NodeStatistic from "@/views/dashboard/NodeStatistic.vue";
import Last24hTaskCount from "@/views/dashboard/Last24hTaskCount.vue";

export default {
  name: 'Dashboard',
  components: {Last24hTaskCount, NodeStatistic, ProjectStatistic, ScheduleStatistic},
  data() {
    return {
      filter: {
        range: [],
      },
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: grid;
  padding: 24px;
  grid-template-columns: 1.2fr 1fr 1fr;
  grid-template-areas:
  "a a b"
  "c d d";
  gap: 24px;
  overflow-y: scroll;

  .pane {
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      i {
        margin-right: 8px;
      }
    }
  }

  .schedule-pane {
    grid-area: a;
  }
  .last24h-pane {
    grid-area: d;
  }
  .project-pane {
    grid-area: c;
  }
  .node-pane {
    grid-area: b;
  }

}
</style>
