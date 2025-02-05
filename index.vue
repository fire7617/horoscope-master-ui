<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="運勢大類" prop="subType">
        <el-input v-model="queryParams.subType" placeholder="請輸入運勢大類" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="運勢小類" prop="subStatus">
        <el-input v-model="queryParams.subStatus" placeholder="請輸入運勢結果名稱" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:horoscope:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:horoscope:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:horoscope:remove']">刪除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="horoscopeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="大類" align="center" prop="fmt.subType" />
      <el-table-column label="小類" align="center" prop="fmt.subStatus" />
      <el-table-column label="分數" align="center" prop="score" />
      <el-table-column label="短評" align="center" prop="shortReview" show-overflow-tooltip />
      <el-table-column label="詳情" align="center" prop="detail" show-overflow-tooltip />
      <el-table-column label="優勢" align="center" prop="advantage" show-overflow-tooltip />
      <el-table-column label="劣勢" align="center" prop="disadvantage" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:horoscope:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:horoscope:remove']">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form"  label-width="80px">
        <el-form-item label="大類" prop="subType">
          <el-select v-model="form.subType" @change="handleChangeType">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"  placeholder="請輸入大類"/>
          </el-select>
        </el-form-item>
        <el-form-item label="小類" prop="subStatus">
          <el-select v-model="form.subStatus" >
            <template v-if="form.subType===0 || form.subType===4 || form.subType ===5 || form.subType===6">
              <el-option key="0" label="一般" value="0" ></el-option>
            </template>
            <el-option v-if="form.subType===1" v-for="item in loveOption" :key="item.value" :label="item.label" :value="item.value"/>
            <el-option v-if="form.subType===2" v-for="item in careerOption" :key="item.value" :label="item.label" :value="item.value"/>
            <el-option v-if="form.subType===3" v-for="item in welthOption" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="分數" prop="score" required>
          <el-input v-model="form.score" placeholder="請輸入分數" />
        </el-form-item>
        <el-form-item label="">
            <el-tabs v-model="activeName" >
              <el-tab-pane label="英文" name="en"></el-tab-pane>
              <el-tab-pane label="中文" name="zh-tw"></el-tab-pane>
            </el-tabs>
        </el-form-item>
        <el-form-item label="短評" prop="form.shortReview" >
          <el-input v-model="form.shortReview.en" v-if="activeName==='en'" placeholder="請輸入短評" />
          <el-input v-model="form.shortReview.tw" v-if="activeName==='zh-tw'" placeholder="請輸入短評" />
        </el-form-item>
        
        <el-form-item label="優勢" prop="advantage" >
          <el-input v-model="form.advantage.en" v-if="activeName==='en'" placeholder="請輸入優勢" />
          <el-input v-model="form.advantage.tw" v-if="activeName==='zh-tw'" placeholder="請輸入優勢" />
        </el-form-item>

        <el-form-item label="劣勢" prop="disadvantage" >
          <el-input v-model="form.disadvantage.en" v-if="activeName==='en'" placeholder="請輸入劣勢" />
          <el-input v-model="form.disadvantage.tw" v-if="activeName==='zh-tw'" placeholder="請輸入劣勢" />
        </el-form-item>

        <el-form-item label="詳情" prop="detail" >
          <el-input v-model="form.detail.en" v-if="activeName==='en'" placeholder="請輸入詳情" />
          <el-input v-model="form.detail.tw" v-if="activeName==='zh-tw'" placeholder="請輸入詳情" />
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
import { listHoroscope, getHoroscope, delHoroscope, addHoroscope, updateHoroscope } from "@/api/system/horoscope";

export default {
  name: "Horoscope",
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
      // 運勢結果表格數據
      horoscopeList: [],
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
      form: {
        shortReview : {
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
      },
      // 表單校驗
      rules: {
        subType: [
          { required: true, message: "運勢大類不能為空", trigger: "blur" }
        ],
        subStatus: [
          { required: true, message: "運勢小類不能為空", trigger: "blur" }
        ],
        score: [
          { required: true, message: "運勢分數不能為空", trigger: "blur" }
        ]
      },
      typeOption: [
        { value: 0, label: "綜合"},
        { value: 1, label: "愛情"},
        { value: 2, label: "學事業"},
        { value: 3, label: "金錢"},
        { value: 4, label: "健康"},
        { value: 5, label: "人際"},
        { value: 6, label: "旅行"},
      ],
      loveOption: [
        { value: 0, label: "一般"},
        { value: 1, label: "單身"},
        { value: 2, label: "暗戀"},
        { value: 3, label: "曖昧"},
        { value: 4, label: "戀愛"},
        { value: 5, label: "已婚"},
      ],
      careerOption: [
        { value: 0, label: "一般"},
        { value: 1, label: "在學"},
        { value: 2, label: "求學"},
        { value: 3, label: "在職"},
        { value: 4, label: "求職"},
        { value: 5, label: "轉職"},
      ],
      welthOption: [
        { value: 0, label: "一般"},
        { value: 1, label: "正財"},
        { value: 2, label: "偏財"},
        { value: 3, label: "投資"},
      ],
      healthOption: [
        { value: 0, label: "一般"},
      ],
      interpersonalOption: [
        { value: 0, label: "一般"},
      ],
      travelOption: [
        { value: 0, label: "一般"},
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleChangeType() {
      this.form.subStatus = 0
    },
    /** 查詢運勢結果列表 */
    getList() {
      this.loading = true;
      listHoroscope(this.queryParams).then(response => {
        this.horoscopeList = response.rows;
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
        type: '',
        subStatus: '',
        score: '',
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
      this.title = "添加運勢結果";
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHoroscope(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改運勢結果";
      });
    },
    /** 提交按鈕 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateHoroscope(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHoroscope(this.form).then(response => {
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
      const horoscopeIds = row.id || this.ids;
      this.$modal.confirm('是否確認刪除運勢結果編號為"' + horoscopeIds + '"的數據項？').then(function () {
        return delHoroscope(horoscopeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => { });
    },
  }
};
</script>
