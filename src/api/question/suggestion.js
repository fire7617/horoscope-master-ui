import request from '@/utils/request'

// 查詢列表
export function listSuggestion(query) {
  return request({
    url: 'sys_question/get_suggestion_list',
    method: 'get',
    params: query
  })
}

// 查詢詳細
export function getSuggestion(id) {
  return request({
    url: 'sys_question/get_suggestion/' + id,
    method: 'get'
  })
}

// 新增
export function addSuggestion(data) {
  return request({
    url: 'sys_question/update_suggestion',
    method: 'post',
    data: data
  })
}

// 修改
export function updateSuggestion(data) {
  return request({
    url: 'sys_question/update_suggestion',
    method: 'put',
    data: data
  })
}

// Test
export function testSuggestion(data) {
  return request({
    url: 'sys_question/test_suggestion',
    method: 'post',
    data: data
  })
}

// 刪除
export function delSuggestion(id) {
  return request({
    url: 'sys_question/delete_suggestion/' + id,
    method: 'delete'
  })
}
