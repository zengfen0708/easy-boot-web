<template>
  <div class="app-container">
    <!--form 组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dictMap" />
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas" />
        </div>
        <el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick" />
      </el-col>
      <!--用户数据-->
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.username" clearable placeholder="输入关键字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
          <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
            <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-select v-model="query.enabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
            <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <!-- 新增 -->
          <div v-permission="['SUPER','USER_ALL','USER_CREATE']" style="display: inline-block;margin: 0px 2px;">
            <el-button
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add"
            >新增</el-button>
          </div>
          <!-- 导出 -->
          <div style="display: inline-block;">
            <el-button
              v-permission="['SUPER','USER_ALL','USER_EXPORTEXCEL']"
              :loading="downloadLoading"
              size="mini"
              class="filter-item"
              type="warning"
              icon="el-icon-download"
              @click="download"
            >导出</el-button>
          </div>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" border size="small" style="width: 100%;">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="nickname" label="昵称" />
          <el-table-column prop="phone" label="电话" />
          <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" />
          <el-table-column label="部门 / 岗位">
            <template slot-scope="scope">
              <div>{{ scope.row.deptName }} / {{ scope.row.jobName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-for="item in dicts" :key="item.id">
                <el-tag v-if="scope.row.status.toString() === item.value" :type="scope.row.status === 0 ? 'info':''">{{ item.label }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['SUPER'])" label="操作" width="125" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['SUPER']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
              <el-popover
                :ref="scope.row.id"
                v-permission="['SUPER']"
                placement="top"
                width="180"
              >
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          :current-page="page + 1"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/system/user'
import { getDepts } from '@/api/system/dept'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      delLoading: false, deptName: '', depts: [], deptId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'username', display_name: '用户名' },
        { key: 'email', display_name: '邮箱' }
      ],
      enabledTypeOptions: [
        { key: 1, display_name: '启用' },
        { key: 0, display_name: '禁用' }
      ]

    }
  },
  created() {
    this.getDeptDatas()
    this.$nextTick(() => {
      // 加载数据字典
      this.getDictMap('user_status,user_sex')

      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    beforeInit() {
      this.url = 'system/user/list'
      this.params = { page: this.page, size: this.size }
      const query = this.query
      if (query) {
        // 对象合并
        Object.assign(this.params, query)
      }

      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.message)
      })
    },
    getDeptDatas() {
      const data = { 'name': this.deptName.trim() }
      getDepts(data).then(res => {
        this.depts = res.data
      })
    },
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.init()
    },
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.getDepts()
      _this.getAllRole()
      _this.dialog = true
    },
    // 导出
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户名', '邮箱', '头像地址', '状态', '注册日期', '最后修改密码日期']
        const filterVal = ['id', 'username', 'email', 'avatar', 'enabled', 'createTime', 'lastPasswordResetTime']
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      const _this = this
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return _this.parseTime(v[j])
        } else if (j === 'enabled') {
          return _this.parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getAllRole()
      _this.getDepts()
      _this.roleIds = []
      _this.form = { id: data.id,
        username: data.username, password: data.password, nickname: data.nickname,
        phone: data.phone, email: data.email,
        sex: data.sex,
        status: data.status.toString(), roles: [], deptId: data.deptId, jobId: data.jobId }
      data.roles.forEach(function(data, index) {
        _this.roleIds.push(data.id)
      })
      _this.getJobs(data.deptId)
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
</style>
