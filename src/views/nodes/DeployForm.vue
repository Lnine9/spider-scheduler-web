<template>
  <div class="spider-egg-form">
    <div class="upload">
      <el-upload
        drag
        action=""
        ref="upload"
        accept=".egg"
        :auto-upload="false"
        :multiple="false"
        :show-file-list="true"
        :on-change="handleChange"
        v-loading="loading"
        element-loading-text="文件部署中，请耐心等待..."
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </div>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>

<script>
export default {
  name: "DeployForm",
  data() {
    return {
      egg: {},
      loading: false,
      fileList: []
    }
  },
  methods: {
    async submit() {
      if (!this.egg) {
        this.$message.error('请上传egg文件')
        return
      }
      try {
        this.$emit('submit', this.egg)
      } catch (e) {
        console.error(e)
      }
    },

    handleChange(file) {
      this.egg = file.raw
      if (this.$refs.upload.uploadFiles.length > 1) {
        this.$refs.upload.uploadFiles.splice(0, 1)
      }
    },
  }
}
</script>

<style scoped lang="scss">
.spider-egg-form {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .upload {
    height: 230px;
    background-color: #f3faff;
    padding: 6px;
  }
  ::v-deep {
    .el-list-enter-active,
    .el-list-leave-active {
      transition: none;
    }

    .el-list-enter,
    .el-list-leave-active {
      opacity: 0;
    }
    .el-upload-list {
      height: 40px;
    }
  }
}
</style>
