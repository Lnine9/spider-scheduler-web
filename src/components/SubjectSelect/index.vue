<template>
  <el-select
    v-bind="$attrs"
    v-model="bindValue"
    v-loading="loading"
    class="subject-select"
    placeholder="请选择专题"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
import { getSubjectList } from '@/api/subject';

export default {
  name: 'SubjectSelect',
  props: {
    value: {
      type: [String, Number],
    },
  },
  data() {
    return {
      subjectList: [],
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
    this.getSubjectList();
  },
  methods: {
    update(val) {
      this.$emit('input', val);
      this.$emit(
        'select-extra',
        this.subjectList.find((item) => item.id === val),
      );
    },
    async getSubjectList() {
      this.loading = true;
      try {
        const { data } = await getSubjectList();
        if (!data) return;
        this.subjectList = data.list;
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
