<template>
  <div class="nodes__container">
    <div class="nodes__header">
      <div class="content">
        <el-button type="primary" @click="showAddModal" icon="el-icon-plus">新增节点</el-button>
      </div>
      <div class="illustration" />
    </div>
    <div class="nodes__content">
      <div class="node-list">
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
      <div class="node-detail">

      </div>
    </div>
  </div>
</template>

<script>

const NODE_STATUS_COLOR_MAP = {
  0: "#909399",
  1: "#67C23A",
  2: "#F56C6C"
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
  filters: {
    statusFilter
  },
  data() {
    return {
      list: [],
      addModalVisible: false,
      activeNode: null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.list = [
        {id: 1, address: "127.0.0.1:8000", status: 0},
        {id: 2, address: "127.0.0.2:9000", status: 1},
        {id: 3, address: "127.0.0.3:8000", status: 2},
      ]
    },
    showAddModal() {
      this.addModalVisible = true
    },
    getNodeStatusColor(status) {
      return NODE_STATUS_COLOR_MAP[status]
    },
    handleSelectNode(item) {
      this.activeNode = item.id
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
    .node-list {
      width: 400px;
      border-radius: 6px;
      background-color: white;
      padding: 10px;
      margin: 10px;
      height: 70vh;

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
  }
}
</style>
