<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="標題" prop="title">
        <el-input v-model="queryParams.title" placeholder="請輸入標題" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['horoscope:matching:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['horoscope:matching:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['horoscope:matching:remove']">刪除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="chartList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="標題" align="center" prop="title" />
      <el-table-column label="甲方戀愛價值觀" align="center" prop="aLoveValue" />
      <el-table-column label="乙方戀愛價值觀" align="center" prop="bLoveValue" />
      <el-table-column label="速配詳情" align="center" prop="detail" show-overflow-tooltip />
      <el-table-column label="如何增加" align="center" prop="increase" />
      <el-table-column label="媒合度" align="center" prop="matchingScore" />
      <el-table-column label="星座" align="center" prop="aZodiacSign" />
      <el-table-column label="性別" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.aSex == 0 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="媒合星座" align="center" prop="bZodiacSign" />
      <el-table-column label="性別" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bSex == 0 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['horoscope:matching:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['horoscope:matching:remove']">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="標題" prop="title">
          <el-input v-model="form.title" placeholder="請輸入標題" />
        </el-form-item>

        <el-form-item label="甲方戀愛價值觀" prop="aLoveValue">
          <el-input v-model="form.aLoveValue" placeholder="請輸入甲方戀愛價值觀" />
        </el-form-item>

        <el-form-item label="乙方戀愛價值觀" prop="bLoveValue">
          <el-input v-model="form.bLoveValue" placeholder="請輸入乙方戀愛價值觀" />
        </el-form-item>

        <el-form-item label="速配詳情" prop="detail">
          <el-input v-model="form.detail" type="textarea" placeholder="請輸入速配詳情" />
        </el-form-item>

        <el-form-item label="如何增加" prop="increase">
          <el-input v-model="form.increase" placeholder="請輸入如何增加" />
        </el-form-item>

        <el-form-item label="媒合度" prop="matchingScore">
          <el-input v-model="form.matchingScore" placeholder="請輸入媒合度" />
        </el-form-item>

        <el-form-item label="星座" prop="aZodiacSign">
          <el-input v-model="form.aZodiacSign" placeholder="請輸入甲方星座" />
        </el-form-item>

        <el-form-item label="性別" prop="aSex">
          <el-radio-group v-model="form.aSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="媒合星座" prop="bZodiacSign">
          <el-input v-model="form.bZodiacSign" placeholder="請輸入乙方星座" />
        </el-form-item>

        <el-form-item label="性別" prop="bSex">
          <el-radio-group v-model="form.bSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
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
import { listHoroscope_matching, getHoroscope_matching, delHoroscope_matching, addHoroscope_matching, updateHoroscope_matching } from "@/api/system/horoscope_matching";

export default {
  name: "Horoscope_matching",
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
      // 星座配對表格數據
      chartList: [],
      // 彈出層標題
      title: "",
      // 是否顯示彈出層
      open: false,
      // 查詢參數
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        subType: undefined,
        subStatus: undefined
      },
      // 表單參數
      form: {},
      // 表單校驗
      rules: {
        title: [
          { required: true, message: "標題不能為空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "詳情不能為空", trigger: "blur" }
        ],
        subTitle: [
          { required: true, message: "簡稱不能為空", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查詢星座配對列表 */
    getList() {
      this.loading = true;
      listHoroscope_matching(this.queryParams).then(response => {
        this.chartList = response.rows;
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
        subType: undefined,
        subStatus: undefined,
        score: undefined,
        shortReview: undefined,
        advantage: undefined,
        disadvantage: undefined,
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
      this.title = "添加星座配對";
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHoroscope_matching(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改星座配對";
      });
    },
    /** 提交按鈕 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateHoroscope_matching(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHoroscope_matching(this.form).then(response => {
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
      const chartIds = row.id || this.ids;
      this.$modal.confirm('是否確認刪除星座配對編號為"' + chartIds + '"的數據項？').then(function () {
        return delHoroscope_matching(chartIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => { });
    },
  }
};
</script>