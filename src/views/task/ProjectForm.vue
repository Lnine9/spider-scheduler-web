<template>
  <div class="project-form__container">
    <div class="project-form__content">
      <div class="illustration" />
      <div class="form">
        <el-form
          :model="model"
          label-width="90px"
          ref="form"
        >
          <el-form-item label="任务名称" prop="name" required>
            <el-input v-model="model.name" placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="爬虫ID" prop="spider_id" required>
            <el-input v-model="model.spider_id"  placeholder="请输入爬虫ID"></el-input>
          </el-form-item>
          <el-form-item label="所属专题" prop="subject_id">
            <SubjectSelect v-model="model.subject_id" />
          </el-form-item>
          <el-form-item label="开始时间" prop="range_start_time" required>
            <el-date-picker
              v-model="model.range_start_time"
              type="datetime"
              placeholder="请选择抓取范围开始时间"
              clearable
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="range_end_time" required>
            <el-date-picker
              v-model="model.range_end_time"
              type="datetime"
              placeholder="请选择抓取范围结束时间"
              clearable
            />
          </el-form-item>
          <el-form-item label="切片大小" prop="slice_size" required>
            <div class="form-item-slice-size">
              <el-input-number :step="1" :min="0" v-model="model.slice_size"></el-input-number>
              <div class="desc">单位（min）,值为0时不切片</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="project-form__footer">
      <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
    </div>
  </div>
</template>

<script>
import SubjectSelect from "@/components/SubjectSelect/index.vue";

export default {
  name: "ProjectForm",
  components: {SubjectSelect},
  data() {
    return {
      model: {},
      loading: false
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            ...this.model,
            range_start_time: this.model.range_start_time.getTime() / 1000,
            range_end_time: this.model.range_end_time.getTime() / 1000
          }
          this.$emit('submit', data, () => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.project-form__container {
  .project-form__content {
    display: flex;
  }

  .illustration {
    background: url("~@/assets/svg/工作计划.svg") center no-repeat;
    background-size: contain;
    width: 460px;
  }

  .form {
    flex: 1;
    margin-right: 20px;
  }

  ::v-deep {
    .el-input,.el-select,.el-date-picker {
      width: 100%;
    }
  }

  .form-item-slice-size {
    position: relative;
    .desc {
      position: absolute;
      top: 0;
      right: 0;
      color: #909399;
    }
  }

  .project-form__content {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .project-form__footer {
    display: flex;
    justify-content: end;
  }
}
</style>
