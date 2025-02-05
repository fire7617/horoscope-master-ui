import request from '@/utils/request'

// 獲取服務信息
export function getServer() {
  return request({
    url: '/monitor/server',
    method: 'get'
  })
}