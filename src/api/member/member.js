import request from '@/utils/request'

// 查詢會員列表
export function listMember(query) {
  return request({
    url: 'sys_member/get_member_list',
    method: 'get',
    params: query
  })
}

// 查詢會員詳細
export function getMember(memberId) {
  return request({
    url: 'sys_member/get_member/' + memberId,
    method: 'get'
  })
}

// 新增會員
export function addMember(data) {
  return request({
    url: 'sys_member/update_member',
    method: 'post',
    data: data
  })
}

// 修改會員
export function updateMember(data) {
  return request({
    url: 'sys_member/update_member',
    method: 'put',
    data: data
  })
}

// 刪除會員
export function delMember(memberId) {
  return request({
    url: 'sys_member/delete_member/' + memberId,
    method: 'delete'
  })
}

// VIP延展
export function extendVip(data) {
  return request({
    url: 'sys_member/extend_vip',
    method: 'post',
    data: data
  })
} 