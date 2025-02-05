<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="權重分類" prop="type">
        <el-input v-model="queryParams.type" placeholder="請輸入分類" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="權重描述" prop="description">
        <el-input v-model="queryParams.description" placeholder="請輸入描述" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['horoscope:factor:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['horoscope:factor:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['horoscope:factor:remove']">刪除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="分類" align="center" prop="type" />
      <el-table-column label="權重" align="center" prop="effect" />
      <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip/>
      <el-table-column label="建立時間" align="center" prop="createTime"  />
      <el-table-column label="更新時間" align="center" prop="updateTime"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['horoscope:factor:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['horoscope:factor:remove']">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分類" prop="type">
          <el-input v-model="form.type" placeholder="請輸入分類" />
        </el-form-item>
        <el-form-item label="權重" prop="effect">
          <el-input v-model="form.effect" placeholder="請輸入權重" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="請輸入描述" />
        </el-form-item>
        
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listFactor, getFactor, delFactor, addFactor, updateFactor } from "@/api/system/factor";

export default {
  name: 'Factor',
  dicts: ['sys_normal_disable'],
  data() {
    return {
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
      // 解答表格數據
      factorList: [],
      // 彈出層標題
      title: "",
      // 是否顯示彈出層
      open: false,
      // 查詢參數
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        description: undefined
      },
      // 表單參數
      form: {},
      // 表單校驗
      rules: {
        type: [
          { required: true, message: "大類不能為空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "描述不能為空", trigger: "blur" }
        ],
        effect: [
          { required: true, message: "權重不能為空", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查詢解答列表 */
    getList() {
      this.loading = true;
      listFactor(this.queryParams).then(response => {
        this.factorList = response.rows;
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
        category: undefined,
        detail: undefined,
      };
      this.resetForm("form");
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
      this.title = "添加解答";
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFactor(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改解答";
      });
    },
    /** 提交按鈕 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateFactor(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFactor(this.form).then(response => {
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
      const factorIds = row.id || this.ids;
      this.$modal.confirm('是否確認刪除解答編號為"' + factorIds + '"的數據項？').then(function () {
        return delFactor(factorIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => { });
    },
  }
};
</script>