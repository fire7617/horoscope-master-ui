import request from '@/utils/request'

// 查詢目錄列表
export function listMenu(query) {
  return request({
    url: 'sys_menu/get_menu_list',
    method: 'get',
    params: query
  })
}

// 查詢目錄詳細
export function getMenu(menuId) {
  return request({
    url: 'sys_menu/get_menu/' + menuId,
    method: 'get'
  })
}

// 查詢目錄下拉樹結構
export function treeselect() {
  return request({
    url: 'sys_menu/select_menu_tree',
    method: 'get'
  })
}

// 根據角色ID查詢目錄下拉樹結構
export function roleMenuTreeselect(roleId) {
  return request({
    url: 'sys_menu/get_menu_list_by_roleId/' + roleId,
    method: 'get'
  })
}

// 新增目錄
export function addMenu(data) {
  return request({
    url: 'sys_menu/update_menu',
    method: 'post',
    data: data
  })
}

// 修改目錄
export function updateMenu(data) {
  return request({
    url: 'sys_menu/update_menu',
    method: 'put',
    data: data
  })
}

// 刪除目錄
export function delMenu(menuId) {
  return request({
    url: 'sys_menu/delete_menu/' + menuId,
    method: 'delete'
  })
}