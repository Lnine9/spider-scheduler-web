<template>
  <div class="spider__container">
    <div class="spider__header">
      <div class="content">
        <el-button type="primary" @click="addModel()" icon="el-icon-plus">新增爬虫</el-button>
      </div>
      <div class="illustration" />
    </div>
    <div class="main_content">
      <div class="section">
        <div class="title">爬虫信息</div>
        <div class="spider__content">
          <div class="table">
            <el-table
              v-loading="listLoading"
              :data="list"
            >
              <el-table-column width="200" prop="id" label="ID" />
              <el-table-column width="250" prop="name" label="名称" />
              <el-table-column prop="description" label="描述" />
              <el-table-column prop="an_type" label="爬虫类型" />
              <el-table-column width="250px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="showEditPop(scope)">编辑</el-button>
                  <el-button style="color: #e53b6e" type="text" @click="deleteManageSpider(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20]"
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
      <div class="section">
        <div class="title">解析器列表</div>
        <ResolverList />
      </div>
    </div>
    <el-dialog
      v-if="addModalVisible"
      title="新建爬虫"
      :visible.sync="addModalVisible"
      width="60%"
    >
      <div class="spider__from">
        <SpiderForm @submit="submitAddForm" />
      </div>
    </el-dialog>

    <el-dialog
      v-if="editModalVisible"
      title="编辑爬虫"
      :visible.sync="editModalVisible"
      width="60%"
    >
      <div class="spider__from">
        <SpiderForm :default-value="editItem" type="edit" @submit="submitEditForm" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addManageSpider, deleteManageSpider, getManageSpiderList, updateManageSpider } from '@/api/spider'
import {simpleClone} from "@/utils";
import ResolverList from "@/views/spider/ResolverList.vue";
import SpiderForm from "@/views/spider/SpiderForm.vue";

export default {
  name: 'Manage',
  components: { ResolverList, SpiderForm },
  data() {
    return {
      list: [],
      addModalVisible: false,
      editModalVisible: false,
      editItem: null,
      listLoading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      row: null,
      resolverList: []
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
    showEditPop(scope) {
      this.editModalVisible = true
      this.showModalVisible = false
      this.editItem = simpleClone(scope.row)
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

.spider__container {
  .spider__header {
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
      background: url("~@/assets/svg/bug.svg") right no-repeat;
      background-size: contain;
      height: 100%;
      min-height: 100px;
    }

    .spider-text {
      font-size: 25px;
      font-weight: bold;
    }
  }

  .main_content {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 500px;
  }

  .spider__content {

    .table {
      min-height: 73vh;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .section {
    display: grid;
    grid-template-rows: 30px 1fr;
    .title {
      font-weight: bold;
      margin-bottom: 10px;
    }
  }

}
</style>
