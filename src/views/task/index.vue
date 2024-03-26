<template>
<div class="task__container">
  <div class="task__header section">
    <div class="filter">
      <el-form
        inline
        size="small"
        :model="filter"
        ref="filterForm"
      >
        <el-form-item label="名称">
          <el-input v-model="filter.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="所属专题">
          <SubjectSelect v-model="filter.subject_id" placeholder="请选择专题" clearable />
        </el-form-item>
        <el-form-item label="所属计划">
          <ScheduleSelect v-model="filter.schedule_id" placeholder="请选择计划" clearable />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filter.create_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="task__statistics section">
  </div>
  <div class="task__content section">
    <el-table
      :data="list"
      v-loading="listLoading"
      fit
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="所属专题" prop="subject_name" />
      <el-table-column label="所属计划" prop="schedule_name" />
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
      <el-table-column label="创建时间" prop="create_time" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="showDetail(row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    title="任务详情"
    :visible.sync="detailModalVisible"
    width="60%"
  >

  </el-dialog>
</div>
</template>

<script>
import SubjectSelect from "@/components/SubjectSelect/index.vue";
import ScheduleSelect from "@/components/ScheduleSelect/index.vue";

export default {
  name: "index",
  components: {ScheduleSelect, SubjectSelect},
  data() {
    return {
      list: [],
      filter: {},
      listLoading: false,
      detailModalVisible: false,
      detailProjectId: null,
    }
  },
  methods: {
    search() {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 1000)
    },
    showDetail(id) {
      this.detailProjectId = id
      this.detailModalVisible = true
    },
  }
}
</script>

<style scoped lang="scss">

</style>
