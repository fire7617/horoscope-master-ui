import request from '@/utils/request'

// 查詢解答列表
export function listFactor(query) {
  return request({
    url: 'sys_factor/get_factor_list',
    method: 'get',
    params: query
  })
}


// 查詢解答詳細
export function getFactor(factorId) {
  return request({
    url: 'sys_factor/get_factor/' + factorId,
    method: 'get'
  })
}

// 新增解答
export function addFactor(data) {
  return request({
    url: 'sys_factor/update_factor',
    method: 'post',
    data: data
  })
}

// 修改解答
export function updateFactor(data) {
  return request({
    url: 'sys_factor/update_factor',
    method: 'put',
    data: data
  })
}

// 刪除解答
export function delFactor(factorId) {
  return request({
    url: 'sys_factor/delete_factor/' + factorId,
    method: 'delete'
  })
}