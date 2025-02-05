import request from '@/utils/request'

// 獲取路由
export const getRouters = () => {
  return request({
    url: 'sys_menu/getRouters',
    method: 'get'
  })
}