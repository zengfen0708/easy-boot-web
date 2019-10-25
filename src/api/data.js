import request from '@/utils/request'

export function initData(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 导出excel
export function exportData(url, data) {
  return request({
    url: url,
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 下载文件
export function downloadFile(params) {
  return request({
    url: '/common/sysFile/download',
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}

// 下载异常excel文件
export function downloadErrorFile(data) {
  return request({
    url: '/common/sysFile/downloadError',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
