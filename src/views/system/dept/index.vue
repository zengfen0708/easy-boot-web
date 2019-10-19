<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.name" clearable placeholder="输入部门名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="query.status" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['SUPER','DEPT_CREATE']" style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
      <div style="display: inline-block;">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-more"
          @click="changeExpand"
        >{{ expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true" :dicts="dicts" />
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts" />
    <!--表格渲染-->
    <tree-table v-loading="loading" :expand-all="expand" :data="data" :columns="columns" size="small">
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
      <el-table-column v-if="checkPermission(['SUPER','DEPT_ALL','DEPT_EDIT','DEPT_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['SUPER','DEPT_ALL','DEPT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['SUPER','DEPT_ALL','DEPT_DELETE']"
            placement="top"
            width="180"
          >
            <p style="color:red"> 确定删除吗,如果存在下级部门则一并删除，此操作不能撤销！</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" :disabled="scope.row.id === 1" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/system/dept'
import eForm from './form'
export default {
  components: { eForm, treeTable },
  mixins: [initData, initDict],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
      enabledTypeOptions: [
        { key: 1, display_name: '正常' },
        { key: 0, display_name: '禁用' }
      ],
      delLoading: false, expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      // 加载数据字典
      this.getDict('dept_status')

      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'system/dept/list'
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

        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.message)
      })
    },
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.getDepts()

      _this.dialog = true
    },
    changeExpand() {
      this.expand = !this.expand
      this.init()
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getDepts()
      _this.form = {
        id: data.id,
        name: data.name,
        parentId: data.parentId,
        createTime: data.createTime,
        status: data.status.toString()
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
