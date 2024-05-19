<template>
<div class="task__container">
  <div class="task__header">
    <div class="content">
      <el-form
        inline
        size="small"
        :model="filter"
        ref="filterForm"
      >
        <el-form-item>
          <div class="refresh-container">
            <el-button @click="search" icon="el-icon-refresh" :loading="listLoading">刷新</el-button>
            <el-switch class="auto-refresh" v-model="autoRefresh" active-text="自动刷新(5s)" @change="switchAutoRefresh" />
          </div>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="filter.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <i class="el-icon-collection" /> 所属专题
          </template>
          <SubjectSelect v-model="filter.subject_id" placeholder="请选择专题" clearable />
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <i class="el-icon-timer" /> 所属计划
          </template>
          <ScheduleSelect v-model="filter.schedule_id" placeholder="请选择计划" clearable />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filter.create_time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="addModalVisible = true" size="small" icon="el-icon-plus">新建任务</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="illustration" />
  </div>
  <div class="task__content section">
    <div class="table">
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
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag size="small" :type="row.status | projectStatusColorFilter">{{ row.status | projectStatusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始/结束时间" width="180">
          <template slot-scope="{row}">
            <div>{{ row.start_time | dateTimeFilter }}</div>
            <div>{{ row.end_time | dateTimeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="180">
          <template slot-scope="{row}">
            {{ row.create_time | dateTimeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" @click="showDetail(row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
      />
    </div>
  </div>

  <el-dialog
    title="任务详情"
    :visible.sync="detailModalVisible"
    width="60%"
    v-if="detailModalVisible"
  >
    <ProjectDetail :project-id="detailProjectId" />
  </el-dialog>

  <el-dialog
    title="新建任务"
    :visible.sync="addModalVisible"
    width="60%"
  >
    <ProjectForm @submit="handleAddProjectSubmit" />
  </el-dialog>
</div>
</template>

<script>
import SubjectSelect from "@/components/SubjectSelect/index.vue";
import ScheduleSelect from "@/components/ScheduleSelect/index.vue";
import {addProject, queryProject} from "@/api/task";
import ProjectDetail from "@/views/task/ProjectDetail.vue";
import {dateTimeFilter} from "@/utils";
import ProjectForm from "@/views/task/ProjectForm.vue";
import {projectStatusFilter, projectStatusColorFilter} from "@/constants/task";

export default {
  name: "index",
  components: {ProjectForm, ProjectDetail, ScheduleSelect, SubjectSelect},
  filters: {
    projectStatusColorFilter,
    projectStatusFilter,
    dateTimeFilter
  },
  data() {
    return {
      list: [],
      filter: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      listLoading: false,
      detailModalVisible: false,
      detailProjectId: null,
      autoRefresh: false,
      addModalVisible: false,
    }
  },
  async created() {
    const from = this.$route.query.from
    if (from === 'schedule') {
      this.filter.schedule_id = this.$route.query.scheduleId
    }
    if (from === 'subject') {
      this.filter.subject_id = this.$route.query.subjectId
    }
    await this.search()
    this.switchAutoRefresh(this.autoRefresh)
  },
  beforeDestroy() {
    clearInterval(this.autoRefreshTimer)
  },
  methods: {
    async search() {
      this.listLoading = true
      console.log(this.filter)
      try {
        const params = {
          ...this.filter,
          create_time_start: this.filter.create_time ? this.filter.create_time[0] : null,
          create_time_end: this.filter.create_time ? this.filter.create_time[1] : null,
          page_num: this.currentPage,
          page_size: this.pageSize
        }
        delete params.create_time
        const {data} = await queryProject(params)
        this.list = data.list
        this.total = data.total
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.listLoading = false
      }
    },
    showDetail(id) {
      this.detailProjectId = id
      this.detailModalVisible = true
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.search()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.search()
    },
    switchAutoRefresh(val) {
      if (val) {
        this.autoRefresh = true
        this.autoRefreshTimer = setInterval(() => {
          this.search()
        }, 5000)
      } else {
        this.autoRefresh = false
        clearInterval(this.autoRefreshTimer)
      }
    },
    async handleAddProjectSubmit(data, callback) {
      try {
        await addProject(data)
        this.$message.success('新建成功')
        this.addModalVisible = false
        await this.search()
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        callback()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.task__container {
  .task__header {
    display: grid;
    grid-template-columns: 1fr 300px;
    border-radius: 6px;
    overflow: hidden;
    background: white;
    margin: 10px;
    padding: 4px;

    .content {
      flex: 1;
      padding: 16px;
      display: flex;
      align-items: center;
    }

    .illustration {
      box-sizing: border-box;
      background: url("~@/assets/svg/task.svg") right no-repeat;
      background-size: contain;
      height: 100%;
    }
  }

  .refresh-container {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
    border: 1px dashed #c2c6ce;
    padding-right: 6px;
    margin-right: 10px;
  }

  .table {
    min-height: 50vh;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
