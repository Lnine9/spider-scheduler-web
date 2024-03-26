<template>
  <div class="project-detail__container">
    <div class="project-content">
      <el-form-item label="任务名称">
        {{ project.name }}
      </el-form-item>
      <el-form-item label="所属专题">
        {{ project.subject_name }}
      </el-form-item>
      <el-form-item label="所属计划">
        {{ project.schedule_name }}
      </el-form-item>
      <el-form-item label="创建时间">
        {{ project.create_time }}
      </el-form-item>
      <el-form-item label="状态">
        <el-tag>{{ project.status }}</el-tag>
      </el-form-item>
      <el-form-item label="当前进度">
        {{100}}
      </el-form-item>
      <el-form-item label="总抓取量">
        {{ project.total_crawl }}
      </el-form-item>
    </div>
    <div class="task-list">
      <el-table
        :data="taskList"
        fit
        highlight-current-row
      >
        <el-table-column label="ID" prop="id" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="执行节点">
          <template slot-scope="{row}">
            <div>{{ row.node_name }}</div>
            <el-tag>{{ row.node_ip }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-tag>{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始/结束时间">
          <template slot-scope="{row}">
            <div>{{ row.start_time }}</div>
            <div>{{ row.end_time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="抓取量" prop="total_crawl" />
        <el-table-column label="耗时" prop="cost_time" />
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="text" @click="showLog(row.id)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectDetail",
  props: {
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      project: {},
      taskList: [],
    };
  },
}
</script>

<style scoped lang="scss">
.project-detail__container {
  .project-content {
    background-color: #f4f5f7;
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .el-form-item {
      width: 400px;
    }
  }
}
</style>
