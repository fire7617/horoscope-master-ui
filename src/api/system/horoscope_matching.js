import request from '@/utils/request'

// 查詢運勢結果列表
export function listHoroscope_matching(query) {
  return request({
    url: 'sys_horoscope_matching/get_horoscope_matching_list',
    method: 'get',
    params: query
  })
}


// 查詢運勢結果詳細
export function getHoroscope_matching(horoscopeMatchingId) {
  return request({
    url: 'sys_horoscope_matching/get_horoscope_matching/' + horoscopeMatchingId,
    method: 'get'
  })
}

// 新增運勢結果
export function addHoroscope_matching(data) {
  return request({
    url: 'sys_horoscope_matching/update_horoscope_matching',
    method: 'post',
    data: data
  })
}

// 修改運勢結果
export function updateHoroscope_matching(data) {
  return request({
    url: 'sys_horoscope_matching/update_horoscope_matching',
    method: 'put',
    data: data
  })
}

// 刪除運勢結果
export function delHoroscope_matching(horoscopeMatchingId) {
  return request({
    url: 'sys_horoscope_matching/delete_horoscope_matching/' + horoscopeMatchingId,
    method: 'delete'
  })
}