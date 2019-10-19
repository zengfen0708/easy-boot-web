import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'system/users',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'system/users/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'system/users',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: 'system/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(code, data) {
  return request({
    url: 'system/users/updateEmail/' + code,
    method: 'post',
    data
  })
}

