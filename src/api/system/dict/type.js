import request from '@/utils/request'

// 查詢字典類型列表
export function listType(query) {
  return request({
    url: 'sys_dict_type/get_dict_list',
    method: 'get',
    params: query
  })
}

// 查詢字典類型詳細
export function getType(dictId) {
  return request({
    url: 'sys_dict_type/get_dict_type/' + dictId,
    method: 'get'
  })
}

// 新增字典類型
export function addType(data) {
  return request({
    url: 'sys_dict_type/update_dict_type',
    method: 'post',
    data: data
  })
}

// 修改字典類型
export function updateType(data) {
  return request({
    url: 'sys_dict_type/update_dict_type',
    method: 'put',
    data: data
  })
}

// 刪除字典類型
export function delType(dictId) {
  return request({
    url: 'sys_dict_type/delete_dict_type/' + dictId,
    method: 'delete'
  })
}

// 刷新字典緩存
export function refreshCache() {
  return request({
    url: '/system/dict/type/refreshCache',
    method: 'delete'
  })
}

// 獲取字典選擇框列表
export function optionselect() {
  return request({
    url: 'sys_dict_type/get_dict_list',
    method: 'get'
  })
}