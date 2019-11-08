import request from '@/utils/request'

/**
 * 增加测试表
 * @param query 分页查询条件
 */
export function add(data) {
  return request({
    url: '/work/test/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 * @param id
 */
export function del(id) {
  return request({
    url: '/work/test/delete/' + id,
    method: 'post'
  })
}

/**
 * 修改
 * @param data
 */
export function edit(data) {
  return request({
    url: 'work/test/update',
    method: 'post',
    data
  })
}
