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
          <el-option label="預設" value="0"></el-option>
          <el-option label="GoogleMap" value="1"></el-option>
          <el-option label="Plexity" value="2"></el-option>
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
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:suggestion:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:suggestion:remove']">刪除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="類型" align="center" prop="type" show-overflow-tooltip>
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
      <el-table-column label="問題(中)" align="left" prop="tw" show-overflow-tooltip width="200" />
      <el-table-column label="問題(英)" align="left" prop="en" show-overflow-tooltip width="200" />
      <el-table-column label="ICON" align="center" prop="direction" />
      <el-table-column label="提示詞" align="center" prop="description" show-overflow-tooltip width="250" />
      <el-table-column label="AI 類型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.ai === 0">預設</span>
          <span v-else-if="scope.row.ai === 1">GoogleMap</span>
          <span v-else-if="scope.row.ai === 2">Plexity</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:suggestion:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:suggestion:remove']">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="類型" prop="type">
          <el-select v-model="form.type">
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
          <el-input v-model="form.direction" placeholder="請選擇APP所使用ICON" />
        </el-form-item>
        <el-form-item label="AI 類型" prop="ai">
          <el-select v-model="form.ai">
            <el-option label="預設" value="0"></el-option>
            <el-option label="GoogleMap" value="1"></el-option>
            <el-option label="Plexity" value="2"></el-option>
          </el-select>
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
                    <el-option label="不限" value="" />
                    <el-option v-for="(label, key) in sexOptions" :key="key" :label="label" :value="parseInt(key)" />
                  </el-select>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 10px; width: 80px;">血型:</span>
                  <el-select v-model="cond.blood_type" placeholder="血型" style="width: 200px;">
                    <el-option label="不限" value="" />
                    <el-option v-for="(label, key) in bloodTypeOptions" :key="key" :label="label" :value="parseInt(key)" />
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
import { listSuggestion, getSuggestion, delSuggestion, addSuggestion, updateSuggestion, testSuggestion } from "@/api/question/suggestion";
import suggestionConfig from "@/config/suggestionConfig";

export default {
  name: "Suggestion",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      showSearch: true,
      loading: false,
      list: [],
      total: 0,
      ids: [],
      single: true,
      multiple: true,
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
      form: {
        id: undefined,
        type: "0",
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
      sexOptions: suggestionConfig.sex,
      bloodTypeOptions: suggestionConfig.bloodType,
      workStatusOptions: [
        { value: "", label: "不限" },
        ...suggestionConfig.horoscopeTypeOption[6].map((item, index) => ({
          value: String(index),
          label: item
        }))
      ],
      relationshipStatusOptions: [
        { value: "", label: "不限" },
        ...suggestionConfig.horoscopeTypeOption[2].map((item, index) => ({
          value: String(index),
          label: item
        }))
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listSuggestion(this.queryParams)
        .then(response => {
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
        id: undefined,
        type: "0",
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
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加結果";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSuggestion(id)
        .then(response => {
          this.form = {
            id: response.data.id,
            type: response.data.type.toString(),
            tw: response.data.tw,
            en: response.data.en,
            direction: response.data.direction,
            ai: response.data.ai.toString(),
            description: response.data.description || "",
            condition: response.data.condition || [
              {
                sex: "",
                work_status: "",
                relationship_status: "",
                blood_type: ""
              }
            ]
          };
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
          if (this.form.id != undefined) {
            updateSuggestion(this.form).then(response => {
              if (response.code !== 200) {
                this.$modal.msgError(response.message);
                return;
              }
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSuggestion(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否確認刪除編號為"' + ids + '"的數據項？')
        .then(() => {
          return delSuggestion(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("刪除成功");
        })
        .catch(() => {});
    },
    addCondition() {
      this.form.condition.push({
        sex: "",
        work_status: "",
        relationship_status: "",
        blood_type: ""
      });
    },
    removeCondition(index) {
      this.form.condition.splice(index, 1);
    },
    handleTypeChange() {
      // 處理類型變更（如需額外邏輯，可在此添加）
    }
  }
};
</script>

<style lang="scss" scoped>
.test-result-textarea ::v-deep .el-textarea__inner {
  background-color: #f5f7fa;
}
</style>
