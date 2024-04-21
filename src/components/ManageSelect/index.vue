<template>
  <div class="parsers">
    <el-select
      v-model="bindValue"
      v-loading="loading"
      :disabled="showModalVisible"
      class="manage-select"
      placeholder="请选择"
    >
      <el-option v-for="item in resolver" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
    </el-select>
    <span v-if="options.length > 1" class="deleteBut" style="margin-left: 30px">
      <el-button type="danger" @click="deleteItem">删除</el-button>
    </span>
  </div>
</template>
<script>

export default {
  name: 'ManageSelect',
  props: {
    showModalVisible: {
      type: Boolean,
      default: false
    },
    index: {
      type: [Number]
    },
    value: {
      type: [String, Number]
    },
    loading: {
      type: Boolean,
      default: false
    },
    resolver: {
      type: Array
    },
    options: {
      type: Array
    }
  },
  computed: {
    bindValue: {
      get() {
        return this.value
      },
      set(val) {
        this.update(val)
      }
    }
  },
  methods: {
    update(val) {
      this.$emit('input', val)
      this.$emit('selectExtra', this.resolver.find((item) => item.value === val), this.index)
    },
    deleteItem() {
      this.$emit('deleteParser', this.index)
    }
  }
}
</script>

<style lang="less" scoped></style>

