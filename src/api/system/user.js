import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查詢用戶列表
export function listUser(query) {
  return request({
    url: 'sys_user/get_sys_user_list',
    method: 'get',
    params: query
  })
}

// 查詢用戶詳細
export function getUser(userId) {
  return request({
    url: 'sys_user/get_sys_user_info/' + userId,
    method: 'get'
  })
}

// 新增用戶
export function addUser(data) {
  return request({
    url: 'sys_user/update_sys_user',
    method: 'post',
    data: data
  })
}

// 修改用戶
export function updateUser(data) {
  return request({
    url: 'sys_user/update_sys_user',
    method: 'put',
    data: data
  })
}

// 刪除用戶
export function delUser(userId) {
  return request({
    url: 'sys_user/delete_sys_user/' + userId,
    method: 'delete'
  })
}

// 用戶密碼重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: 'sys_user/reset_user_password',
    method: 'put',
    data: data
  })
}
// 用戶密碼重置
export function resetSelfPwd(password) {
  const data = {
    password
  }
  return request({
    url: 'sys_user/reset_self_password',
    method: 'put',
    data: data
  })
}

// 用戶狀態修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: 'sys_user/update_user_status',
    method: 'put',
    data: data
  })
}

// 查詢用戶個人信息
export function getUserProfile() {
  return request({
    url: 'sys_user/get_profile_info',
    method: 'get'
  })
}

// 修改用戶個人信息
export function updateUserProfile(data) {
  return request({
    url: 'sys_user/update_profile_info',
    method: 'put',
    data: data
  })
}

// 用戶密碼重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: 'sys_user/update_profile_password',
    method: 'put',
    data: data
  })
}

// 用戶頭像上傳
export function uploadAvatar(data) {
  return request({
    url: 'upload/upload_avatar',
    method: 'post',
    data: data
  })
}

// 查詢授權角色
export function getAuthRole(userId) {
  return request({
    url: 'sys_user/get_user_role/' + userId,
    method: 'get'
  })
}

// 保存授權角色
export function updateAuthRole(data) {
  return request({
    url: 'sys_user/update_user_role',
    method: 'put',
    params: data
  })
}

