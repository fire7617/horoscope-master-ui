import request from '@/utils/request'

// 常量配置
export const suggestionConstants = {
  typeOptions: [
    { value: 0, label: "綜合" },
    { value: 1, label: "家庭" },
    { value: 2, label: "愛情" },
    { value: 3, label: "人際" },
    { value: 4, label: "健康" },
    { value: 5, label: "金錢" },
    { value: 6, label: "學事業" },
    { value: 7, label: "旅行" },
    { value: 8, label: "第六感" },
    { value: 9, label: "挑戰" }
  ],
  aiOptions: [
    { value: "0", label: "預設" },
    { value: "1", label: "GoogleMap" },
    { value: "2", label: "Plexity" }
  ],
  defaultForm: {
    id: undefined,
    type: undefined,
    tw: "",
    en: "",
    direction: "",
    ai: "0",
    description: "",
    condition: [
      {
        sex: "",
        work_status: "",
        relationship_status: "",
        blood_type: ""
      }
    ]
  },
  rules: {
    type: [
      { required: true, message: "類型不能為空", trigger: "change" }
    ],
    tw: [
      { required: true, message: "問題(中)不能為空", trigger: "blur" }
    ],
    en: [
      { required: true, message: "問題(英)不能為空", trigger: "blur" }
    ],
    direction: [
      { required: true, message: "ICON不能為空", trigger: "change" }
    ]
  }
}

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
