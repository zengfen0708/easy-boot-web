import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'system/job/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'system/job/delete/' + id,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'system/job/update',
    method: 'post',
    data
  })
}
