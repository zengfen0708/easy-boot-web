<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.aliasName" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['SUPER','PERMISSION_ALL','PERMISSION_CREATE']" style="display: inline-block;margin: 0px 2px 0px">
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
        <eForm ref="form" :is-add="true" />
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" size="small">
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['SUPER','PERMISSION_EDIT','PERMISSION_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['SUPER','PERMISSION_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover
            :ref="scope.row.id"
            v-permission="['SUPER','PERMISSION_DELETE']"
            placement="top"
            width="200"
          >
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import { del } from '@/api/system/permission'
import eForm from './form'
export default {
  components: { treeTable, eForm },
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: '别名',
          value: 'alias'
        },
        {
          text: '名称',
          value: 'name'
        }
      ],
      delLoading: false, expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'system/permissions/list'
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
      this.$refs.form.getPermissions()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getPermissions()
      _this.form = { id: data.id, name: data.name, alias: data.alias, parentId: data.parentId }
      _this.dialog = true
    },
    changeExpand() {
      this.expand = !this.expand
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
