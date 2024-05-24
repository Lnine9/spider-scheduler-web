<template>
  <div class="project-detail__container">
    <div class="project-content">
      <div class="item">
        <div class="item__label">
          任务ID
        </div>
        <div class="item__value">
          {{ project.id }}
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          任务名称
        </div>
        <div class="item__value">
          {{ project.name }}
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          所属专题
        </div>
        <div class="item__value">
          {{ project.subject_name }}
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          所属计划
        </div>
        <div class="item__value">
          {{ project.schedule_name }}
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          创建时间
        </div>
        <div class="item__value">
          {{ project.create_time | dateTimeFilter }}
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          当前状态
        </div>
        <div class="item__value">
          <el-tag size="small" :type="project.status | projectStatusColorFilter">{{ project.status | projectStatusFilter }}</el-tag>
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          总抓取量
        </div>
        <div class="item__value">
          {{ project.total_crawl }} （条）
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          当前进度
        </div>
        <div class="item__value">
          <el-progress style="width: 70%" :percentage="process" />
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          抓取范围
        </div>
        <div class="item__value" style="font-size: 12px">
          {{ project.range_start_time | dateTimeFilter }} <br/> {{ project.range_end_time | dateTimeFilter }}
        </div>
      </div>
      <div class="item">
        <div class="item__label">
          切片大小
        </div>
        <div class="item__value">
          {{ project.slice_size }} (min)
        </div>
      </div>
    </div>
    <div class="task-list">
      <div class="title">
        子任务列表
      </div>
      <el-table
        :data="taskList"
        fit
        size="small"
        highlight-current-row
      >
        <el-table-column label="ID" prop="id" :width="140" />
        <el-table-column label="执行节点" prop="node_address" :width="140" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag size="small" :type="row.status | taskStatusColorFilter">{{ row.status | taskStatusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="抓取范围" :width="150">
          <template slot-scope="{row}">
            <div>{{ row.range_start_time | dateTimeFilter }}</div>
            <div>{{ row.range_end_time | dateTimeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始/结束时间" :width="150">
          <template slot-scope="{row}">
            <div>{{ row.start_time | dateTimeFilter }}</div>
            <div>{{ row.end_time | dateTimeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="抓取量" prop="total_crawl" />
        <el-table-column label="解析量" prop="total_resolve" />
        <el-table-column label="耗时">
          <template slot-scope="{row}">
            {{ getCostTime(row).min }} m {{ getCostTime(row).sec }} s
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" @click="showLog(row)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getProject, getTaskByProjectId} from "@/api/task";
import {dateTimeFilter} from "@/utils";
import {projectStatusColorFilter, projectStatusFilter, taskStatusFilter, taskStatusColorFilter} from '@/constants/task'

export default {
  name: "ProjectDetail",
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  filters: {
    projectStatusFilter,
    projectStatusColorFilter,
    taskStatusFilter,
    taskStatusColorFilter,
    dateTimeFilter
  },
  data() {
    return {
      project: {},
      taskList: [],
      autoRefreshTimer: null,
    };
  },
  created() {
    this.fetchData();
    this.autoRefreshTimer = setInterval(() => {
      this.fetchData();
    }, 3000);
  },
  destroyed() {
    clearInterval(this.autoRefreshTimer);
  },
  computed: {
    process() {
      if (!this.taskList || !this.taskList.length) return 0;
      // 子任务中已完成的数量 / 总任务数
      return this.taskList.filter(item => item.status === 3).length / this.taskList.length * 100;
    },
  },
  methods: {
    async fetchData() {
      try {
        const {data: projectData} = await getProject({id: this.projectId});
        const {data: taskListData} = await getTaskByProjectId({project_id: this.projectId});
        this.project = projectData;
        taskListData.list.sort((a, b) => a.range_start_time - b.range_start_time);
        this.taskList = taskListData.list;

      } catch (e) {
        this.$message.error(e.message);
      }
    },
    showLog(task) {
      if (task.log_url) {
        window.open(task.log_url);
      } else {
        this.$message.info('暂无日志');
      }
    },
    getCostTime(task) {
      if (!task.start_time) return 0;
      if (!task.end_time) {
        const min = Math.floor((new Date().getTime()/1000 - task.start_time) / 60)
        const sec = Math.floor((new Date().getTime()/1000 - task.start_time) % 60)
        return {
          min: min > 0 ? min : 0,
          sec: sec > 0 ? sec : 0
        };
      }
      const min = Math.floor((task.end_time - task.start_time) / 60);
      const sec = Math.floor((task.end_time - task.start_time) % 60);
      return {min, sec};
    }
  },
}
</script>

<style scoped lang="scss">
.project-detail__container {
  .project-content {
    background-color: #f4f7f8;
    padding: 20px;
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-auto-flow: column;
    border-radius: 6px;
    gap: 10px;

    .item {
      display: flex;
      height: 20px;
      align-items: center;
      .item__label {
        width: 80px;
        font-weight: bold;
        text-align: right;
        margin-right: 0.5rem;

        &::after {
          content: ':';
        }
      }
      .item__value {
        flex: 1;
      }
    }
  }

  .task-list {
    .title {
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
