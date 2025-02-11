// 此檔案用來存放建議問題中使用的各項參數定義，便於未來維護與修改
// 前端將根據這些參數來生成下拉選擇選項，並與後端的數據對應

const suggestionConfig = {
  // 星座問題主類型，對應後端定義的數字編碼
  // 注意：此處數字索引與後端 API 回傳的 type 欄位對應
  horoscopeType: {
    0: "General",       // 一般
    1: "Family",        // 家庭
    2: "Love",          // 愛情
    3: "Interpersonal", // 人際
    4: "Health",        // 健康
    5: "Wealth",        // 金錢
    6: "Career",        // 學事業
    7: "Travel",        // 旅行/探索
    8: "Intuition",     // 直覺
    9: "Challenge",     // 挑戰
  },
  // 每種類型的子類選項
  // 依據不同主類型，可進一步細分選項（例如：愛情類可能有單身、暗戀、曖昧等）
  horoscopeTypeOption: {
    0: ['General'],
    1: ['General'],
    2: ['General (一般)', 'Single (單身)', 'Crush (暗戀)', 'Flirting (曖昧)', 'Relationship (戀愛)', 'Married (已婚)', 'Engaged (訂婚)', 'Lovelorn (失戀)'],
    3: ['General'],
    4: ['General'],
    5: ['General', 'Regular Income', 'Irregular Income', 'Regular Investment'],
    6: ['General (一般)', 'Studying (在學)', 'Seeking (求學)', 'Employed (在職)', 'Job Seeking (求職)', 'Change (轉職)', 'Retired (退休)'],
    7: ['General'],
    8: ['General'],
    9: ['General'],
  },
  // 性別選項
  // 用於 condition 設置中的性別篩選，索引值 0 表示女性，1 表示男性
  sex: {
    0: 'Female (女性)',
    1: 'Male (男性)',
  },
  // 血型選項
  // 定義各種血型選項，0 代表「未定義」其餘依序為 A, B, AB, O
  bloodType: {
    0: '未定義',
    1: 'A',
    2: 'B',
    3: 'AB',
    4: 'O',
  },
};

export default suggestionConfig; 