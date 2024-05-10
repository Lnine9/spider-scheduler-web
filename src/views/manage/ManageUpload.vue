<template>
  <div class="manage-form__container">
    <div class="manage-form__content">
      <el-form
        ref="form"
        :model="model"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="文件" prop="file">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :headers="{'Authorization': getToken()}"
            action="string"
            :auto-upload="false"
            :on-change="beforeUpload"
          >
            <div class="upload-text">
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="解析器类型" prop="parserType" required>
          <el-input v-model="model.parserType" />
        </el-form-item>
        <el-form-item label="名称" prop="parserName" required>
          <el-input v-model="model.parserName" />
        </el-form-item>
        <el-form-item label="类名" prop="className" required>
          <el-input v-model="model.className" />
        </el-form-item>
        <el-form-item label="描述" prop="discription">
          <el-input v-model="model.discription" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="manage-form__footer">
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { fileUploader } from '@/utils/index.js'
export default {
  name: 'ManageUpload',
  data() {
    return {
      model: {},
      file: null
    }
  },
  methods: {
    getToken,
    beforeUpload(file) {
      this.file = file
      return true
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.model)
          const formData = new FormData()
          formData.append('MultiDict', this.file.raw)
          formData.append('name', this.model.parserName)
          formData.append('type', this.model.parserType)
          formData.append('class_name', this.model.className)
          formData.append('discription', this.model.discription)
          fileUploader(formData).then((res) => {
            if (res.code === 200) {
              this.$emit('showUploadModel', false)
              this.$emit('getFileInfo')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-form__container {
  ::v-deep {
    .el-select {
      width: 40%;
    }
  }
  .manage-form__content {
    .el-input {
      width: 280px;
    }
    font-size: 12px;
    font-weight: 400;
    margin: 0 20px 20px 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .manage-form__footer {
    margin: 0 20px 0 20px;
    display: flex;
    justify-content: start;
  }

  height: 100%;
}
</style>
