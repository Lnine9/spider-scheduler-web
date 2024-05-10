<template>
  <div class="form-render-array">
    <template v-for="(_, index) in bindValue">
      <div class="form-render-array-item" :key="`${name}.${index}`">
        <el-form-item
          size="small"
          class="content"
          :prop="`${name}.${index}`"
        >
          <ResolverSelect v-model="bindValue[index]" :disabled="readOnly" />
        </el-form-item>
        <el-button size="small" class="remove" type="danger" @click="handleRemove(index)" v-if="!readOnly">删除</el-button>
      </div>
    </template>
    <el-button size="small" class="add" @click="handleAdd" v-if="!readOnly"><i class="el-icon-plus" />添加一条</el-button>
  </div>
</template>
<script>
import ResolverSelect from "@/components/ResolverSelect/index.vue";

export default {
  name: 'ResolverArrayEditor',
  components: {ResolverSelect},
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      default: () => ([]),
    },
    readOnly: Boolean,
  },
  computed: {
    bindValue(){
      return this.value || []
    },
  },
  methods: {
    handleRemove(index) {
      this.bindValue.splice(index, 1)
      this.$emit('update:value', this.bindValue)
    },
    handleAdd() {
      if (!this.bindValue) this.bindValue = []
      this.bindValue.push('')
      this.$emit('update:value', this.bindValue)
    },
  },
}
</script>

<style scoped lang="scss">
.form-render-array {
  .add {
    background-color: #727f86;
    color: #fff;
    border-color: #727f86;
    &:hover {
      background-color: #545b66;
      border-color: #545b66;
    }

    .el-icon-plus {
      margin-right: 4px;
    }
  }
  .form-render-array-item {
    display: flex;

    .content {
      flex: 1;
    }

    .remove {
      margin-left: 16px;
      height: fit-content;
    }
  }
}
</style>
