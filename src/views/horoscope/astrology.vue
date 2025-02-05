<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="標題" prop="subType">
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
          v-hasPermi="['horoscope:astrology:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['horoscope:astrology:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['horoscope:astrology:remove']">刪除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="chartList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="標題" align="center" prop="title" />
      <el-table-column label="簡稱" align="center" prop="subTitle" />
      <el-table-column label="詳情" align="center" prop="content" show-overflow-tooltip/>
      <el-table-column label="TID" align="center" prop="fmt.tid"  />
      <el-table-column label="分類(T1)" align="center" prop="fmt.t1" />
      <el-table-column label="子類(T2)" align="center" prop="fmt.t2"  />
      <el-table-column label="子類(T3)" align="center" prop="fmt.t3" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['horoscope:astrology:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['horoscope:astrology:remove']">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改對話框 -->
    <el-dialog v-loading="loading" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="TID" prop="tid">
          <el-select v-model="form.tid" @change="handleChangeData('tid')">
            <el-option value="1" label="星體"></el-option>
            <el-option value="2" label="宮位"></el-option>
            <el-option value="3" label="星體角度"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分類(T1)" prop="t1" @change="handleChangeData('t1')">
            <el-select v-model="form.t1">
              <el-option v-for="item in planetOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="子類(T2)" prop="t2" >
          <template v-if="form.tid==='1'">
            <el-select v-model="form.t2"  @change="handleChangeData('t2')">
              <el-option v-for="item in signOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>

          <template v-if="form.tid==='2'">
            <el-select v-model="form.t2" @change="handleChangeData('t2')">
              <el-option v-for="item in planetOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template v-if="form.tid==='3'">
            <el-select v-model="form.t2" @change="handleChangeData('t2')">
              <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
            </el-select>
            宮
          </template>
        </el-form-item>
        <el-form-item label="子類(T3)" prop="t3" v-if="form.tid==='3'">
            <el-select v-model="form.t3">
              <el-option key="0"    label="0度" value="0" />
              <el-option key="60"   label="60度" value="60" />
              <el-option key="90"   label="90度" value="90" />
              <el-option key="120"  label="120度" value="120" />
              <el-option key="180"  label="180度" value="180" />
            </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-tabs v-model="activeName">
              <el-tab-pane label="英文" name="en"></el-tab-pane>
              <el-tab-pane label="中文" name="zh-tw"></el-tab-pane>
            </el-tabs>
        </el-form-item>
        <el-form-item label="標題" prop="">
          <el-input v-if="activeName==='en'" v-model="form.en.title" placeholder="請輸入標題" />
          <el-input v-if="activeName==='zh-tw'" v-model="form.tw.title" placeholder="請輸入標題" />
        </el-form-item>
        <el-form-item label="簡稱" prop="">
          <el-input v-if="activeName==='en'" v-model="form.en.subTitle" placeholder="請輸入簡稱" />
          <el-input v-if="activeName==='zh-tw'" v-model="form.tw.subTitle" placeholder="請輸入簡稱" />
        </el-form-item>
        <el-form-item label="詳情" prop="content">
          <el-input v-if="activeName==='en'" v-model="form.en.content" placeholder="請輸入詳情" />
          <el-input v-if="activeName==='zh-tw'" v-model="form.tw.content" placeholder="請輸入詳情" />
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
import { listChart_data, getChart_data, delChart_data, addChart_data, updateChart_data } from "@/api/system/chart_data";
//import { listPlanet } from "@/api/system/base";

export default {
  name: "Chart_data",
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
      // 星盤結果表格數據
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
      form: {
        en: {
          title: '',
          subTitle: '',
          content: '',
        },
        tw: {
          title: '',
          subTitle: '',
          content: '',
        },
      },
      // 表單校驗
      rules: {
      },
      planetOption: [
        {
          "value": 0,
          "label": "太陽"
        },
        {
          "value": 1,
          "label": "月亮"
        },
        {
          "value": 2,
          "label": "水星"
        },
        {
          "value": 3,
          "label": "金星"
        },
        {
          "value": 4,
          "label": "火星"
        },
        {
          "value": 5,
          "label": "木星"
        },
        {
          "value": 6,
          "label": "土星"
        },
        {
          "value": 7,
          "label": "天王星"
        },
        {
          "value": 8,
          "label": "海王星"
        },
        {
          "value": 9,
          "label": "冥王星"
        }
      ],
      signOption: [
        { value:"0", label:"牡羊"},
        { value:"1", label:"金牛"},
        { value:"2", label:"雙子"},
        { value:"3", label:"巨蟹"},
        { value:"4", label:"獅子"},
        { value:"5", label:"處女"},
        { value:"6", label:"天秤"},
        { value:"7", label:"天蠍"},
        { value:"8", label:"射手"},
        { value:"9", label:"魔蠍"},
        { value:"10", label:"水瓶"},
        { value:"11", label:"雙鱼"},
      ]
    }
  },
  created() {
    this.getList();
  },
  mounted() {
  },
  watch() {
  },
  methods: {
    handleChangeData(mark){
      if (mark == 'tid') {
        this.form.t1 = ''
        this.form.t2 = ''
        this.form.t3 = ''
      }

      if (mark == 't1') {
        this.form.t2 = ''
        this.form.t3 = ''
      }
      if (mark == 't2') {
        this.form.t3 = ''
      }
    },
    /** 查詢星盤結果列表 */
    getList() {
      this.loading = true;
      listChart_data(this.queryParams).then(response => {
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
        title: '',
        subTitle: '',
        content: '',
        tid: '',
        t1: '',
        t2:'',
        t3: '',
        en: {
          title: '',
          subTitle: '',
          content: '',
        },
        tw: {
          title: '',
          subTitle: '',
          content: '',
        },
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
      this.title = "添加星盤結果";
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChart_data(id).then(response => {
        response.data.tid = response.data.tid.toString();
        this.form = response.data;
        this.open = true;
        this.title = "修改星盤結果";
      });
    },
    /** 提交按鈕 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.form.id != undefined) {
            updateChart_data(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.loading = false;
              this.getList();
            });
          } else {
            addChart_data(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.loading = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 刪除按鈕操作 */
    handleDelete(row) {
      const chartIds = row.id || this.ids;
      this.$modal.confirm('是否確認刪除星盤結果編號為"' + chartIds + '"的數據項？').then(function () {
        return delChart_data(chartIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => { });
    },
  }
};
</script>
