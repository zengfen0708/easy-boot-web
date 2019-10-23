<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增用户' : '编辑用户'" append-to-body width="690px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" />
          </el-form-item></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="密   码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio v-for="item in dicts.user_status" :key="item.id" v-model="form.status" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" style="width: 100px;" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话" prop="phone">
            <el-input v-model.number="form.phone" style="width: 100px;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio v-for="item in dicts.user_sex" :key="item.id" v-model="form.sex" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门">
            <treeselect v-model="form.deptId" :options="depts" :style="style" placeholder="选择部门" @select="selectFun" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="form.jobId" :style="style" placeholder="请先选择部门">
              <el-option
                v-for="(item, index) in jobs"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item style="margin-bottom: 0px;" label="角色">
            <el-select v-model="roleIds" style="width: 400px;" multiple filterable placeholder="请选择角色">
              <el-option
                v-for="(item, index) in roles"
                :key="item.roleName + index"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { add, edit } from '@/api/system/user'
import { getDeptsTree } from '@/api/system/dept'
import { getAllRole } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Object,
      required: true
    }

  },
  data() {
    const validPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (!this.isvalidPassword(value)) {
        callback(new Error('提示：需要设置强密码(必须包含大小写字母和数字和特殊字符四种类型组合，长度在8位以上)'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false,
      form: {
        username: '', password: '', nickname: null, phone: null, email: null, status: '', jobId: '', deptId: '', sex: '', roles: []
      },
      roleIds: [], roles: [],
      style: 'width: 184px',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validPassword }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.dept.id = this.deptId
      this.form.job.id = this.jobId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.deptId === null || this.deptId === undefined) {
            this.$message({
              message: '部门不能为空',
              type: 'warning'
            })
          } else if (this.jobId === null) {
            this.$message({
              message: '岗位不能为空',
              type: 'warning'
            })
          } else if (this.roleIds.length === 0) {
            this.$message({
              message: '角色不能为空',
              type: 'warning'
            })
          } else {
            this.loading = true
            this.form.roles = []
            const _this = this
            this.roleIds.forEach(function(data, index) {
              const role = { id: data }
              _this.form.roles.push(role)
            })
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          }
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          message: '添加用户成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改用户成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.roleIds = []
      this.form = { username: '', password: '', nickname: null,
        phone: null, email: null, status: '',
        jobId: '', deptId: '', sex: '', roles: []
      }
    },
    getAllRole() {
      getAllRole().then(res => {
        this.roles = res.data
      }).catch(err => {
        console.log(err.response.message)
      })
    },
    getJobs(id) {
      getAllJob(id).then(res => {
        this.jobs = res.data
      }).catch(err => {
        console.log(err.response.message)
      })
    },
    getDepts() {
      getDeptsTree().then(res => {
        this.depts = res.data
      })
    },
    isvalidPassword(str) {
      const reg = /^^(?![0-9]+$)(?![a-zA-Z]+$)\S{8,}$/
      return reg.test(str)
    },
    selectFun(node, instanceId) {
      this.jobId = null
      this.jobs = []
      this.getJobs(node.id)
    }
  }
}
</script>

<style scoped>

</style>
