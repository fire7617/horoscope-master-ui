import request from '@/utils/request'

// 查詢登錄日誌列表
export function list(query) {
  return request({
    url: '/sys_login_info/get_login_info_list',
    method: 'get',
    params: query
  })
}

// 刪除登錄日誌
export function delLogininfor(infoId) {
  return request({
    url: '/sys_login_info/delete_login_info/' + infoId,
    method: 'delete'
  })
}

// 清空登錄日誌
export function cleanLogininfor() {
  return request({
    url: '/sys_login_info/clear_login_info',
    method: 'delete'
  })
}
