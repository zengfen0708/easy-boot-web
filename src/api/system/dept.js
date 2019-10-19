import request from '@/utils/request'

// 树形菜单
export function getDeptsTree() {
  const data = {}
  return request({
    url: 'system/dept/getDeptTree',
    method: 'post',
    data
  })
}

// 加载对应的菜单
export function getDepts(data) {
  return request({
    url: 'system/dept/getDeptTree',
    method: 'post',
    data
  })
}
// 添加部门菜单
export function add(data) {
  return request({
    url: 'system/dept/save',
    method: 'post',
    data
  })
}

// 删除部门菜单
export function del(id) {
  return request({
    url: 'system/dept/delete/' + id,
    method: 'post'
  })
}

// 修改部门菜单
export function edit(data) {
  return request({
    url: 'system/dept/update',
    method: 'post',
    data
  })
}
