import request from '@/utils/request'

// 查詢列表
export function listTopic(query) {
  return request({
    url: 'sys_question/get_topic_list',
    method: 'get',
    params: query
  })
}

// 查詢詳細
export function getTopic(id) {
  return request({
    url: 'sys_question/get_topic/' + memberId,
    method: 'get'
  })
}

// 新增
export function addTopic(data) {
  return request({
    url: 'sys_question/update_topic',
    method: 'post',
    data: data
  })
}

// 修改
export function updateTopic(data) {
  return request({
    url: 'sys_question/update_topic',
    method: 'put',
    data: data
  })
}

// 刪除
export function delTopic(id) {
  return request({
    url: 'sys_question/delete_topic/' + memberId,
    method: 'delete'
  })
}
