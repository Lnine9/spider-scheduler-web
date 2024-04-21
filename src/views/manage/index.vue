<template>
  <div class="manage__container">
    <div class="section">
      <div class="manage__header">
        <el-button type="primary" size="medium" @click="addModel()">新增爬虫</el-button>
      </div>
    </div>
    <div class="section">
      <div class="manage__content">
        <div class="table">
          <el-table
            v-loading="listLoading"
            class="down"
            :data="list"
            stripe
            height="700"
          >
            <el-table-column width="200" prop="id" label="ID" />
            <el-table-column width="250" prop="name" label="名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column width="250px" label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="details">
                  <el-button type="text" @click="showInfoPop(scope)">详情</el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="edit">
                  <el-button type="text" @click="showEditPop(scope)">编辑</el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="delete">
                  <el-button type="text" @click="deleteManageSpider(scope)">删除</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      v-if="addModalVisible"
      title="新建爬虫"
      :visible.sync="addModalVisible"
      width="40%"
    >
      <div class="manage__from">
        <ManageForm :show-modal-visible="showModalVisible" @submit="submitAddForm" />
      </div>
    </el-dialog>

    <el-dialog
      v-if="editModalVisible"
      title="编辑爬虫"
      :visible.sync="editModalVisible"
      width="40%"
    >
      <div class="manage__from">
        <ManageForm :show-modal-visible="showModalVisible" :row="row" type="edit" @submit="submitEditForm" />
      </div>
    </el-dialog>

    <el-dialog
      v-if="showModalVisible"
      title="爬虫详情"
      :visible.sync="showModalVisible"
      width="40%"
    >
      <div class="manage__from">
        <ManageForm :show-modal-visible="showModalVisible" :row="row" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ManageForm from '@/views/manage/ManageForm.vue'
import { addManageSpider, deleteManageSpider, getManageSpiderList, updateManageSpider } from '@/api/spider'

export default {
  name: 'Manage',
  components: { ManageForm },
  data() {
    return {
      list: [],
      addModalVisible: false,
      showModalVisible: false,
      editModalVisible: false,
      listLoading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      row: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    addModel() {
      this.addModalVisible = true
      this.showModalVisible = false
    },
    showInfoPop(scope) {
      this.showModalVisible = true
      const json = JSON.stringify(scope.row)
      this.row = null
      this.row = JSON.parse(json)
    },
    showEditPop(scope) {
      this.editModalVisible = true
      this.showModalVisible = false
      const json = JSON.stringify(scope.row)
      this.row = null
      this.row = JSON.parse(json)
    },
    async fetchData() {
      this.listLoading = true
      try {
        console.log('fetching data...')
        const res = await getManageSpiderList({
          page_no: this.currentPage,
          page_size: this.pageSize
        })
        console.log('fetch done', res.data)
        this.list = res.data.spider_info
        this.list.map(item => {
          item.resolvers = JSON.parse(item.resolvers)
        })
        this.total = res.data.total
      } finally {
        this.listLoading = false
      }
    },
    async submitAddForm(data) {
      try {
        const res = await addManageSpider(data)
        console.log(res)
        this.$message.success('新建成功')
        this.addModalVisible = false
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    async submitEditForm(data) {
      try {
        const res = await updateManageSpider(data)
        console.log(res)
        this.$message.success('编辑成功')
        this.editModalVisible = false
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    deleteManageSpider(item) {
      this.$confirm(`确认该爬虫吗【${item.row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await deleteManageSpider({ id: item.row.id })
          this.$message.success('删除成功')
          await this.fetchData()
        } catch (e) {
          this.$message.error(e.message)
        }
      })
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

.manage__container {
  .manage__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .manage-text {
      font-size: 25px;
      font-weight: bold;
    }
  }

  .manage__content {

    .table {
      min-height: 73vh;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }

  .manage__from {
    overflow: auto;
    height: 580px;
  }
}
</style>
