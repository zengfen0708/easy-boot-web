import request from '@/utils/request'

// 获取所有的菜单树
export function getTreeNode() {
  return request({
    url: 'system/menus/build',
    method: 'get'
  })
}
// 获取所有的菜单树
export function getMenusTree() {
  return request({
    url: 'system/menus/tree',
    method: 'get'
  })
}

// 添加菜单
export function add(data) {
  return request({
    url: 'system/menus/save',
    method: 'post',
    data
  })
}

// 删除菜单
export function del(id) {
  return request({
    url: 'system/menus/delete/' + id,
    method: 'post'
  })
}

// 修改菜单
export function edit(data) {
  return request({
    url: 'system/menus/edit',
    method: 'post',
    data
  })
}
