import request from '@/utils/request'

export function getErrDetail(data) {
  return request({
    url: 'system/log/getErrorDetail',
    method: 'post',
    data
  })
}
