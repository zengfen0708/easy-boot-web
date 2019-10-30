import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'system/user/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'system/user/delete/' + id,
    method: 'post'
  })
}

export function edit(data) {
  return request({
    url: 'system/user/update',
    method: 'post',
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

