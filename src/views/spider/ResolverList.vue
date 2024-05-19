<template>
  <div class="resolver-list">
    <div class="search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="search"
        placeholder="请输入解析器名称"
        clearable
      />
    </div>
    <div class="list" v-loading="loading">
      <div class="resolver-item" v-for="item in filteredList" :key="item.id">
        <div class="left">
          <div class="border" />
          <div class="type">【{{ item.type }}】</div>
          <div class="name">{{ item.name }}</div>
        </div>
        <div class="right">
          <i class="delete el-icon-remove" @click="deleteResolver(item.id)"></i>
        </div>
      </div>
    </div>
    <div class="tool-bar">
      <el-button type="primary" class="add-box" @click="showAddResolverModal">新增解析器</el-button>
    </div>
    <el-dialog
      v-if="addModalVisible"
      title="新建爬虫"
      :visible.sync="addModalVisible"
      width="60%"
    >
      <div class="spider__from">
        <ResolverForm @submit="submitAddForm" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ResolverForm from "@/views/spider/ResolverForm.vue";
import * as Api from "@/api/spider";

export default {
  name: "ResolverList",
  components: {ResolverForm},
  data() {
    return {
      resolverList: [],
      addModalVisible: false,
      loading:false,
      total: 0,
      currentPage: 1,
      search: '',
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    filteredList() {
      return this.resolverList.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true
        const {data} = await Api.getResolverList()
        this.resolverList = data.list
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    showAddResolverModal() {
      this.addModalVisible = true
    },
    deleteResolver(id) {
      this.$confirm('此操作将永久删除该解析器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await Api.deleteResolver({id})
          await this.fetchData()
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async submitAddForm(data) {
      try {
        await Api.addResolver(data)
        this.addModalVisible = false
        await this.fetchData()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.resolver-list {
  display: grid;
  height: 100%;
  grid-template-rows: 50px 1fr 40px;
  width: 100%;

  .tool-bar {
    .add-box {
      font-size: 12px;
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .list {
    overflow-y: auto;
    width: 100%;
    height: 720px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1) inset;
    padding: 4px;
    .resolver-item {
      border-radius: 4px;
      margin-bottom: 12px;
      display: grid;
      grid-template-columns: 1fr 40px;
      align-items: center;
      height: 46px;
      font-size: 14px;
      color: #474b56;
      background-color: #ecf7ff;
      width: 100%;

      .left {
        display: flex;
        height: 100%;
        align-items: center;
        .border {
          height: 100%;
          width: 6px;
          background-color: #409eff;
        }
        .type {
          font-weight: bold;
          margin-right: 4px;
          width: 120px;
          overflow: hidden;
          text-overflow:ellipsis; white-space: nowrap;
        }
        .name {
          width: 250px;
          overflow: hidden;
          text-overflow:ellipsis; white-space: nowrap;
        }
      }
      .right {
        .delete {
          width: 100%;
          font-size: 16px;
          cursor: pointer;
          text-align: center;
          color: #e53b6e;
          padding: 0;
        }
      }
    }
  }
}
</style>
