<template>
<div class="subject-form__container">
  <div class="subject-form__content">
    <el-form
      :model="model"
      label-width="80px"
      ref="form"
    >
      <el-form-item label="名称" prop="name" required>
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" :rows="2" v-model="model.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="subject-form__footer">
    <el-button type="primary" @click="submit">保存</el-button>
  </div>
</div>
</template>

<script>
export default {
  name: "SubjectForm",
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
.subject-form__container {
  .subject-form__content {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .subject-form__footer {
    display: flex;
    justify-content: end;
  }
}
</style>
