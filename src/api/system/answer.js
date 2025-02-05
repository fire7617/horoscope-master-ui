import request from '@/utils/request'

// 查詢解答列表
export function listAnswer(query) {
  return request({
    url: 'sys_answer/get_answer_list',
    method: 'get',
    params: query
  })
}


// 查詢解答詳細
export function getAnswer(answerId) {
  return request({
    url: 'sys_answer/get_answer/' + answerId,
    method: 'get'
  })
}

// 新增解答
export function addAnswer(data) {
  return request({
    url: 'sys_answer/update_answer',
    method: 'post',
    data: data
  })
}

// 修改解答
export function updateAnswer(data) {
  return request({
    url: 'sys_answer/update_answer',
    method: 'put',
    data: data
  })
}

// 刪除解答
export function delAnswer(answerId) {
  return request({
    url: 'sys_answer/delete_answer/' + answerId,
    method: 'delete'
  })
}