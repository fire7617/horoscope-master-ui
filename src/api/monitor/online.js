import request from '@/utils/request'

// 查詢在線用戶列表
export function list(query) {
  return request({
    url: '/monitor/online/list',
    method: 'get',
    params: query
  })
}

// 強退用戶
export function forceLogout(tokenId) {
  return request({
    url: '/monitor/online/' + tokenId,
    method: 'delete'
  })
}
