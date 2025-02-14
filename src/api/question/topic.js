import request from '@/utils/request'

// 查詢主題問題列表
export function listTopic(query) {
  return request({
    url: '/sys_question/get_topic_list',
    method: 'get',
    params: query
  })
}

// 查詢主題問題詳細
export function getTopic(id) {
  return request({
    url: '/sys_question/get_topic/' + id,
    method: 'get'
  })
}

// 新增主題問題
export function addTopic(data) {
  return request({
    url: '/sys_question/add_topic',
    method: 'post',
    data: data
  })
}

// 修改主題問題
export function updateTopic(data) {
  return request({
    url: '/sys_question/update_topic',
    method: 'put',
    data: data
  })
}

// 刪除主題問題
export function delTopic(id) {
  return request({
    url: '/sys_question/del_topic/' + id,
    method: 'delete'
  })
}

// 測試主題問題
export function testTopic(data) {
  return request({
    url: '/sys_question/test_topic',
    method: 'post',
    data: data
  })
}

// 更新主題問題啟用狀態
export function updateTopicStatus(data) {
  return request({
    url: '/sys_question/enable_topic',
    method: 'post',
    data: data
  })
}

// 獲取主題類型列表
export function getTopicTypeList() {
  return request({
    url: '/sys_question/get_topic_type_list',
    method: 'get'
  })
}

