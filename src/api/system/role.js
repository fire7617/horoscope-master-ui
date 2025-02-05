import request from '@/utils/request'

// 查詢角色列表
export function listRole(query) {
  return request({
    url: 'sys_role/get_role_list',
    method: 'get',
    params: query
  })
}

// 查詢角色詳細
export function getRole(roleId) {
  return request({
    url: 'sys_role/get_role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: 'sys_role/update_role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: 'sys_role/update_role',
    method: 'put',
    data: data
  })
}

// 角色數據權限
export function dataScope(data) {
  return request({
    url: 'sys_role/update_role_data_scope',
    method: 'put',
    data: data
  })
}

// 角色狀態修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: 'sys_role/update_role_status',
    method: 'put',
    data: data
  })
}

// 刪除角色
export function delRole(roleId) {
  return request({
    url: 'sys_role/delete_role/' + roleId,
    method: 'delete'
  })
}

// 查詢角色已授權用戶列表
export function allocatedUserList(query) {
  return request({
    url: 'sys_role/get_allocated_user_list',
    method: 'get',
    params: query
  })
}

// 查詢角色未授權用戶列表
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用戶授權角色
export function authUserCancel(data) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用戶授權角色
export function authUserCancelAll(data) {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授權用戶選擇
export function authUserSelectAll(data) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}