<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" inline v-show="showSearch" label-width="68px">
      <el-form-item label="類型" prop="type">
        <el-select v-model="queryParams.type" placeholder="請選擇類型" clearable>
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="AI" prop="ai">
        <el-select v-model="queryParams.ai">
          <el-option label="ChatGPT" value="0"></el-option>
          <el-option label="Gemini" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="關鍵字" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="請輸入關鍵字" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:suggestion:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" width="120" />
      <el-table-column label="類型" align="center" prop="type" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">綜合</span>
          <span v-else-if="scope.row.type === 1">家庭</span>
          <span v-else-if="scope.row.type === 2">愛情</span>
          <span v-else-if="scope.row.type === 3">人際</span>
          <span v-else-if="scope.row.type === 4">健康</span>
          <span v-else-if="scope.row.type === 5">金錢</span>
          <span v-else-if="scope.row.type === 6">學事業</span>
          <span v-else-if="scope.row.type === 7">旅行</span>
          <span v-else-if="scope.row.type === 8">第六感</span>
          <span v-else-if="scope.row.type === 9">挑戰</span>
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
      <el-table-column label="提示詞" align="left" prop="description" min-width="360" show-overflow-tooltip />
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
                {{ cond.work_status === -1 ? '學事業不限' : suggestionConfig.horoscopeTypeOption[6][cond.work_status] }}
              </el-tag>
              <!-- 感情狀態 -->
              <el-tag 
                v-if="cond.relationship_status !== ''" 
                size="mini" 
                type="warning"
                style="margin-right: 5px;"
              >
                {{ cond.relationship_status === -1 ? '感情不限' : suggestionConfig.horoscopeTypeOption[2][cond.relationship_status] }}
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
      <el-table-column label="AI" align="center" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.ai === 0">ChatGPT</span>
          <span v-else-if="scope.row.ai === 1">Gemini</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-edit" 
            @click="handleUpdate(scope.row)" 
            v-hasPermi="['system:suggestion:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-delete" 
            class="delete-btn"
            @click="handleDelete(scope.row)" 
            v-hasPermi="['system:suggestion:remove']"
          >刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <el-dialog 
      :title="title" 
      :visible.sync="open" 
      width="1000px" 
      append-to-body
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="類型" prop="type">
          <el-select v-model="form.type" placeholder="請選擇類型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="問題" prop="tw" required>
          <el-tag>中文</el-tag>
          <el-input v-model="form.tw" placeholder="請輸入中文問題" />
          <el-tag>英文</el-tag>
          <el-input v-model="form.en" placeholder="請輸入英文問題" />
        </el-form-item>
        <el-form-item label="ICON" prop="direction" required>
          <div style="display: flex; align-items: center; gap: 15px;">
            <el-select 
              v-model="form.direction" 
              placeholder="請選擇圖示"
              filterable
              style="width: 300px;"
            >
              <el-option
                v-for="item in directionOptions"
                :key="item.id"
                :label="`${item.en}（${item.tw}）`"
                :value="item.en"
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

            <el-image 
              v-if="form.direction"
              style="width: 40px; height: 40px;"
              :src="getImageUrl(form.direction)"
              :preview-src-list="[getImageUrl(form.direction)]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </el-form-item>
        <el-form-item label="AI 類型" prop="ai" @change="handleAIChange">
          <el-select v-model="form.ai">
            <el-option label="ChatGPT" value="0"></el-option>
            <el-option label="Gemini" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          v-if="form.ai === '1'" 
          label="搜尋詞" 
          prop="search_keyword"
          :rules="[
            { required: true, message: '請輸入搜尋關鍵字', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="form.search_keyword"
            placeholder="請輸入 Google Map 搜尋關鍵字"
          />
        </el-form-item>
        <el-form-item label="提示詞" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="請輸入描述"
            :rows="6"
            :autosize="{ minRows: 6, maxRows: 10 }"
          />
        </el-form-item>
        <el-form-item label="立即測試" v-if="testResult || isGenerating">
          <el-input type="textarea" v-model="testResult" :placeholder="isGenerating ? '生成中請稍候...' : '點擊下方測試按鈕查看結果'" :rows="8" readonly class="test-result-textarea" />
        </el-form-item>
        <el-form-item label="條件" prop="condition">
          <div v-for="(cond, index) in form.condition" :key="cond.id || index" style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1;">
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 10px; width: 80px;">性別:</span>
                  <el-select v-model="cond.sex" placeholder="性別" style="width: 200px;">
                    <el-option label="不限" value="-1" />
                    <el-option v-for="(label, key) in sexOptions" :key="key" :label="label" :value="key" />
                  </el-select>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 10px; width: 80px;">血型:</span>
                  <el-select v-model="cond.blood_type" placeholder="血型" style="width: 200px;">
                    <el-option label="不限" value="-1" />
                    <el-option v-for="(label, key) in bloodTypeOptions" :key="key" :label="label" :value="key" />
                  </el-select>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 10px; width: 80px;">學事業:</span>
                  <el-select v-model="cond.work_status" placeholder="學事業狀態" style="width: 200px;">
                    <el-option v-for="option in workStatusOptions" :key="option.value" :label="option.label" :value="option.value" />
                  </el-select>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 10px; width: 80px;">感情:</span>
                  <el-select v-model="cond.relationship_status" placeholder="感情狀態" style="width: 200px;">
                    <el-option v-for="option in relationshipStatusOptions" :key="option.value" :label="option.label" :value="option.value" />
                  </el-select>
                </div>
              </div>
              <el-button 
                size="mini" 
                type="danger" 
                icon="el-icon-delete" 
                circle 
                @click="removeCondition(index)" 
                style="margin-left: 15px;"
              />
            </div>
          </div>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addCondition">新增條件</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button type="warning" @click="submitTest">測試</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  listSuggestion, 
  getSuggestion, 
  delSuggestion, 
  addSuggestion, 
  updateSuggestion, 
  testSuggestion,
  suggestionConstants 
} from "@/api/question/suggestion";
import { getParams } from "@/api/system/params";
import suggestionConfigData from "@/config/suggestionConfig";

export default {
  name: "Suggestion",
  dicts: ['sys_normal_disable'],
  data() {
    // 直接在 data 中構建 typeOptions
    const buildTypeOptions = () => {
      return Object.entries(suggestionConfigData.horoscopeType).map(([value, label]) => ({
        value: String(value),
        label: label
      }));
    };

    return {
      dialogVisible: false,
      showSearch: true,
      loading: false,
      list: [],
      total: 0,
      title: "",
      testResult: "",
      isGenerating: false,
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        ai: '',
        keyword: '',
        type: undefined
      },
      // 使用新的 typeOptions 定義
      typeOptions: buildTypeOptions(),
      form: {
        ...suggestionConstants.defaultForm,
        search_keyword: "",
        condition: [
          {
            sex: "-1",
            work_status: "-1",
            relationship_status: "-1",
            blood_type: "-1"
          }
        ]
      },
      rules: suggestionConstants.rules,
      // 其他配置
      suggestionConfig: suggestionConfigData,
      sexOptions: suggestionConfigData.sex,
      bloodTypeOptions: suggestionConfigData.bloodType,
      workStatusOptions: [
        { value: "-1", label: "不限" },
        ...suggestionConfigData.horoscopeTypeOption[6].map((item, index) => ({
          value: String(index),
          label: item
        }))
      ],
      relationshipStatusOptions: [
        { value: "-1", label: "不限" },
        ...suggestionConfigData.horoscopeTypeOption[2].map((item, index) => ({
          value: String(index),
          label: item
        }))
      ],
      directionMap: new Map(),
      directionOptions: [],
      directionImageMap: new Map()
    };
  },
  computed: {
    open: {
      get() {
        return this.dialogVisible;
      },
      set(value) {
        this.dialogVisible = value;
      }
    }
  },
  created() {
    this.$set(this, 'open', false);
    this.getList();
    this.getDirectionOptions();
  },
  methods: {
    getList() {
      this.loading = true;
      listSuggestion(this.queryParams)
        .then(response => {
          console.log('列表資料:', response.rows);
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("獲取數據失敗: " + error.message);
        });
    },
    resetForm(name) {
      this.$refs[name].resetFields();
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        ...suggestionConstants.defaultForm,
        search_keyword: "",
        condition: [
          {
            sex: "-1",
            work_status: "-1",
            relationship_status: "-1",
            blood_type: "-1"
          }
        ]
      };
      this.testResult = "";
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.type = undefined;
      this.handleQuery();
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加結果";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getSuggestion(id)
        .then(response => {
          const mapCondition = (condition) => {
            return condition.map(cond => ({
              sex: cond.sex === -1 ? "-1" : String(cond.sex),
              work_status: cond.work_status === -1 ? "-1" : String(cond.work_status),
              relationship_status: cond.relationship_status === -1 ? "-1" : String(cond.relationship_status),
              blood_type: cond.blood_type === -1 ? "-1" : String(cond.blood_type)
            }));
          };

          // 直接使用 String 轉換，因為我們的 typeOptions 已經是正確的格式
          this.form = {
            id: response.data.id,
            type: String(response.data.type),  // 直接轉換為字串
            tw: response.data.tw,
            en: response.data.en,
            direction: response.data.direction,
            ai: String(response.data.ai),
            search_keyword: response.data.search_keyword || "",
            description: response.data.description || "",
            condition: response.data.condition && response.data.condition.length > 0
              ? mapCondition(response.data.condition)
              : [
                  {
                    sex: "-1",
                    work_status: "-1",
                    relationship_status: "-1",
                    blood_type: "-1"
                  }
                ]
          };

          console.log('原始數據:', response.data);
          console.log('轉換後的表單數據:', this.form);
          console.log('類型選項:', this.typeOptions);
          
          this.open = true;
          this.title = "修改建議問題";
        })
        .catch(() => {
          this.$message.error("獲取數據失敗");
        });
    },
    submitTest() {
      this.isGenerating = true;
      this.testResult = "生成中請稍候...";
      testSuggestion(this.form)
        .then(response => {
          this.testResult = response.data.text;
        })
        .catch(error => {
          this.$message.error("生成失敗：" + error.message);
          this.testResult = "";
        })
        .finally(() => {
          this.isGenerating = false;
        });
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 將顯示文字轉換回數字
          const getKeyByValue = (obj, value) => {
            return Object.keys(obj).find(key => obj[key] === value);
          };

          const submitData = {
            ...this.form,
            type: parseInt(this.form.type),
            ai: parseInt(this.form.ai),
            search_keyword: this.form.ai === "1" ? this.form.search_keyword : undefined,
            condition: this.form.condition.map(cond => ({
              sex: cond.sex === "-1" ? -1 : parseInt(cond.sex),
              work_status: cond.work_status === "-1" ? -1 : parseInt(cond.work_status),
              relationship_status: cond.relationship_status === "-1" ? -1 : parseInt(cond.relationship_status),
              blood_type: cond.blood_type === "-1" ? -1 : parseInt(cond.blood_type)
            }))
          };

          console.log('提交的數據:', submitData);

          if (this.form.id != undefined) {
            updateSuggestion(submitData).then(response => {
              if (response.code !== 200) {
                this.$modal.msgError(response.message);
                return;
              }
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSuggestion(submitData).then(response => {
              if (response.code !== 200) {
                this.$modal.msgError(response.message);
                return;
              }
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const id = row.id;
      this.$modal
        .confirm('是否確認刪除編號為"' + id + '"的數據項？')
        .then(() => {
          return delSuggestion(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("刪除成功");
        })
        .catch(() => {});
    },
    addCondition() {
      this.form.condition.push({
        sex: "-1",
        work_status: "-1",
        relationship_status: "-1",
        blood_type: "-1"
      });
    },
    removeCondition(index) {
      this.form.condition.splice(index, 1);
    },
    handleTypeChange() {
      // 處理類型變更（如需額外邏輯，可在此添加）
    },
    // 獲取方位選項
    getDirectionOptions() {
      getParams({ type: 'direction' }).then(response => {
        if (response.success && response.data) {
          this.directionOptions = response.data;
          // 建立方位對應 Map
          this.directionOptions.forEach(item => {
            this.directionMap.set(item.en, item);
            // 新增：建立圖片對應關係
            if (item.en) {
              this.directionImageMap.set(item.en, item.key);
            }
          });
          console.log('方位映射:', this.directionMap);
          console.log('圖片映射:', this.directionImageMap);
        }
      }).catch(error => {
        this.$message.error("獲取方位選項失敗：" + error.message);
      });
    },
    // 獲取方位的顯示文字
    getDirectionLabel(direction) {
      const item = this.directionMap.get(direction);
      return item ? `${item.en}（${item.tw}）` : direction;
    },
    getImageUrl(direction) {
      // 檢查 direction 值
      console.log('當前 direction:', direction);
      
      // 檢查 API URL，移除結尾的斜線
      const baseUrl = (process.env.VUE_APP_API_URL || window.location.origin).replace(/\/$/, '');
      
      // 直接使用 direction 作為圖檔名稱
      const imageUrl = `${baseUrl}/icon/${direction}.png`;
      console.log('完整圖片路徑:', imageUrl);
      
      return imageUrl;
    },
    // 檢查是否有有效的條件
    hasValidConditions(conditions) {
      if (!conditions || !conditions.length) {
        return false;
      }
      
      // 檢查是否所有條件的值都為空或 -1
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
    handleAIChange(value) {
      if (value !== "1") {
        this.form.search_keyword = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.test-result-textarea ::v-deep .el-textarea__inner {
  background-color: #f5f7fa;
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

::v-deep .el-select-dropdown__item {
  height: auto;
  padding: 8px;
}

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
</style>
