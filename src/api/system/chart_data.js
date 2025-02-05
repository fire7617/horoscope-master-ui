import request from '@/utils/request'

// 查詢運勢結果列表
export function listChart_data(query) {
  return request({
    url: 'sys_chart_data/get_chart_data_list',
    method: 'get',
    params: query
  })
}


// 查詢運勢結果詳細
export function getChart_data(chart_dataId) {
  return request({
    url: 'sys_chart_data/get_chart_data/' + chart_dataId,
    method: 'get'
  })
}

// 新增運勢結果
export function addChart_data(data) {
  return request({
    url: 'sys_chart_data/update_chart_data',
    method: 'post',
    data: data
  })
}

// 修改運勢結果
export function updateChart_data(data) {
  return request({
    url: 'sys_chart_data/update_chart_data',
    method: 'put',
    data: data
  })
}

// 刪除運勢結果
export function delChart_data(chart_dataId) {
  return request({
    url: 'sys_chart_data/delete_chart_data/' + chart_dataId,
    method: 'delete'
  })
}