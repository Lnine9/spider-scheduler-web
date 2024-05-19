<template>
  <div class="node-form" v-loading="loading">
    <el-form :model="form" ref="form" inline label-width="80px">
      <el-form-item label="节点地址" prop="address" required>
        <el-input style="width: 400px" v-model="form.address" placeholder="请输入节点地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" icon="el-icon-plus" :loading="loading">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "NodeForm",
  data() {
    return {
      form: {
        address: ''
      },
      loading: false
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form, res => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
