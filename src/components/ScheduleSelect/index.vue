<template>
  <el-select
    v-bind="$attrs"
    v-model="bindValue"
    v-loading="loading"
    class="schedule-select"
    placeholder="请选择计划"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
import { getScheduleList } from '@/api/schedule';

export default {
  name: 'ScheduleSelect',
  props: {
    value: {
      type: [String, Number],
    },
  },
  data() {
    return {
      scheduleList: [],
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
    this.getScheduleList();
  },
  methods: {
    update(val) {
      this.$emit('input', val);
      this.$emit(
        'select-extra',
        this.scheduleList.find((item) => item.id === val),
      );
    },
    async getScheduleList() {
      const postData = {
        page_num: 1,
        page_size: 65535,
      };
      this.loading = true;
      try {
        const { data } = await getScheduleList(postData);
        if (!data) return;
        this.scheduleList = data.list;
        this.options = data.list.map((item) => ({
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
