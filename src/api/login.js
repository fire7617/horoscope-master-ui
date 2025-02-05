import request from '@/utils/request'

// 登錄方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/api/sys_user/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 註冊方法
export function register(data) {
  return request({
    url: '/api/sys_user/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 獲取用戶詳細信息
export function getInfo() {
  return request({
    url: '/api/sys_user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/api/sys_user/logout',
    method: 'post'
  })
}

// 獲取驗證碼
export function getCodeImg() {
  return request({
    url: '/admin_captcha',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 獲取短信驗證碼
export function getSmsCode(mobile, type, tokeen) {
  const data = {
    type,
    mobile,
    tokeen
  }
  return request({
    url: 'sys_user/get_reg_sms_code',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
