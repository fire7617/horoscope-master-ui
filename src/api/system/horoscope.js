import request from '@/utils/request'

// 查詢運勢結果列表
export function listHoroscope(query) {
  return request({
    url: 'sys_horoscope/get_horoscope_list',
    method: 'get',
    params: query
  })
}


// 查詢運勢結果詳細
export function getHoroscope(horoscopeId) {
  return request({
    url: 'sys_horoscope/get_horoscope/' + horoscopeId,
    method: 'get'
  })
}

// 新增運勢結果
export function addHoroscope(data) {
  return request({
    url: 'sys_horoscope/update_horoscope',
    method: 'post',
    data: data
  })
}

// 修改運勢結果
export function updateHoroscope(data) {
  return request({
    url: 'sys_horoscope/update_horoscope',
    method: 'put',
    data: data
  })
}

// 刪除運勢結果
export function delHoroscope(horoscopeId) {
  return request({
    url: 'sys_horoscope/delete_horoscope/' + horoscopeId,
    method: 'delete'
  })
}