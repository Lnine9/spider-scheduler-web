<template>
<div class="schedule__container">
  <div class="schedule_header section">
    <el-button type="primary" @click="showAddModal" icon="el-icon-plus">新建计划</el-button>
    <el-button @click="fetchData" icon="el-icon-refresh" :loading="listLoading">刷新</el-button>
    <el-switch class="auto-refresh" v-model="autoRefresh" active-text="自动刷新(5s)" @change="switchAutoRefresh" />
  </div>
  <div class="schedule_content section">
    <div class="table">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        fit
        highlight-current-row
      >
        <el-table-column label="ID" width="100" prop="id" />
        <el-table-column label="名称" width="200" prop="name" />
        <el-table-column label="描述" width="240" prop="description" />
        <el-table-column label="所属专题" width="200" prop="subject_name" />
        <el-table-column label="爬虫ID" width="100" prop="spider_id" />
        <el-table-column label="Cron" width="120" prop="cron" align="center" />
        <el-table-column label="上次运行时间" width="200">
          <template slot-scope="{row}">
            {{ row.last_run_time | dateTimeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" prop="status" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusColorFilter">{{ row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :min-width="200" fixed="right">
          <template slot-scope="{row}">
            <div class="operator">
              <el-tooltip effect="dark" content="开启">
                <el-button type="primary" size="small" icon="el-icon-video-play" @click="resume(row.id)" ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="暂停">
                <el-button size="small" icon="el-icon-video-pause" @click="pause(row.id)" ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看记录">
                <el-button type="info" size="small" icon="el-icon-s-data" ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑">
                <el-button size="small" @click="showEditModal(row)" icon="el-icon-edit-outline"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除">
                <el-button type="danger" size="small" @click="deleteSchedule(row)" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </div>
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
    title="新建计划"
    :visible.sync="addModalVisible"
    width="60%"
  >
    <ScheduleForm @submit="submitAddForm" />
  </el-dialog>

  <el-dialog
    title="编辑计划"
    :visible.sync="editModalVisible"
    width="60%"
  >
    <ScheduleForm type="edit" :default-value="editItem" @submit="submitEditForm" />
  </el-dialog>
</div>
</template>

<script>
import {getScheduleList, addSchedule, deleteSchedule, updateSchedule, changeStatus} from '@/api/schedule'
import ScheduleForm from "@/views/schedule/ScheduleForm.vue";
import {dateTimeFilter, simpleClone} from "@/utils";

const STATUS_COLOR_MAP = {
  0: 'info',
  1: 'success',
}

const STATUS_MAP = {
  0: '暂停中',
  1: '开启中',
}

const statusColorFilter = status => STATUS_COLOR_MAP[status]
const statusFilter = status => STATUS_MAP[status]


export default {
  name: "Schedule",
  components: {ScheduleForm},
  filters: {
    statusFilter,
    statusColorFilter,
    dateTimeFilter
  },
  data() {
    return {
      list: [],
      listLoading: false,
      addModalVisible: false,
      editModalVisible: false,
      editItem: null,
      autoRefresh: false,
      autoRefreshTimer: null,
      currentPage: 1,
      pageSize: 20,
      total: 0,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      try {
        console.log('fetching data...')
        const res = await getScheduleList({
          page_num: this.currentPage,
          page_size: this.pageSize
        })
        console.log('fetch done',res.data)
        this.list = res.data.list
        this.total = res.data.total
      } finally {
        this.listLoading = false
      }
    },
    switchAutoRefresh(val) {
      if (val) {
        this.autoRefresh = true
        this.autoRefreshTimer = setInterval(() => {
          this.fetchData()
        }, 5000)
      } else {
        this.autoRefresh = false
        clearInterval(this.autoRefreshTimer)
      }
    },
    showAddModal() {
      this.addModalVisible = true
    },
    async submitAddForm(data) {
      try {
        const res = await addSchedule(data)
        this.$message.success('新建成功')
        this.addModalVisible = false
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    showEditModal(item) {
      this.editItem = simpleClone(item)
      this.editModalVisible = true
    },
    async submitEditForm(data) {
      try {
        const res = await updateSchedule(data)
        this.$message.success('编辑成功')
        this.editModalVisible = false
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    deleteSchedule(item) {
      this.$confirm(`确认删除计划【${item.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await deleteSchedule({id: item.id})
          this.$message.success('删除成功')
          await this.fetchData()
        } catch (e) {
          this.$message.error(e.message)
        }
      })
    },
    async resume(id) {
      try {
        await changeStatus({id, status: 1})
        this.$message.success('开启成功')
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    async pause(id) {
      try {
        await changeStatus({id, status: 0})
        this.$message.success('暂停成功')
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style scoped lang="scss">
.schedule__container {

  .schedule_header {
    .auto-refresh {
      margin-left: 20px;

      ::v-deep {
        .el-switch__core {
          zoom: 1.2;
        }
        .el-switch__label {
          color: #5a5e66;
        }
        .el-switch__label.is-active {
          color: #409eff;
        }
      }
    }
  }

  .table {
    min-height: 50vh;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .operator {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    ::v-deep {
      .el-button--small {
        font-size: 16px;
        padding: 7px 11px;
        margin: 0;
      }
    }
  }
}
</style>
