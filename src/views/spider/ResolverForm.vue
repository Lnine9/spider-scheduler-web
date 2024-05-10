<template>
<div class="resolver-form__container">
  <div class="resolver-form__content">
    <div class="illustration" />
    <div class="form">
      <el-form
        :model="model"
        label-width="120px"
        ref="form"
      >
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="model.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" required>
          <el-input v-model="model.type" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="类路径" prop="class_path" required>
          <el-input v-model="model.class_path" placeholder="请输入类路径（相对于base_component）" />
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="resolver-form__footer">
    <el-button type="primary" @click="submit">保存</el-button>
  </div>
</div>
</template>

<script>

export default {
  name: "ResolverForm",
  props:  {
    type: {
      type: String,
      default: 'add'
    },
    defaultValue: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      model: {}
    }
  },
  computed: {
    isEdit() {
      return this.type === 'edit'
    }
  },
  watch: {
    defaultValue: {
      handler(val) {
        this.model = val
      },
      immediate: true
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.model)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.resolver-form__container {
  .resolver-form__content {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    display: flex;

    .illustration {
      background: url("~@/assets/svg/bug.svg") center no-repeat;
      background-size: contain;
      width: 460px;
    }

    .form {
      flex: 1;
      margin-left: 20px;
    }
  }
  .resolver-form__footer {
    display: flex;
    justify-content: end;
  }
}
</style>
