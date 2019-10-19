import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function getCodeImg() {
  return request({
    url: 'auth/authCode',
    method: 'get'
  })
}

// 拉取用户角色
export function getInfo() {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
