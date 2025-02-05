<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="AI" prop="ai">
        <el-select v-model="queryParams.ai" @change="handleQuery">
          <el-option label="預設" value="0"></el-option>
          <el-option label="GoogleMap" value="1"></el-option>
          <el-option label="Plexity" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="關鍵字" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="請輸入關鍵字" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:suggestion:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:suggestion:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:suggestion:remove']">刪除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="類型" align="center" prop="type" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">綜合</span>
          <span v-if="scope.row.type === 1">家庭</span>
          <span v-if="scope.row.type === 2">愛情</span>
          <span v-if="scope.row.type === 3">人際</span>
          <span v-if="scope.row.type === 4">健康</span>
          <span v-if="scope.row.type === 5">金錢</span>
          <span v-if="scope.row.type === 6">學事業</span>
          <span v-if="scope.row.type === 7">旅行</span>
          <span v-if="scope.row.type === 8">第六感</span>
          <span v-if="scope.row.type === 9">挑戰</span>
        </template>
      </el-table-column>
      <el-table-column label="問題" align="left" prop="tw" show-overflow-tooltip/>
      <el-table-column label="解答方向" align="center" prop="direction" />
      <el-table-column label="AI 類型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.ai === 0">預設</span>
          <span v-if="scope.row.ai === 1">GoogleMap</span>
          <span v-if="scope.row.ai === 2">Plexity</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:suggestion:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:suggestion:remove']">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form"  label-width="80px">
        <el-form-item label="類型" prop="type">
          <el-select v-model="form.type" @change="handleChangeType">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"  placeholder="請輸入類型"/>
          </el-select>
        </el-form-item>
        <el-form-item label="問題" prop="tw" required>
          <el-tag>中文</el-tag><el-input v-model="form.tw" placeholder="請輸入中文問題" />
          <el-tag>英文</el-tag><el-input v-model="form.en" placeholder="請輸入英文問題" />
        </el-form-item>
        <el-form-item label="解答方向" prop="direction" required>
          <el-input v-model="form.direction" placeholder="請輸入解答方向" />
          </el-form-item>
        <el-form-item label="AI 類型" prop="ai">  
              <el-select v-model="form.ai" @change="handleChangeType">
                <el-option label="預設" value="0"></el-option>
                <el-option label="GoogleMap" value="1"></el-option>
                <el-option label="Plexity" value="2"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="描途" prop="description">  
              <el-input type="textarea" v-model="form.description" placeholder="請輸入描述" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="submitTest">測試結果</el-button>
        <el-button type="primary" @click="submitForm">確 定</el-button>     
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listSuggestion, getSuggestion, delSuggestion, addSuggestion, updateSuggestion, testSuggestion } from "@/api/question/suggestion";

export default {
  name: "Suggestion",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      activeName: 'en',
      // 遮罩層
      loading: true,
      // 選中數組
      ids: [],
      // 非單個禁用
      single: true,
      // 非多個禁用
      multiple: true,
      // 顯示搜索條件
      showSearch: true,
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
        pageSize: 10,
        ai: '',
        keyword: '',
      },
      // 大類選項
      typeOption: [
        { value: '0', label: '綜合' },
        { value: '1', label: '家庭' },
        { value: '2', label: '愛情' },
        { value: '3', label: '人際' },
        { value: '4', label: '健康' },
        { value: '5', label: '金錢' },
        { value: '6', label: '學事業' },
        { value: '7', label: '旅行' },
        { value: '8', label: '第六感' },
        { value: '9', label: '挑戰' },
      ],
      // 表單參數
      form: {
        id: undefined,
        type: '0',
        tw: '',
        en: '',
        direction: '',
        ai: '0',
        description: '',
      },
      // 表單校驗
      rules: {
        
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleChangeType() {
      this.form.subStatus = '0'
    },
    /** 查詢運勢結果列表 */
    getList() {
      this.loading = true;
      listSuggestion(this.queryParams).then(response => {
        this.list = response.rows;
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
        subStatus: '0',
        subType: '0',
        score: 1,
        shortReview: {
          en: '',
          tw: '',
        },
        advantage: {
          en:'',
          tw: '',
        },
        disadvantage: {
          en:'',
          tw: '',
        },
        detail: {
          en:'',
          tw:'',
        }
     };
      //this.resetForm("form");
    },
    /** 搜索按鈕操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按鈕操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多選框選中數據
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按鈕操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加結果";
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSuggestion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改結果";
      });
    },
    submitTest: function () {
      console.log(this.form);
      testSuggestion(this.form).then(response => {
        console.log(response);
        this.$message({
          showClose: true,
          duration: 0,
          message: response.data.text,
          type: 'info'
        });
      });
    },
    /** 提交按鈕 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSuggestion(this.form).then(response => {
              if (response.code != 200) {
                this.$modal.msgError(response.message);
                return
              }

              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSuggestion(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否確認刪除編號為"' + ids + '"的數據項？').then(function () {
        return delSuggestion(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => { });
    },
  }
};
</script>
