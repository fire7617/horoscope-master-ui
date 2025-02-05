import request from '@/utils/request'

// 查詢字典數據列表
export function listData(query) {
  return request({
    url: 'sys_dict_type/get_dict_data_list',
    method: 'get',
    params: query
  })
}

// 查詢字典數據詳細
export function getData(dictCode) {
  return request({
    url: 'sys_dict_type/get_dict_data/' + dictCode,
    method: 'get'
  })
}

// 根據字典類型查詢字典數據信息
export function getDicts(dictType) {
  return request({
    url: 'sys_dict_type/get_dict_data_by_type/' + dictType,
    method: 'get'
  })
}

// 新增字典數據
export function addData(data) {
  return request({
    url: 'sys_dict_type/update_dict_data',
    method: 'post',
    data: data
  })
}

// 修改字典數據
export function updateData(data) {
  return request({
    url: 'sys_dict_type/update_dict_data',
    method: 'put',
    data: data
  })
}

// 刪除字典數據
export function delData(dictCode) {
  return request({
    url: 'sys_dict_type/delete_dict_data/' + dictCode,
    method: 'delete'
  })
}
