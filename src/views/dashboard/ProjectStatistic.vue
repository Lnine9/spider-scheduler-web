<template>
<div class="project-statistic">
  <div class="list">
    <div class="list-header">
      <div>任务名称</div>
      <div>子任务状态</div>
      <div>创建时间</div>
      <div>任务进度</div>
    </div>
    <template v-for="item in projects">
      <div class="item" @click="handleSelectProject(item.id)" :key="item.id">
        <div class="content">
          <div class="name">{{ item.projectName }}</div>
          <div class="tasks-status">
            <div v-if="item.showBlocks" class="blocks">
              <template v-for="block in item.blocks">
                <div class="block" :style="{backgroundColor: block.color}"></div>
              </template>
            </div>
            <div v-else class="success-process">
              <div class="block" style="background-color: #478be7;display: inline-block"></div>
              <span style="color: #478be7; font-weight: bold;margin-left: 6px">{{ item.success_task_count }}</span>
              <span style="margin: 0 1px;color: #949aa5">/</span>
              <span style="color: #949aa5">{{ item.task_count }}</span>
            </div>
          </div>
          <div class="create-time">{{ item.createTime | dateTimeFilter }}</div>
          <div class="process-text">{{ item.processText }}</div>
        </div>
        <div class="process">
          <div class="inner" :style="{width: item.processText}" />
        </div>
      </div>
    </template>
  </div>

  <el-dialog
    title="任务详情"
    :visible.sync="detailModalVisible"
    width="60%"
    v-if="detailModalVisible"
  >
    <ProjectDetail :project-id="detailProjectId" />
  </el-dialog>
</div>
</template>

<script>
import * as StatisticApi from "@/api/statistic";
import {dateTimeFilter} from "@/utils";
import ProjectDetail from "@/views/task/ProjectDetail.vue";

const mockData = [
  {
    project_info: {
      name: "项目1",
      // 2024-04-18 10:00:00
      create_time: 1715330850,
      id: 'xx1'
    },
    task_count: 10,
    success_task_count: 7,
    error_task_count: 0,
    running_task_count: 1,
    pending_task_count: 2,
  },
  {
    project_info: {
      name: "项目2",
      create_time: 1715330650,
      id: 'xx2'
    },
    task_count: 5,
    success_task_count: 2,
    error_task_count: 1,
    running_task_count: 1,
    pending_task_count: 1,
  },
  {
    project_info: {
      name: "项目3",
      create_time: 1715330550,
      id: 'xx3'
    },
    task_count: 7,
    success_task_count: 3,
    error_task_count: 2,
    running_task_count: 2,
    pending_task_count: 0,
  },
  {
    project_info: {
      name: "项目4",
      create_time: 1715330450,
      id: 'xx4'
    },
    task_count: 9,
    success_task_count: 4,
    error_task_count: 3,
    running_task_count: 2,
    pending_task_count: 1,
  },
];

const formatProjectStatistics = (data) => {
  if (!data) return [];
  return data.map(item => {
    const process = item.task_count === 0 ? 0 : item.success_task_count / item.task_count;
    const processText = `${(process * 100).toFixed(0)}%`;
    const showBlocks = item.task_count < 8;
    let blocks = [];
    if (showBlocks) {
      blocks = blocks.concat(new Array(item.success_task_count).fill({status: 'success', color: '#478be7'}));
      blocks = blocks.concat(new Array(item.error_task_count).fill({status: 'error', color: '#F56C6C'}));
      blocks = blocks.concat(new Array(item.running_task_count).fill({status: 'running', color: '#c7cad0'}));
      blocks = blocks.concat(new Array(item.pending_task_count).fill({status: 'pending', color: '#c7cad0'}));
    }
    return {
      ...item,
      id: item.project_info.id,
      projectName: item.project_info.name,
      createTime: item.project_info.create_time,
      process,
      processText,
      showBlocks,
      blocks,
    };
  });
}

export default {
  name: "ProjectStatistic",
  components: {ProjectDetail},
  filters: {
    dateTimeFilter,
  },
  data() {
    return {
      projects: [],
      loading: false,
      detailModalVisible: false,
      detailProjectId: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const {data} = await StatisticApi.runningProjects();
        this.projects = formatProjectStatistics(data);
      } catch (e) {
        this.$message.error(e.message);
        console.error(e)
      } finally {
        this.loading = false;
      }
    },
    handleSelectProject(projectId) {
      this.detailProjectId = projectId;
      this.detailModalVisible = true;
    },
  },
}
</script>

<style scoped lang="scss">
.project-statistic {
  .list {
    .list-header {
      display: grid;
      grid-template-columns: repeat(3, 1fr) 60px;
      align-items: center;
      padding-left: 20px;
      height: 40px;
      font-size: 12px;
      color: #5a5e66;
      background-color: white;
      border: 1px solid #ebeef5;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    .item {
      height: 60px;
      border: 1px solid #ebeef5;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: background-color 0.2s;
      &:hover {
        background-color: #e9eaef;
      }

      .content {
        padding-left: 20px;
        display: grid;
        grid-template-columns: repeat(3, 1fr) 60px;
        align-items: center;
        flex: 1;

        .blocks {
          display: grid;
          grid-template-columns: repeat(4, 12px);
          gap: 2px;
        }

        .block {
          width: 12px;
          height: 12px;
        }

        .process-text {
          width: 60px;
          background-color: #bed6f1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          height: 100%;
        }

        .create-time {
          font-size: 12px;
          color: #5a5e66;
        }
      }

      .process {
        width: 100%;
        background-color: #bed6f1;
        .inner {
          height: 5px;
          background-color: #478be7;
        }
      }
    }
  }
}
</style>
