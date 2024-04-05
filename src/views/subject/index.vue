<template>
  <div class="subject__container">
    <div class="subject__header section">
      <el-button type="primary" @click="showAddModal" icon="el-icon-plus">新建专题</el-button>
    </div>
    <div class="subject__content section">
      <div class="subject-list">
        <template v-for="item in list">
          <el-card :key="item.id" class="subject-item" shadow="hover">
            <div class="subject-item__header">
              <div class="subject-item__title">{{ item.name }}</div>
              <div class="subject-item__action">
                <el-button type="text" icon="el-icon-edit" @click="showEditModal(item)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" @click="deleteSubject(item)">删除</el-button>
              </div>
            </div>
            <div class="subject-item__content">
              <div class="subject-item__desc">{{ item.description }}</div>
            </div>
            <div class="subject-item__footer">
              <div class="subject-item__id"># {{ item.id }}</div>
            </div>
          </el-card>
        </template>
      </div>
    </div>

    <el-dialog
      title="新建专题"
      :visible.sync="addModalVisible"
      width="60%"
    >
      <SubjectForm @submit="handleSubmitAddSubject" />
    </el-dialog>

    <el-dialog
      title="编辑专题"
      :visible.sync="editModalVisible"
      width="60%"
    >
      <SubjectForm :type="'edit'" :default-value="editItem" @submit="handleSubmitEditSubject" />
    </el-dialog>
  </div>
</template>

<script>
import SubjectForm from "@/views/subject/SubjectForm.vue";
import {deleteSubject, addSubject, updateSubject, getSubjectList} from "@/api/subject";
import {simpleClone} from "@/utils";

export default {
  name: "index",
  components: {SubjectForm},
  data() {
    return {
      list: [],
      addModalVisible: false,
      editModalVisible: false,
      editItem: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const res = await getSubjectList()
        this.list = res.data.list
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    showAddModal() {
      this.addModalVisible = true;
    },
    async handleSubmitAddSubject(data) {
      try {
        const res = await addSubject(data)
        this.$message.success('新建成功')
        this.addModalVisible = false
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    showEditModal(item) {
      this.editItem = simpleClone(item);
      this.editModalVisible = true;
    },
    async handleSubmitEditSubject(data) {
      try {
        console.log(data)
        const res = await updateSubject(data)
        this.$message.success('编辑成功')
        this.editModalVisible = false
        await this.fetchData()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    deleteSubject(item) {
      this.$confirm(`确认删除专题【${item.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await deleteSubject({id: item.id})
          this.$message.success('删除成功')
          await this.fetchData()
        } catch (e) {
          this.$message.error(e.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.subject__container {

  .subject__content {
    background-color: #f6f6f8;

    .subject-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      .subject-item {
        width: 400px;
        border: 1px solid #dbdde3;

        .subject-item__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;

          .subject-item__title {
            font-size: 18px;
            font-weight: bold;
          }

          .subject-item__action {
            display: flex;
            gap: 10px;
          }
        }

        .subject-item__content {
          padding: 10px;

          .subject-item__desc {
            font-size: 14px;
            color: #666;
          }
        }

        .subject-item__footer {
          padding: 10px 10px 0 10px;
          text-align: right;

          .subject-item__id {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
