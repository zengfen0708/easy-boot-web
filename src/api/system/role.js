import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'system/role/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'system/role/delete/' + id,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'system/role/update',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: 'system/role/info/' + id,
    method: 'get'
  })
}

// 保存权限菜单
export function saveRoleInfo(data) {
  return request({
    url: 'system/role/saveRoleInfo',
    method: 'post',
    data
  })
}
