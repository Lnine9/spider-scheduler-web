<template>
  <el-select
    v-bind="$attrs"
    v-model="bindValue"
    v-loading="loading"
    class="resolver-select"
    placeholder="请选择解析器"
    filterable
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
import { getResolverList } from '@/api/spider';

export default {
  name: 'ResolverSelect',
  props: {
    value: {
      type: [String, Number],
    },
  },
  data() {
    return {
      resolverList: [],
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
        this.resolverList.find((item) => item.id === val),
      );
    },
    async getSubjectList() {
      this.loading = true;
      try {
        const { data } = await getResolverList();
        if (!data) return;
        this.resolverList = data.list;
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
