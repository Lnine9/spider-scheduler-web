<template>
<div class="spider-form__container">
  <div class="spider-form__content">
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
        <el-form-item label="公告类型" prop="an_type" required>
          <el-select v-model="model.an_type" placeholder="请选择类型" :disabled="isEdit">
            <el-option
              v-for="item in AN_TYPES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" required>
          <el-input v-model="model.description" type="textarea" :rows="2" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="主类名称" prop="main_class" required>
          <el-input v-model="model.main_class" placeholder="请输入主类名称" />
        </el-form-item>
        <el-form-item label="初始URL" prop="url" required>
          <el-input v-model="model.url" placeholder="请输入初始请求URL" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method" required>
          <el-select v-model="model.method" placeholder="请选择方式">
            <el-option :label="'GET'" :value="'GET'" />
            <el-option :label="'POST'" :value="'POST'" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="model.method === 'POST'" label="请求体" prop="body">
          <el-input type="textarea" :rows="2" v-model="model.body" placeholder="请输入请求体" />
        </el-form-item>
        <el-form-item label="解析器" prop="resolvers" required>
          <ResolverArrayEditor name="resolvers" :value.async="model.resolvers" />
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="spider-form__footer">
    <el-button type="primary" @click="submit">保存</el-button>
  </div>
</div>
</template>

<script>
import {AN_TYPES} from "@/constants/spider";
import ResolverSelect from "@/components/ResolverSelect/index.vue";
import ResolverArrayEditor from "@/views/spider/ResolverArrayEditor.vue";

export default {
  name: "SpiderForm",
  components: {ResolverArrayEditor, ResolverSelect},
  props:  {
    type: {
      type: String,
      default: 'add'
    },
    defaultValue: {
      type: Object,
      default: () => ({
        name: '',
        an_type: '',
        description: '',
        main_class: 'AnnouncementSpider',
        url: '',
        method: 'GET',
        body: '',
        resolvers: []
      })
    }
  },
  data() {
    return {
      model: {}
    }
  },
  computed: {
    AN_TYPES() {
      return AN_TYPES
    },
    isEdit() {
      return this.type === 'edit'
    }
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (!val.resolvers) {
          val.resolvers = []
        }
        this.model = val
      },
      immediate: true
    }
  },
  methods: {
    submit() {
      console.log(this.model)
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
.spider-form__container {
  .spider-form__content {
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

    ::v-deep {
      .el-select {
        width: 100%;
      }
    }
  }
  .spider-form__footer {
    display: flex;
    justify-content: end;
  }
}
</style>
