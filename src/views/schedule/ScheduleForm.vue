<template>
  <div class="schedule-form__container">
    <div class="schedule-form__content">
      <el-form
        :model="model"
        label-width="80px"
        ref="form"
      >
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="所属专题" prop="subject_id">
<!--          <SubjectSelect :disabled="isEdit" v-model="model.subject_id" />-->
          <el-input v-model="model.subject_id"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description" required>
          <el-input type="textarea" :rows="2" v-model="model.description"></el-input>
        </el-form-item>
        <el-form-item label="Cron" prop="cron" required>
          <el-input v-model="model.cron"></el-input>
        </el-form-item>
        <el-form-item label="爬虫ID" prop="spider_id" required>
          <el-input :disabled="isEdit" v-model="model.spider_id"></el-input>
        </el-form-item>
        <el-form-item label="切片范围" prop="slice_size" required>
          <div class="form-item-slice-size">
            <el-input-number :step="1" :min="0" v-model="model.slice_size"></el-input-number>
            <div class="desc">单位（min）,值为0时不切片</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="schedule-form__footer">
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import SubjectSelect from "@/components/SubjectSelect/index.vue";

export default {
  name: "ScheduleForm",
  components: {SubjectSelect},
  props: {
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
.schedule-form__container {
  ::v-deep {
    .el-select {
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
  .schedule-form__content {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .schedule-form__footer {
    display: flex;
    justify-content: end;
  }
}
</style>
