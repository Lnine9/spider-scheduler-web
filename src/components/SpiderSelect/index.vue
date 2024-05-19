<template>
  <el-select
    v-bind="$attrs"
    v-model="bindValue"
    v-loading="loading"
    class="spider-select"
    placeholder="请选择爬虫"
    filterable
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
import { getManageSpiderList } from '@/api/spider';

export default {
  name: 'SpiderSelect',
  props: {
    value: {
      type: [String, Number],
    },
  },
  data() {
    return {
      spiderList: [],
      options: [],
      loading: false,
    };
  },
  computed: {
    bindValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.update(val);
      },
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    update(val) {
      this.$emit('input', val);
      this.$emit(
        'select-extra',
        this.spiderList.find((item) => item.id === val),
      );
    },
    async fetchData() {
      this.loading = true;
      try {
        const { data } = await getManageSpiderList({
          page_no: 1,
          page_size: 1000,
        });
        if (!data) return;
        this.spiderList = data.spider_info;
        this.options = this.spiderList.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
