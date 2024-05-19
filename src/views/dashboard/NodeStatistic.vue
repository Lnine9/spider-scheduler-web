<template>
<div class="node-statistic">
  <div class="node-list" v-loading="loading">
    <template v-for="item in list">
      <div
        :key="item.id"
        class="node-item"
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
</div>
</template>

<script>
import {getNodeList} from "@/api/node";

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
  name: "NodeStatistic",
  filters: {
    statusFilter
  },
  data() {
    return {
      list: [],
      activeNode: null,
      activeNodeDetail: null,
      detailLoading: false,
      loading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    getNodeStatusColor(status) {
      return NODE_STATUS_COLOR_MAP[status]
    },
    async fetchData() {
      try {
        this.loading = true
        const {data} = await getNodeList()
        this.list = data.list
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
  }
}
</script>

<style scoped lang="scss">
.node-statistic {
  .node-list {
    border-radius: 6px;
    background-color: white;
    height: 100%;

    .node-item {
      display: flex;
      height: 60px;
      align-items: center;
      padding: 10px;
      border-radius: 6px;
      background-color: white;
      margin: 14px 0;
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
</style>
