import request from '@/utils/request'

export function get(dictName) {
  const data = {
    'dictName': dictName
  }
  return request({
    url: 'system/dictDetail/queryDictDetailsInfo',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'system/dictDetail/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'system/dictDetail/delete/' + id,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'system/dictDetail/update',
    method: 'post',
    data
  })
}
