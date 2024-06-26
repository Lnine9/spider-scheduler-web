<template>
  <div class="nodes__container">
    <div class="nodes__header">
      <div class="content">
        <el-button type="primary" @click="showAddModal" icon="el-icon-plus">新增节点</el-button>
        <el-button type="primary" @click="updateEggModalVisible = true" icon="el-icon-upload">更新项目</el-button>
      </div>
      <div class="illustration" />
    </div>
    <div class="nodes__content">
      <div class="node-list" v-loading="listLoading">
        <template v-for="item in list">
          <div
            :key="item.id"
            class="node-item"
            :class="{active: activeNode === item.id}"
            @click="handleSelectNode(item)"
          >
            <div class="address">
              {{ item.address }}
            </div>
            <div class="status">
              <div class="status-dot" :style="{backgroundColor: getNodeStatusColor(item.status)}"></div>
              <div class="status-text" :style="{color: getNodeStatusColor(item.status)}">{{item.status | statusFilter}}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="node-detail" v-loading="detailLoading">
        <div class="empty" v-if="!activeNodeDetail">
          请选择一个节点查看详情
        </div>
        <template v-else>
          <div class="disconnect" v-if="activeNodeDetail.status === 0">
            未连接
          </div>
          <template v-else>
            <div class="hardware">
              <div class="pane">
                <el-progress :percentage="parseInt(activeNodeDetail.cpu_percent)" type="dashboard" :stroke-width="10" />
                <div class="text">
                  CPU使用率
                </div>
              </div>
              <div class="pane">
                <el-progress :percentage="parseInt(activeNodeDetail.memory_used_mb / activeNodeDetail.memory_total_mb * 100)" type="dashboard" :stroke-width="10" />
                <div class="text">
                  内存使用率
                  <div class="desc">{{ activeNodeDetail.memory_used_mb.toFixed(0) }} / {{ activeNodeDetail.memory_total_mb.toFixed(0) }} MB</div>
                </div>
              </div>
              <div class="pane">
                <el-progress :percentage="parseInt(activeNodeDetail.disk_used_mb / activeNodeDetail.disk_total_mb * 100)" type="dashboard" :stroke-width="10" />
                <div class="text">
                  磁盘使用率
                  <div class="desc">{{ activeNodeDetail.disk_used_mb.toFixed(0) }} / {{ activeNodeDetail.disk_total_mb.toFixed(0) }} MB</div>
                </div>
              </div>
            </div>
            <div class="view">
<!--              <iframe :src="activeNodeDetail.address" frameborder="0" width="100%" height="100%" />-->
              <el-table
                :data="activeNodeDetail.jobs.list"
                style="width: 100%"
                stripe
                border
              >
                <el-table-column
                  prop="id"
                  label="任务ID"
                />
                <el-table-column
                  prop="spider"
                  label="爬虫"
                />
                <el-table-column
                  prop="status"
                  label="状态"
                />
                <el-table-column
                  prop="duration_str"
                  label="耗时"
                />
                <el-table-column
                  prop="start_time"
                  label="开始时间"
                />
                <el-table-column
                  prop="end_time"
                  label="结束时间"
                />
                <el-table-column
                  label="日志"
                >
                  <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="toLog(scope.row)">查看日志</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </template>
      </div>
    </div>
    <el-dialog
      title="新增节点"
      :visible.sync="addModalVisible"
      width="640px"
    >
      <NodeForm @submit="handleSubmitAddNode" />
    </el-dialog>

    <el-dialog
      v-if="updateEggModalVisible"
      title="更新项目文件"
      :visible.sync="updateEggModalVisible"
      width="500px"
    >
      <DeployForm @submit="handleUpdateEggSubmit" />
    </el-dialog>

    <el-dialog
      :visible.sync="deployLoading"
      width="300px"
      title="项目部署中"
      :close-on-press-escape="false"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-progress :percentage="deployProgress" />
    </el-dialog>
  </div>
</template>

<script>
import {getNodeList, getNodeDetail, addNode, deleteNode, updateEgg} from "@/api/node";
import NodeForm from "@/views/nodes/NodeForm.vue";
import DeployForm from "@/views/nodes/DeployForm.vue";

const NODE_STATUS_COLOR_MAP = {
  0: "#909399",
  1: "#67C23A",
  2: "#F56C6C",
}

const STATUS_MAP = {
  0: "未连接",
  1: "正常",
  2: "异常"
}
const statusFilter = (status) => {
  return STATUS_MAP[status]
}

export default {
  name: "index",
  components: {DeployForm, NodeForm},
  filters: {
    statusFilter
  },
  data() {
    return {
      list: [],
      addModalVisible: false,
      activeNode: null,
      listLoading: false,
      activeNodeDetail: null,
      detailLoading: false,
      autoRefreshListTimer: null,
      autoRefreshDetailTimer: null,
      updateEggModalVisible: false,
      deployLoading: false,
      deployProgress: 0
    }
  },
  async created() {
    await this.fetchData()
    this.$route.query.id && this.handleSelectNode({id: this.$route.query.id})
    this.initAutoRefresh()
  },
  beforeDestroy() {
    clearInterval(this.autoRefreshListTimer)
    clearInterval(this.autoRefreshDetailTimer)
  },
  methods: {
    initAutoRefresh() {
      this.autoRefreshListTimer = setInterval(() => {
        this.fetchData(false)
      }, 10000)
      this.autoRefreshDetailTimer = setInterval(() => {
        if (this.activeNode) {
          this.fetchDetailData(false)
        }
      }, 5000)
    },
    async fetchData(needLoading = true) {
      try {
        if (needLoading)
          this.listLoading = true
        const {data} = await getNodeList()
        this.list = data.list
      } catch (e) {
        console.error(e)
      } finally {
        this.listLoading = false
      }
    },
    showAddModal() {
      this.addModalVisible = true
    },
    getNodeStatusColor(status) {
      return NODE_STATUS_COLOR_MAP[status]
    },
    async fetchDetailData(needLoading = true) {
      try {
        if (needLoading)
          this.detailLoading = true
        const {data} = await getNodeDetail({id: this.activeNode})
        if (String(data.id) === String(this.activeNode)) {
          this.activeNodeDetail = data
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.detailLoading = false
      }
    },
    handleSelectNode(item) {
      this.activeNode = item.id
      this.fetchDetailData()
    },
    async handleSubmitAddNode(data, callback) {
      try {
        await addNode(data)
        this.$message.success("新增成功")
        this.addModalVisible = false
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        callback()
      }
    },
    async handleUpdateEggSubmit(egg) {
      try {
        this.deployLoading = true
        const total = this.list.filter(node => node.status === 1).length
        let count = 0
        this.deployProgress = 0
        for (let node of this.list) {
          if (node.status === 1) {
            const formData = new FormData()
            formData.append("egg", egg)
            formData.append("id", node.id)
            await updateEgg(formData)
            count ++
            this.deployProgress = count / total * 100
          }
        }
        this.$message.success("更新成功")
        this.updateEggModalVisible = false
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.deployLoading = false
      }
    },
    toLog(job) {
      const node = this.activeNodeDetail
      window.open(`${node.address}/logs/default/${job.spider}/${job.id}.log`)
    }
  }
}
</script>

<style scoped lang="scss">
.nodes__container {
  .nodes__header {
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
      background: url("~@/assets/svg/server.svg") right no-repeat;
      background-size: contain;
      height: 100%;
      min-height: 100px;
    }
  }
  .nodes__content {
    display: flex;
    height: 70vh;


    .node-list {
      width: 25%;
      min-width: 400px;
      border-radius: 6px;
      background-color: white;
      padding: 10px;
      margin: 10px;
      height: 100%;

      .node-item {
        display: flex;
        height: 60px;
        align-items: center;
        padding: 10px;
        border-radius: 6px;
        background-color: white;
        margin: 14px;
        cursor: pointer;
        border: 1px solid #ededed;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transition: all 0.2s;

        &:hover {
          background-color: #e1e1e8;
          box-shadow: 0 0 20px rgba(67, 64, 64, 0.16);
        }

        &.active {
          border: 2px solid #409eff;
          background-color: #e5edf4;
        }

        .address {
          flex: 1;
        }
        .status {
          width: 80px;
          display: flex;
          align-items: center;
          .status-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: white 1px solid;
            margin-right: 6px;
          }
          .status-text {
            font-size: 12px;
          }
        }
      }
    }

    .node-detail {
      flex: 1;
      border-radius: 6px;
      background-color: white;
      padding: 16px;
      margin: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;

      .hardware {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }

      .view {
        flex: 1;
        margin-top: 20px;
        border: 1px solid #ededed;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: scroll;
      }

      .pane {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ededed;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 6px;

        .text {
          font-size: 14px;
          margin-left: 12%;
          height: 80%;

          .desc {
            font-size: 12px;
            color: #7b7b7b;
          }
        }
      }
    }
  }
}
</style>
