import request from '@/utils/request'

export function initData(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
