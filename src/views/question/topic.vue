<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="類型" prop="type">
        <el-select v-model="queryParams.type" placeholder="請選擇類型" clearable>
          <el-option 
            v-for="item in typeOption" 
            :key="item.type"
            :label="item.tw"
            :value="item.type"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="AI" prop="ai">
        <el-select v-model="queryParams.ai" placeholder="請選擇 AI" clearable>
          <el-option label="ChatGPT" value="0"></el-option>
          <el-option label="Gemini" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="狀態" prop="is_enabled">
        <el-select v-model="queryParams.is_enabled" placeholder="請選擇狀態" clearable>
          <el-option label="啟用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="關鍵字" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="請輸入問題關鍵字" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button 
          type="primary" 
          plain 
          icon="el-icon-plus" 
          size="mini" 
          @click="handleAdd"
          v-hasPermi="['system:topic:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" width="80" />
      
      <el-table-column label="類型" align="center" prop="type" width="100">
        <template slot-scope="scope">
          <span>{{ getTypeLabel(scope.row.type) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="ICON" align="center" prop="direction" width="240">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <span>{{ getDirectionLabel(scope.row.direction) }}</span>
            <el-image 
              style="width: 30px; height: 30px; margin-top: 5px;"
              :src="getImageUrl(scope.row.direction)"
              :preview-src-list="[getImageUrl(scope.row.direction)]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="問題(中)" align="left" prop="tw" min-width="180" />
      <el-table-column label="問題(英)" align="left" prop="en" min-width="180" />

      <el-table-column label="提示詞" align="left" prop="description" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <!-- 提示詞內容 -->
            <span v-if="scope.row.description">{{ scope.row.description }}</span>
            <span v-else>-</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="限制條件" align="center" width="180">
        <template slot-scope="scope">
          <template v-if="hasValidConditions(scope.row.condition)">
            <div v-for="(cond, index) in scope.row.condition" :key="index" style="margin-bottom: 5px;">
              <!-- 性別 -->
              <el-tag 
                v-if="cond.sex !== ''" 
                size="mini" 
                type="info"
                style="margin-right: 5px;"
              >
                {{ cond.sex === -1 ? '性別不限' : sexOptions[cond.sex] }}
              </el-tag>
              <!-- 學事業狀態 -->
              <el-tag 
                v-if="cond.work_status !== ''" 
                size="mini" 
                type="success"
                style="margin-right: 5px;"
              >
                {{ cond.work_status === -1 ? '學事業不限' : workStatusOptions[cond.work_status] }}
              </el-tag>
              <!-- 感情狀態 -->
              <el-tag 
                v-if="cond.relationship_status !== ''" 
                size="mini" 
                type="warning"
                style="margin-right: 5px;"
              >
                {{ cond.relationship_status === -1 ? '感情不限' : relationshipOptions[cond.relationship_status] }}
              </el-tag>
              <!-- 血型 -->
              <el-tag 
                v-if="cond.blood_type !== ''" 
                size="mini" 
                type="danger"
                style="margin-right: 5px;"
              >
                {{ cond.blood_type === -1 ? '血型不限' : bloodTypeOptions[cond.blood_type] }}
              </el-tag>
            </div>
          </template>
          <span v-else>無限制條件</span>
        </template>
      </el-table-column>

      <el-table-column label="AI/關鍵字" align="center" width="200">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <!-- AI 類型 -->
            <el-tag 
              size="mini" 
              :type="scope.row.ai === 0 ? 'success' : 'warning'"
              :class="[
                'custom-tag',
                scope.row.ai === 0 ? 'custom-tag--chatgpt' : 'custom-tag--gemini'
              ]"
            >
              {{ getAILabel(scope.row.ai) }}
            </el-tag>
            <!-- 關鍵字 -->
            <span v-if="scope.row.search_keyword" class="keyword" style="margin-top: 5px;">
              <el-tag size="mini" type="info">{{ scope.row.search_keyword }}</el-tag>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="狀態" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_enabled"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-edit" 
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:topic:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-delete" 
            class="delete-btn"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:topic:remove']"
          >刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body @close="cancel">
      <question-form
        ref="questionForm"
        v-model="form"
        :type-options="typeOption"
        :direction-options="directionOptions"
        :is-suggestion="false"
        :test-result="testResult"
        page-type="topic"
        @test="handleTest"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { 
  listTopic, 
  getTopic, 
  delTopic, 
  addTopic, 
  updateTopic, 
  testTopic, 
  updateTopicStatus,
  getTopicTypeList 
} from "@/api/question/topic";
import { getParams } from "@/api/system/params";
import QuestionForm from '@/components/Question/QuestionForm';

export default {
  name: "Topic",
  dicts: ['sys_normal_disable'],
  components: {
    QuestionForm
  },
  data() {
    return {
      activeName: 'en',
      // 遮罩層
      loading: true,
      // 總條數
      total: 0,
      // 結果表格數據
      list: [],
      // 彈出層標題
      title: "",
      // 是否顯示彈出層
      open: false,
      // 查詢參數
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        type: undefined,
        ai: undefined,
        is_enabled: undefined,
        keyword: undefined
      },
      // 修改為空數組，等待 API 數據
      typeOption: [],
      // 表單參數
      form: {
        id: undefined,
        type: undefined,
        tw: "",
        en: "",
        description: "",
        direction: "",
        ai: "0",
        search_keyword: "",
        is_enabled: 1
      },
      // 添加選項數據
      sexOptions: {
        0: '女性',
        1: '男性'
      },
      workStatusOptions: {
        0: '在學',
        1: '求學',
        2: '在職',
        3: '求職',
        4: '轉職',
        5: '退休'
      },
      relationshipOptions: {
        0: '單身',
        1: '暗戀',
        2: '曖昧',
        3: '戀愛',
        4: '已婚',
        5: '訂婚',
        6: '失戀'
      },
      bloodTypeOptions: {
        1: 'A',
        2: 'B',
        3: 'AB',
        4: 'O'
      },
      // 添加 showSearch 屬性並設置默認值
      showSearch: true,  // 或者 false，根據您的需求設置
      directionMap: new Map(),  // 添加方位映射
      directionImageMap: new Map(),  // 添加圖片映射
      // 添加 AI 選項映射
      aiOptions: [
        { value: "0", label: "ChatGPT" },
        { value: "1", label: "Gemini" }
      ],
      testResult: "",  // 添加測試結果狀態
      directionOptions: [],  // 添加方位選項數組
      typeMap: new Map(), // 添加類型映射
    };
  },
  created() {
    this.getTypeOptions();
    this.getList();
    this.getDirectionOptions();
  },
  methods: {
    // 修改獲取類型選項的方法
    getTypeOptions() {
      return getTopicTypeList().then(response => {
        if (response.code === 200 && response.data) {
          // 直接使用 API 返回的數據
          this.typeOption = response.data.map(item => ({
            ...item,
            type: String(item.type)  // 確保 type 是字符串
          }));
          
          // 建立類型映射 (使用 type 作為 key)
          this.typeMap = new Map(
            this.typeOption.map(item => [item.type, item])
          );
        }
      });
    },

    // 修改獲取類型標籤的方法
    getTypeLabel(type) {
      const typeItem = this.typeMap.get(String(type));
      return typeItem ? typeItem.tw : '-';
    },

    // 修改加載數據方法
    loadTopicData(id) {
      getTopic(id).then(response => {
        if (response.data) {
          const typeItem = this.typeMap.get(String(response.data.type));
          
          this.form = {
            ...response.data,
            type: typeItem ? typeItem.type : undefined,  // 使用映射後的類型值
            ai: String(response.data.ai),
            direction: response.data.direction || '',
            condition: response.data.condition || [],
            is_enabled: response.data.is_enabled
          };
          
          this.open = true;
          this.title = "修改結果";
        }
      });
    },
    /** 查詢運勢結果列表 */
    getList() {
      this.loading = true;
      listTopic(this.queryParams).then(response => {
        // 確保每條數據都有 is_enabled 欄位
        this.list = response.rows.map(item => ({
          ...item,
          is_enabled: item.is_enabled === undefined ? 0 : item.is_enabled
        }));
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按鈕
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表單重置
    reset() {
      this.form = {
        id: undefined,
        type: undefined,
        tw: "",
        en: "",
        description: "",
        direction: "",
        ai: "0",
        search_keyword: "",
        is_enabled: 1
      };
      this.testResult = "";
    },
    /** 搜索按鈕操作 */
    handleQuery() {
      const params = {
        ...this.queryParams,
        is_enabled: this.queryParams.is_enabled === undefined ? 
          undefined : 
          parseInt(this.queryParams.is_enabled)
      };
      
      this.queryParams.pageNum = 1;
      listTopic(params).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 重置按鈕操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {
        pageNum: 1,
        pageSize: 50,
        type: undefined,
        ai: undefined,
        is_enabled: undefined,
        keyword: undefined
      };
      this.handleQuery();
    },
    /** 新增按鈕操作 */
    handleAdd() {
      this.reset();
      // 確保在打開對話框時已經有類型數據
      if (this.typeOption.length === 0) {
        this.getTypeOptions().then(() => {
          this.open = true;
          this.title = "添加結果";
        });
      } else {
        this.open = true;
        this.title = "添加結果";
      }
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      // 確保在打開對話框時已經有類型數據
      if (this.typeOption.length === 0) {
        this.getTypeOptions().then(() => {
          this.loadTopicData(id);
        });
      } else {
        this.loadTopicData(id);
      }
    },
    // 修改測試處理方法
    handleTest() {
      this.testResult = "生成中...";
      testTopic(this.form)
        .then(response => {
          this.testResult = response.data.text;
        })
        .catch(error => {
          this.testResult = "生成失敗：" + error.message;
        });
    },
    /** 提交按鈕 */
    submitForm() {
      this.$refs.questionForm.validate().then(valid => {
        if (valid) {
          // 準備提交的數據
          const submitData = {
            ...this.form,
            type: String(this.form.type),  // 確保類型是字符串
            ai: String(this.form.ai),      // 確保 AI 是字符串
            direction: this.form.direction || '',  // 確保 direction 有值
            condition: this.form.condition || [],  // 確保 condition 是數組
          };

          // 如果是更新操作
          if (submitData.id) {
            updateTopic(submitData).then(response => {
              if (response.code === 200) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError(response.message);
              }
            }).catch(error => {
              console.error('更新失敗:', error);
              this.$modal.msgError("更新失敗");
            });
          } else {
            addTopic(submitData).then(response => {
              if (response.code != 200) {
                this.$modal.msgError(response.message);
                return
              }
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 刪除按鈕操作 */
    handleDelete(row) {
      this.$modal.confirm('是否確認刪除編號為"' + row.id + '"的數據項？').then(() => {
        return delTopic(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => { });
    },
    // 處理狀態變更
    handleStatusChange(row) {
      const text = row.is_enabled === 1 ? '啟用' : '停用';
      this.$modal.confirm('確認要' + text + '該主題問題嗎？').then(() => {
        return updateTopicStatus({
          id: row.id,
          enable: row.is_enabled
        });
      }).then(() => {
        this.$modal.msgSuccess(text + '成功');
      }).catch(() => {
        row.is_enabled = row.is_enabled === 1 ? 0 : 1; // 切換失敗時恢復狀態
      });
    },
    // 檢查是否有有效的條件
    hasValidConditions(conditions) {
      if (!conditions || !conditions.length) {
        return false;
      }
      return conditions.some(cond => {
        return Object.values(cond).some(value => 
          value !== "" && 
          value !== "-1" && 
          value !== -1 && 
          value !== undefined && 
          value !== null
        );
      });
    },
    // 新增 AI 變更處理方法
    handleAIChange(value) {
      if (value !== "1") {
        this.form.search_keyword = "";
      }
    },
    // 添加獲取圖片 URL 的方法
    getImageUrl(key) {
      if (!key) return '';
      const baseUrl = (process.env.VUE_APP_API_URL || window.location.origin).replace(/\/$/, '');
      return `${baseUrl}/icon/${key}.png`;
    },
    // 修改獲取方位選項的方法
    getDirectionOptions() {
      if (this.directionOptions.length > 0) {
        return Promise.resolve();
      }

      return getParams({ type: 'direction' })
        .then(response => {
          if (response.success && response.data) {
            this.directionOptions = response.data.map(item => ({
              key: item.key,
              en: item.en,
              tw: item.tw
            }));
            
            // 建立映射
            this.directionMap = new Map(
              this.directionOptions.map(item => [item.en, item])
            );
          }
        })
        .catch(error => {
          this.$message.error("獲取方位選項失敗：" + error.message);
        });
    },
    // 修改方位標籤獲取方法
    getDirectionLabel(direction) {
      if (!direction) return '-';
      const item = this.directionMap.get(direction);
      return item ? `${item.en}（${item.tw}）` : direction;
    },
    // 添加獲取 AI 標籤的方法
    getAILabel(value) {
      const aiOption = this.aiOptions.find(option => 
        parseInt(option.value) === parseInt(value)
      );
      return aiOption ? aiOption.label : value;
    },
  }
};
</script>

<style lang="scss" scoped>
/* ... 其他樣式保持不變 ... */

.el-switch {
  margin: 0 auto;
}

.no-margin {
  margin-bottom: 0;
}

.ai-type {
  .el-tag {
    min-width: 70px;
    text-align: center;
  }
}

.keyword {
  .el-tag {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// 添加提示詞相關樣式
.description-text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}

// 添加 AI 標籤樣式
.custom-tag--chatgpt.el-tag--success {
  background-color: #e7faf0;
  border-color: #d0f5e0;
  color: #13ce66;
}

.custom-tag--gemini.el-tag--warning {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

// 修改測試結果相關樣式
.test-section {
  .test-button-wrapper {
    margin-bottom: 15px;
    
    .test-button {
      width: 120px;
      
      &.is-loading {
        background-color: #ffc833;
        border-color: #ffc833;
        color: white;
        opacity: 0.8;
      }
    }
  }
  
  .test-result-wrapper {
    border-radius: 4px;
    transition: all 0.3s ease;
    
    .el-textarea {
      width: 100%;
      
      ::v-deep .el-textarea__inner {
        min-height: 120px !important;  // 最小高度
        max-height: 400px !important;  // 最大高度
        height: auto !important;       // 自動高度
        resize: vertical;              // 允許垂直調整大小
        background-color: #f5f7fa;
        font-family: "Courier New", Courier, monospace;
        font-size: 14px;
        line-height: 1.6;
        color: #606266;
        padding: 12px;
        overflow-y: auto;             // 內容過多時顯示滾動條
      }
    }
  }
}

// 淡入淡出動畫
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-leave-to, .fade-enter {
  opacity: 0;
}

// 添加刪除按鈕樣式
.delete-btn {
  color: #f56c6c !important;  /* 使用 Element UI 的危險紅色 */
  font-weight: 500;  /* 稍微加粗 */
  margin-left: 10px;  /* 與修改按鈕保持一定距離 */
}

.delete-btn:hover {
  color: #ff4949 !important;  /* hover 時的顏色 */
  background-color: #fef0f0;  /* hover 時的背景色 */
  border-radius: 2px;  /* 輕微圓角 */
}

/* ... 其他樣式保持不變 ... */
</style>
