import request from '@/utils/request'

// 查詢圖示列表
export function listDirection(query) {
  return request({
    url: 'sys_question/get_params',
    method: 'get',
    params: {
      ...query,
      type: 'direction'
    }
  }).then(response => {
    // 將 API 回傳的資料進行轉換，確保資料格式一致性
    if (response.success && Array.isArray(response.data)) {
      const list = response.data.map(item => ({
        id: item.id,
        type: 'direction',
        key: item.key,
        value: typeof item.value === 'string' ? JSON.parse(item.value) : item.value,
        en: item.en,
        tw: item.tw
      }));
      
      return {
        rows: list,
        total: list.length
      };
    }
    return {
      rows: [],
      total: 0
    };
  });
}

// 新增圖示
export function addDirection(data) {
  // 組織請求資料格式
  const requestData = {
    type: 'direction',
    key: data.key,
    tw: data.tw,
    en: data.en
  }

  return request({
    url: 'sys_question/create_param', // 更新為正確的 API 端點
    method: 'post',
    data: requestData
  })
}

// 修改圖示
export function updateDirection(data) {
  // 組織請求資料格式
  const requestData = {
    id: data.id,
    type: 'direction',
    key: data.key,
    tw: data.tw,
    en: data.en
  }

  return request({
    url: 'sys_question/update_param', // 更新為正確的 API 端點
    method: 'post',    // 更新為正確的 HTTP 方法
    data: requestData
  })
}

// 刪除圖示
export function delDirection(id) {
  return request({
    url: 'sys_question/delete_param/' + id, // 更新為正確的 API 端點
    method: 'delete'
  })
} 