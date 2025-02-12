import request from '@/utils/request'

// 獲取系統參數
export function getParams(query) {
  return request({
    url: 'sys_question/get_params',
    method: 'get',
    params: query
  })
} 