<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.roleName" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['SUPER','ROLES_CREATE']" style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
            <div id="opt" style="float: right">
              <el-radio-group v-model="opt" size="mini">
                <el-radio-button label="菜单分配" />
                <el-radio-button label="权限分配" />
              </el-radio-group>
            </div>
          </div>
          <el-table v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column prop="roleName" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="roleDesc" label="描述" />
            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkPermission(['SUPER','ROLES_EDIT','ROLES_DELETE'])" label="操作" width="130px" align="center">
              <template slot-scope="scope">
                <el-button v-permission="['SUPER','ROLES_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
                <el-popover
                  :ref="scope.row.id"
                  v-permission="['SUPER','ROLES_DELETE']"
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
        </el-card>
      </el-col>
      <!-- 授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card v-show="opt === '菜单分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['SUPER','ROLES_SAVE']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
        <el-card v-show="opt === '权限分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配权限" placement="top">
              <span class="role-span">权限分配</span>
            </el-tooltip>
            <el-button
              v-permission="['SUPER','ROLES_SAVE']"
              :disabled="!showButton"
              :loading="permissionLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="savePermission"
            >保存</el-button>
          </div>
          <el-tree
            ref="permission"
            :data="permissions"
            :default-checked-keys="permissionIds"
            :props="defaultProps"
            show-checkbox
            accordion
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import initData from '@/mixins/initData'
import { getPermissionTree } from '@/api/system/permission'
import { getMenusTree } from '@/api/system/menu'
import eForm from './form'
import { saveRoleInfo, get, del } from '@/api/system/role'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentId: 0, permissionLoading: false, menuLoading: false, showButton: false, opt: '菜单分配',
      delLoading: false, permissions: [], permissionIds: [], menus: [], menuIds: []
    }
  },
  created() {
    this.getPermissions()
    this.getMenus()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.$refs.permission.setCheckedKeys([])
      this.$refs.menu.setCheckedKeys([])
      this.showButton = false
      this.url = 'system/role/list'
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
    getPermissions() {
      getPermissionTree().then(res => {
        this.permissions = res.data
      })
    },
    getMenus() {
      getMenusTree().then(res => {
        this.menus = res.data
      })
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空权限与菜单的选中
        this.$refs.permission.setCheckedKeys([])
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        this.permissionIds = []
        // 菜单数据需要特殊处理
        val.menuList.forEach(function(data, index) {
          let add = true
          for (let i = 0; i < val.menuList.length; i++) {
            if (data.id === val.menuList[i].parentId) {
              add = false
              break
            }
          }
          if (add) {
            _this.menuIds.push(data.id)
          }
        })

        // 处理权限数据
        val.permissionList.forEach(function(data, index) {
          _this.permissionIds.push(data.id)
        })
      }
    },
    savePermission() {
      this.permissionLoading = true
      const role = { roleId: this.currentId, permissions: [], typeId: 2 }
      this.$refs.permission.getCheckedKeys().forEach(function(data, index) {
        const permission = data
        role.permissions.push(permission)
      })
      saveRoleInfo(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.permissionLoading = false
        this.update()
      }).catch(err => {
        this.permissionLoading = false
        console.log(err.response.message)
      })
    },
    saveMenu() {
      this.menuLoading = true
      const role = { roleId: this.currentId, menus: [], typeId: 1 }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const permission = data.id
        role.menus.push(permission)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const permission = data
        role.menus.push(permission)
      })
      saveRoleInfo(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.message)
      })
    },
    update() {
      const _this = this
      _this.showButton = false
      get(this.currentId).then(res => {
        for (let i = 0; i < _this.data.length; i++) {
          if (res.data.id === _this.data[i].id) {
            _this.data[i] = res.data
            break
          }
        }
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.deptIds = []
      _this.form = { id: data.id, roleName: data.roleName, roleDesc: data.roleDesc }
      _this.dialog = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>
