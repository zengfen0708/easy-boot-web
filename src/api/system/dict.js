import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'system/dict/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'system/dict/delete/' + id,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'system/dict/update',
    method: 'post',
    data
  })
}
