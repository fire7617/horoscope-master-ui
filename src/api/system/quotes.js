import request from '@/utils/request'

// 查詢語錄列表
export function listQuotes(query) {
  return request({
    url: 'sys_quotes/get_quotes_list',
    method: 'get',
    params: query
  })
}


// 查詢語錄詳細
export function getQuotes(quotesId) {
  return request({
    url: 'sys_quotes/get_quotes/' + quotesId,
    method: 'get'
  })
}

// 新增語錄
export function addQuotes(data) {
  return request({
    url: 'sys_quotes/update_quotes',
    method: 'post',
    data: data
  })
}

// 修改語錄
export function updateQuotes(data) {
  return request({
    url: 'sys_quotes/update_quotes',
    method: 'put',
    data: data
  })
}

// 刪除語錄
export function delQuotes(quotesId) {
  return request({
    url: 'sys_quotes/delete_quotes/' + quotesId,
    method: 'delete'
  })
}