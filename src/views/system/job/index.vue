<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.jobName" clearable placeholder="输入岗位名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="query.status" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['SUPER','USERJOB_ALL','USERJOB_CREATE']" style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增岗位</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          <div>{{ scope.row.deptName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div v-for="item in dicts" :key="item.id">
            <el-tag v-if="scope.row.status.toString() === item.value" :type="scope.row.status === 0 ? 'info':''">{{ item.label }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['SUPER','USERJOB_ALL','USERJOB_EDIT','USERJOB_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['SUPER','USERJOB_ALL','USERJOB_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['SUPER','USERJOB_ALL','USERJOB_DELETE']"
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
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/system/job'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      // 加载数据字典
      this.getDict('job_status')
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'system/job/list'
      this.params = { page: this.page, size: this.size, dictId: this.dictId }
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
    add() {
      this.isAdd = true
      this.$refs.form.getDepts()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getDepts()
      _this.form = {
        id: data.id,
        name: data.name,
        sort: data.sort,
        status: data.status.toString(),
        deptId: data.deptId
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
