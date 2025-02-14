<template>
  <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
    <!-- 類型選擇 -->
    <el-form-item label="類型" prop="type">
      <el-select v-model="formData.type" placeholder="請選擇類型" style="width: 100%">
        <el-option 
          v-for="item in typeOptions" 
          :key="getTypeKey(item)"
          :label="getTypeLabel(item)"
          :value="getTypeValue(item)"
        />
      </el-select>
    </el-form-item>

    <!-- 問題輸入區域 -->
    <el-form-item label="問題" required>
      <!-- 中文問題 -->
      <el-form-item prop="tw" class="no-margin">
        <div class="input-with-label">
          <span class="input-label">中文</span>
          <el-input 
            v-model="formData.tw" 
            placeholder="請輸入中文問題"
            class="custom-input"
          />
        </div>
      </el-form-item>
      
      <div class="divider"></div>
      
      <!-- 英文問題 -->
      <el-form-item prop="en" class="no-margin">
        <div class="input-with-label">
          <span class="input-label">英文</span>
          <el-input 
            v-model="formData.en" 
            placeholder="請輸入英文問題"
            class="custom-input"
          />
        </div>
      </el-form-item>
    </el-form-item>

    <!-- ICON 選擇 -->
    <el-form-item label="ICON" prop="direction" :required="isSuggestion">
      <div style="display: flex; align-items: center; gap: 15px;">
        <el-select 
          v-model="formData.direction" 
          placeholder="請選擇圖示"
          filterable
          style="width: 300px;"
          clearable
        >
          <el-option
            v-for="item in directionOptions"
            :key="`direction_${item.key}`"
            :label="`${item.en}（${item.tw}）`"
            :value="item.key"
          >
            <div style="display: flex; align-items: center;">
              <el-image 
                style="width: 20px; height: 20px; margin-right: 10px;"
                :src="getImageUrl(item.key)"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <span>{{ item.en }}（{{ item.tw }}）</span>
            </div>
          </el-option>
        </el-select>

        <!-- 預覽圖標 -->
        <el-image 
          v-if="formData.direction"
          style="width: 40px; height: 40px;"
          :src="getImageUrl(formData.direction)"
          :preview-src-list="[getImageUrl(formData.direction)]"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </el-form-item>

    <!-- AI 選擇 -->
    <el-form-item label="AI" prop="ai" @change="handleAIChange">
      <el-select v-model="formData.ai" style="width: 100%">
        <el-option label="ChatGPT" value="0"></el-option>
        <el-option label="Gemini" value="1"></el-option>
      </el-select>
    </el-form-item>

    <!-- 搜尋詞 (僅在選擇 Gemini 時顯示) -->
    <el-form-item 
      v-if="formData.ai === '1'" 
      label="搜尋詞" 
      prop="search_keyword"
      :rules="[
        { required: true, message: '請輸入搜尋關鍵字', trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="formData.search_keyword"
        placeholder="請輸入 Google Map 搜尋關鍵字"
      />
    </el-form-item>

    <!-- 提示詞輸入 -->
    <el-form-item label="提示詞" prop="description">
      <el-input
        type="textarea"
        v-model="formData.description"
        :rows="3"
        placeholder="請輸入提示詞"
      />
    </el-form-item>

    <!-- 限制條件設置 -->
    <el-form-item label="限制條件">
      <div v-for="(cond, index) in formData.condition" :key="index" style="margin-bottom: 10px;">
        <el-row :gutter="10">
          <el-col :span="5">
            <el-select v-model="cond.sex" placeholder="性別" style="width: 100%">
              <el-option label="不限" value="-1"></el-option>
              <el-option label="女性" value="0"></el-option>
              <el-option label="男性" value="1"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="cond.work_status" placeholder="學事業狀態" style="width: 100%">
              <el-option label="不限" value="-1"></el-option>
              <el-option v-for="(label, value) in workStatusOptions" 
                :key="value" 
                :label="label" 
                :value="value" 
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="cond.relationship_status" placeholder="感情狀態" style="width: 100%">
              <el-option label="不限" value="-1"></el-option>
              <el-option v-for="(label, value) in relationshipOptions" 
                :key="value" 
                :label="label" 
                :value="value" 
              />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="cond.blood_type" placeholder="血型" style="width: 100%">
              <el-option label="不限" value="-1"></el-option>
              <el-option v-for="(label, value) in bloodTypeOptions" 
                :key="value" 
                :label="label" 
                :value="value" 
              />
            </el-select>
          </el-col>
          <el-col :span="2" v-if="index > 0">
            <el-button type="danger" icon="el-icon-delete" circle @click="removeCondition(index)"></el-button>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addCondition">新增條件</el-button>
    </el-form-item>

    <!-- 狀態開關 -->
    <el-form-item label="狀態" prop="is_enabled">
      <el-switch
        v-model="formData.is_enabled"
        :active-value="1"
        :inactive-value="0"
        active-text="啟用"
        inactive-text="停用"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </el-form-item>

    <!-- 測試區域 -->
    <el-form-item label="文案測試">
      <div class="test-section">
        <div class="test-button-wrapper">
          <el-button 
            type="warning"
            :loading="isGenerating"
            @click="handleTestClick"
            class="test-button"
          >
            {{ isGenerating ? '生成中...' : '立即測試' }}
          </el-button>
        </div>

        <!-- 測試結果顯示區域 -->
        <transition name="fade">
          <div v-if="showTestResult">
            <el-input
              type="textarea"
              v-model="testResult"
              :rows="6"
              placeholder="測試結果將顯示在這裡..."
              readonly
              resize="both"
              class="custom-textarea"
            />
          </div>
        </transition>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import suggestionConfigData from '@/config/suggestionConfig';

export default {
  name: 'QuestionForm',
  
  // 組件接收的屬性定義
  props: {
    // 表單數據
    value: {
      type: Object,
      default: () => ({})
    },
    // 類型選項
    typeOptions: {
      type: Array,
      default: () => []
    },
    // 是否為建議問題模式
    isSuggestion: {
      type: Boolean,
      default: false
    },
    // 方位選項（用於 ICON 選擇）
    directionOptions: {
      type: Array,
      default: () => []
    },
    // 測試結果
    testResult: {
      type: String,
      default: ''
    },
    // 頁面類型（topic 或 suggestion）
    pageType: {
      type: String,
      default: 'topic',
      validator: value => ['topic', 'suggestion'].includes(value)
    }
  },

  // 組件內部狀態
  data() {
    return {
      // 使用函數返回初始狀態
      formData: this.getInitialFormData(),
      // 各種選項數據
      workStatusOptions: suggestionConfigData.workStatusOptions || {},
      relationshipOptions: suggestionConfigData.relationshipOptions || {},
      bloodTypeOptions: suggestionConfigData.bloodType || {},
      // 生成狀態標記
      isGenerating: false,
      // 是否顯示測試結果
      showTestResult: false
    };
  },

  // 計算屬性
  computed: {
    // 表單驗證規則
    rules() {
      return {
        type: [
          { 
            required: true, 
            message: '請選擇類型', 
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.$refs.form && !value) {
                callback(new Error('請選擇類型'));
              } else {
                callback();
              }
            }
          }
        ],
        tw: [
          { required: true, message: '請輸入中文問題', trigger: 'blur' }
        ],
        en: [
          { required: true, message: '請輸入英文問題', trigger: 'blur' }
        ],
        direction: [
          { 
            required: this.isSuggestion,  // 只有建議問題時才是必填
            message: '請選擇圖示', 
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.isSuggestion && this.$refs.form && !value) {
                callback(new Error('請選擇圖示'));
              } else {
                callback();
              }
            }
          }
        ]
      };
    }
  },

  // 監聽器
  watch: {
    // 修改：監聽外部數據變化
    value: {
      handler(newVal) {
        if (newVal) {
          // 合併初始數據和新值
          const mergedData = {
            ...this.getInitialFormData(),
            ...newVal
          };
          
          // 使用 Object.assign 來避免響應式問題
          Object.assign(this.formData, mergedData);
        }
      },
      immediate: true,
      deep: true
    },
    // 將內部數據變化同步到外部
    formData: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true
    },
    // 監聽測試結果變化
    testResult: {
      immediate: true,
      handler(newVal) {
        if (newVal !== undefined && newVal !== null) {
          this.showTestResult = true;
          this.isGenerating = newVal === "生成中...";
        }
      }
    }
  },

  // 生命週期鉤子
  created() {
    // 確保 formData 初始化
    if (!this.formData) {
      this.formData = {};
    }
  },

  // 方法定義
  methods: {
    handleAIChange(value) {
      if (value !== "1") {
        this.formData.search_keyword = "";
      }
    },
    addCondition() {
      this.formData.condition.push({
        sex: "-1",
        work_status: "-1",
        relationship_status: "-1",
        blood_type: "-1"
      });
    },
    removeCondition(index) {
      this.formData.condition.splice(index, 1);
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
        });
      });
    },
    // 修改：重置方法
    resetFields() {
      const initialData = this.getInitialFormData();
      
      // 合併初始數據和外部值
      this.formData = {
        ...initialData,
        ...this.value
      };

      this.isGenerating = false;
      this.showTestResult = false;
      
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },
    getImageUrl(key) {
      if (!key) return '';
      const baseUrl = (process.env.VUE_APP_API_URL || window.location.origin).replace(/\/$/, '');
      return `${baseUrl}/icon/${key}.png`;
    },
    handleTestClick() {
      this.showTestResult = true;
      this.isGenerating = true;
      this.$emit('test');
    },
    getTypeKey(item) {
      return this.pageType === 'topic' ? item.type : item.value;
    },
    getTypeLabel(item) {
      return this.pageType === 'topic' ? item.tw : item.label;
    },
    getTypeValue(item) {
      return this.pageType === 'topic' ? item.type : item.value;
    },
    // 新增：獲取初始表單數據的方法
    getInitialFormData() {
      return {
        type: '',
        tw: '',
        en: '',
        direction: '',
        ai: '0',
        description: '',
        search_keyword: '',
        is_enabled: 1,
        condition: [{
          sex: "-1",
          work_status: "-1",
          relationship_status: "-1",
          blood_type: "-1"
        }]
      };
    },
    // 修改：處理 direction 變更的方法
    handleDirectionChange(value) {
      console.log('direction selected:', value);
      
      // 創建新的表單數據對象
      const newFormData = {
        ...this.formData,
        direction: value
      };

      // 更新本地數據
      this.formData = newFormData;

      // 通知父組件
      this.$nextTick(() => {
        this.$emit('input', newFormData);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.no-margin {
  margin-bottom: 0;
}

.input-with-label {
  display: flex;
  align-items: center;
  margin-bottom: 15px;  // 添加下方間距
  
  .input-label {
    min-width: 40px;
    margin-right: 8px;
    text-align: right;
    color: #606266;
  }
  
  .custom-input {
    flex: 1;
  }
}

.divider {
  height: 1px;
  background-color: #DCDFE6;
  margin: 15px 0;  // 上下間距
  opacity: 0.5;    // 降低透明度使其更柔和
}

// 確保輸入框高度一致
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

// 移除最後一個輸入框的底部間距
.input-with-label:last-child {
  margin-bottom: 0;
}

// 統一文本域樣式
.custom-textarea {
  ::v-deep .el-textarea__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    padding: 12px;
    
    &:hover {
      border-color: #c0c4cc;
    }
    
    &:focus {
      border-color: #409eff;
    }

    &[readonly] {
      cursor: default;
      
      &:hover, &:focus {
        border-color: #e4e7ed;
      }
    }
  }
}

// 測試按鈕樣式
.test-button-wrapper {
  margin-bottom: 15px;
}

.test-button {
  width: 120px;
  margin-bottom: 15px;
  
  &.is-loading {
    background-color: #ffc833;
    border-color: #ffc833;
    opacity: 0.8;
  }
}

// 淡入淡出動畫
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 