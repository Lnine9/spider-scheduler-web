<template>
<div class="node-statistic">
  <div class="node-list" v-loading="loading">
    <template v-for="item in list">
      <div
        :key="item.id"
        class="node-item"
        @click="toDetail(item.id)"
      >
        <div class="address">
          <img src="@/assets/svg/cloudserver.svg" />
          {{ formatAddress(item.address) }}
        </div>
        <div class="process">
          <i class="el-icon-cpu">CPU</i>
          <el-progress :percentage="parseInt(item.cpu_percent)" :stroke-width="10" />
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
      autoRefreshTimer: null,
    };
  },
  created() {
    this.fetchData()
    this.autoRefreshTimer = setInterval(() => {
      this.fetchData(false)
    }, 3000)
  },
  destroyed() {
    clearInterval(this.autoRefreshTimer)
  },
  methods: {
    getNodeStatusColor(status) {
      return NODE_STATUS_COLOR_MAP[status]
    },
    async fetchData(needLoading=true) {
      try {
        if (needLoading)
          this.loading = true
        const {data} = await getNodeList()
        this.list = data.list
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    formatAddress(address) {
      return address.replace('http://', '').replace('https://', '')
    },
    toDetail(id) {
      this.$router.push({name: 'Nodes', query: {id}})
    }
  }
}
</script>

<style scoped lang="scss">
.node-statistic {
  .node-list {
    border-radius: 6px;
    background-color: white;
    height: 100%;
    min-height: 300px;
    overflow: scroll;

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
      color: #333;

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
        display: flex;
        img {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
      }
      .process {
        width: 200px;
        display: flex;
        align-items: center;
        color: #333;
        font-size: 14px;

        .el-progress {
          margin-left: 6px;
          width: 150px;
        }
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
