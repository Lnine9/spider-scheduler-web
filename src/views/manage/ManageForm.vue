<template>
  <div class="manage-form__container">
    <div class="manage-form__content">
      <el-form
        ref="form"
        :model="model"
        label-width="120px"
        label-position="right"
        size="small"
        :disabled="showModalVisible"
      >
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="model.name" />
        </el-form-item>
        <el-form-item label="公告类型" prop="an_type" required>
          <el-select v-model="model.an_type" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" required>
          <el-input v-model="model.description" type="textarea" :rows="1" />
        </el-form-item>
        <el-form-item label="主类名称" prop="main_class" required>
          <el-input v-model="model.main_class" />
        </el-form-item>
<!--        <el-form-item label="解析器" prop="resolvers">-->
<!--          <el-button type="primary" @click="showUploadModel(true)">上传文件</el-button>-->
<!--          <template v-for="(item, index) in parserIds">-->
<!--            <el-form-item-->
<!--              :key="index"-->
<!--              :rules="resolverRule"-->
<!--            >-->
<!--              <ManageSelect-->
<!--                v-model="item.value"-->
<!--                :options="options"-->
<!--                :resolver="resolver"-->
<!--                :loading="loading"-->
<!--                :index="index"-->
<!--                @deleteParser="deleteParser"-->
<!--                @selectExtra="selectExtra"-->
<!--              />-->
<!--            </el-form-item>-->
<!--          </template>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="">-->
<!--          <el-button type="primary" @click="add">添加</el-button>-->
<!--        </el-form-item>-->
        <el-form-item label="初始请求URL" prop="url" required>
          <el-input v-model="model.url" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method" required>
          <el-select v-model="model.method" placeholder="请选择">
            <el-option
              v-for="item in methodType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="model.method === 'POST'" label="请求体" prop="body">
          <el-input v-model="model.body" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="manage-form__footer">
      <el-button type="primary" :disabled="showModalVisible" @click="submit">保存</el-button>
    </div>

    <el-dialog
      width="30%"
      title="上传文件"
      :visible.sync="uploadModelVisible"
      append-to-body
      :destroy-on-close="true"
    >
      <div class="manage-upload">
        <ManageUpload @showUploadModel="showUploadModel" @getFileInfo="getFileInfo" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ManageUpload from '@/views/manage/ManageUpload.vue'
import ManageSelect from '@/components/ManageSelect/index.vue'
import { getFileInfo } from '@/api/spider'
export default {
  name: 'ManageForm',
  components: { ManageSelect, ManageUpload },
  props: {
    type: {
      type: String,
      default: 'add'
    },
    showModalVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      model: {},
      uploadModelVisible: false,
      loading: false,
      parserIds: [],
      typeList: [{
        value: 'AG_L',
        label: 'AG_L'
      }, {
        value: 'CB_E',
        label: 'CB_E'
      }, {
        value: 'CB_G',
        label: 'CB_G'
      }, {
        value: 'C_A',
        label: 'C_A'
      }, {
        value: 'C_G',
        label: 'C_G'
      }, {
        value: 'DL',
        label: 'DL'
      }, {
        value: 'FB_G',
        label: 'FB_G'
      }, {
        value: 'HT_G',
        label: 'HT_G'
      }, {
        value: 'I_G',
        label: 'I_G'
      }, {
        value: 'MB_G',
        label: 'MB_G'
      }, {
        value: 'MED_AN',
        label: 'MED_AN'
      }, {
        value: 'RB_E',
        label: 'RB_E'
      }, {
        value: 'WB_G',
        label: 'WB_G'
      }],
      resolver: [],
      resolverRule: [{
        required: true,
        type: 'array',
        message: 'please choose one parser id at least',
        trigger: 'blur',
        validator: this.checkParser
      }],
      methodType: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }]
    }
  },
  created() {
    this.getFileInfo()
    if (Object.keys(this.row).length > 0) {
      this.model = this.row
    }
  },
  methods: {
    checkParser(rule, value, callback) {
      if (this.parserIds.length === 0) {
        callback(new Error('please choose one parser id at least'))
      } else {
        callback()
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // const resolvers = []
          // this.parserIds.map(item => {
          //   resolvers.push(item.value)
          // })
          // this.model['resolvers'] = resolvers
          this.$emit('submit', this.model)
        }
      })
    },
    showUploadModel(visible) {
      this.uploadModelVisible = visible
    },
    add() {
      this.options.push({
        key: Date.now(),
        value: ''
      })
    },
    deleteParser(index) {
      this.options.splice(index, 1)
      this.parserIds.splice(index, 1)
    },
    selectExtra(item, index) {
      if (this.parserIds[index] !== null && this.parserIds[index] !== undefined) {
        this.parserIds[index] = {
          value: item.value,
          label: item.label,
          index: index
        }
      } else {
        this.parserIds.push({
          value: item.value,
          label: item.label,
          index: index
        })
      }
    },
    async getFileInfo() {
      this.loading = true
      try {
        const { data } = await getFileInfo()
        if (!data) return
        this.resolver = []
        this.parserIds = []
        data.resolvers.map((item) => {
          this.resolver.push({
            label: item.name,
            value: item.id
          })
        })
        if (this.row !== null && this.row !== undefined) {
          if (this.row.resolvers !== undefined && this.row.resolvers.length > 0) {
            const data = []
            this.row.resolvers.map((item, index) => {
              this.resolver.map(resolver => {
                if (item === resolver.value) {
                  data.push({
                    label: resolver.label,
                    value: resolver.value,
                    key: Date.now()
                  })
                  this.parserIds.push({
                    label: resolver.label,
                    value: resolver.value,
                    index: index
                  })
                }
              })
            })
            this.options = data
            this.model.options = this.options
          }
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
    .parsers {
      margin: 20px 0 0 0;
    }
    font-size: 12px;
    font-weight: 400;
    margin: 0 50px 20px 50px;
    border-bottom: 1px solid #ebeef5;
    overflow-y: scroll;
  }
  .manage-form__footer {
    margin: 0 50px 0 50px;
    display: flex;
    justify-content: flex-start;
  }

  .manage-upload {
    overflow: auto;
    height: 400px;
  }
}
</style>
