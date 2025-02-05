import request from '@/utils/request'

// 查詢參數列表
export function listConfig(query) {
  return request({
    url: '/sys_config/get_config_list',
    method: 'get',
    params: query
  })
}

// 查詢參數詳細
export function getConfig(configId) {
  return request({
    url: '/sys_config/get_config/' + configId,
    method: 'get'
  })
}

// 根據參數鍵名查詢參數值
export function getConfigKey(configKey) {
  return request({
    url: '/sys_config/get_config_by_key/' + configKey,
    method: 'get'
  })
}

// 新增參數配置
export function addConfig(data) {
  return request({
    url: '/sys_config/update_config',
    method: 'post',
    data: data
  })
}

// 修改參數配置
export function updateConfig(data) {
  return request({
    url: '/sys_config/update_config',
    method: 'put',
    data: data
  })
}

// 刪除參數配置
export function delConfig(configId) {
  return request({
    url: '/sys_config/delete_config/' + configId,
    method: 'delete'
  })
}

// 刷新參數緩存
export function refreshCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete'
  })
}
