import request from '@/utils/request'

// 获取所有的权限树
export function getPermissionTree() {
  const data = {}
  return request({
    url: 'system/permissions/treeBulid',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'system/permissions/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'system/permissions/delete/' + id,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'system/permissions/update',
    method: 'post',
    data
  })
}
