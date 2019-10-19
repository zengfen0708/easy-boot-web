<template>
  <div class="app-container">
    <!--工具栏-->
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.name" clearable placeholder="输入菜单名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['SUPER','MENU_ALL','MENU_CREATE']" style="display: inline-block;margin: 0px 2px;">
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
          @click="changExpand"
        >{{ expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true" />
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" size="small">
      <el-table-column prop="icon" label="图标" align="center" width="80px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" width="100px" label="排序">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="component" label="菜单资源" />

      <el-table-column :show-overflow-tooltip="true" prop="path" label="链接地址" />

      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['SUPER','MENU_ALL','MENU_EDIT']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-popover
            :ref="scope.row.id"
            v-permission="['SUPER','MENU_ALL','MENU_DELETE']"
            placement="top"
            width="200"
          >
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.id)"
              >确定</el-button>
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
import eForm from './form'
import { del } from '@/api/system/menu'
import initData from '@/mixins/initData'
export default {
  components: { treeTable, eForm },
  // 混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
      delLoading: false,
      expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'system/menus/initMenusAll'
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
      this.$refs.form.getMenus()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getMenus()
      _this.form = { id: data.id, component: data.component, menuName: data.name, sort: data.sort, parentId: data.parentId, path: data.path, icon: data.icon }
      _this.dialog = true
    },
    changExpand() {
      this.expand = !this.expand
      this.init()
    }

  }
}
</script>
<style scoped>

</style>
