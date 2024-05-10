<template>
  <div class="dashboard-container">
    <div class="pane schedule-pane">
      <div class="title">
        定时计划统计
      </div>
      <ScheduleStatistic />
    </div>
    <div class="pane project-pane">
      <div class="title">
        运行中任务
      </div>
      <ProjectStatistic />
    </div>
    <div class="pane node-pane">
      <div class="title">
        节点状态
      </div>
      <NodeStatistic />
    </div>
  </div>
</template>

<script>
import ScheduleStatistic from "@/views/dashboard/ScheduleStatistic.vue";
import ProjectStatistic from "@/views/dashboard/ProjectStatistic.vue";
import NodeStatistic from "@/views/dashboard/NodeStatistic.vue";

export default {
  name: 'Dashboard',
  components: {NodeStatistic, ProjectStatistic, ScheduleStatistic},
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
  height: calc(100vh - 64px);
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 2fr 3fr;
  grid-template-areas:
  "a a a"
  "b b c";
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
    }
  }

  .schedule-pane {
    grid-area: a;
  }
  .project-pane {
    grid-area: b;
  }
  .node-pane {
    grid-area: c;
  }
}
</style>
