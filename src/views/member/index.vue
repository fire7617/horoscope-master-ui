<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="會員帳號" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="請輸入會員帳號" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="會員名稱" prop="nickname">
        <el-input v-model="queryParams.nickname" placeholder="請輸入會員名稱" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:member:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:member:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:member:remove']">刪除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="暱稱" align="center" prop="nickname" />
      <el-table-column label="郵箱" align="center" prop="email" />

      <el-table-column label="性別" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex == 0 ? '男' : '女' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="血型" align="center">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.bloodType == 0 ? 'A' :
                scope.row.bloodType == 1 ? 'B' :
                  scope.row.bloodType == 2 ? 'AB' :
                    scope.row.bloodType == 3 ? 'O' :
                      '不確定'
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="學業狀態" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.educationStatus == 0 ? '在學' : '畢業' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="工作狀態" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workStatus == 0 ? '在職' : '待業' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="感情狀態" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.relationshipStatus == 0 ? '單身' : '已婚' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="出生地點" align="center" prop="birthLocation" />
      <el-table-column label="出生時間" align="center" prop="birthday">
        <template slot-scope="scope">
          <span>{{ scope.row.birthDate + '\n' + scope.row.birthTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="註冊時間" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:member:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:member:remove']">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="會員帳號" prop="userName">
          <el-input v-model="form.userName" placeholder="請輸入會員帳號" />
        </el-form-item>
        <el-form-item label="會員名稱" prop="nickname">
          <el-input v-model="form.nickname" placeholder="請輸入會員名稱" />
        </el-form-item>
        <el-form-item label="會員郵箱" prop="email">
          <el-input v-model="form.email" placeholder="請輸入會員郵箱" />
        </el-form-item>

        <el-form-item label="家庭地點" prop="location">
          <el-input v-model="form.location" placeholder="請輸入家庭地點" />
        </el-form-item>

        <el-form-item label="出生地點" prop="birthLocation">
          <el-input v-model="form.birthLocation" placeholder="請輸入出生地點" />
        </el-form-item>

        <el-form-item label="會員星座" prop="zodiacSign">
          <el-select v-model="form.zodiacSign" placeholder="請選擇星座">
            <el-option v-for="sign in zodiacSigns" :key="sign.id" :label="sign.name_zh" :value="sign.name_zh">
              {{ sign.name_zh }}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker v-model="form.birthDate" type="date" placeholder="請選擇出生日期" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="出生時間" prop="birthTime">
          <el-time-picker v-model="form.birthTime" type="time" placeholder="請選擇出生時間" value-format="HH:mm"
            format="HH:mm" />
        </el-form-item>

        <el-form-item label="會員性別" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="'0'">男</el-radio>
            <el-radio :label="'1'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="會員血型" prop="bloodType">
          <el-select v-model="form.bloodType" placeholder="請選擇血型">
            <el-option :label="'A'" :value="'0'"></el-option>
            <el-option :label="'B'" :value="'1'"></el-option>
            <el-option :label="'AB'" :value="'2'"></el-option>
            <el-option :label="'O'" :value="'3'"></el-option>
            <el-option :label="'不確定'" :value="'4'"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="學業狀態" prop="educationStatus">
          <el-select v-model="form.educationStatus" placeholder="請選擇學業狀態">
            <el-option :label="'在學'" :value="'0'"></el-option>
            <el-option :label="'畢業'" :value="'1'"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工作狀態" prop="workStatus">
          <el-select v-model="form.workStatus" placeholder="請選擇工作狀態">
            <el-option :label="'在職'" :value="'0'"></el-option>
            <el-option :label="'待業'" :value="'1'"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="感情狀態" prop="relationshipStatus">
          <el-select v-model="form.relationshipStatus" placeholder="請選擇感情狀態">
            <el-option :label="'單身'" :value="'0'"></el-option>
            <el-option :label="'已婚'" :value="'1'"></el-option>
          </el-select>
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
import { listMember, getMember, delMember, addMember, updateMember } from "@/api/member/member";

export default {
  name: "Member",
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
      // 會員表格數據
      memberList: [],
      // 彈出層標題
      title: "",
      // 是否顯示彈出層
      open: false,
      // 查詢參數
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        nickname: undefined
      },
      // 表單參數
      form: {},
      // 表單校驗
      rules: {
        userName: [
          { required: true, message: "會員帳號不能為空", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "會員名稱不能為空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "會員郵箱不能為空", trigger: "blur" }
        ]
      },
      zodiacSigns: [
        { id: 1, name: 'Aries', name_zh: '白羊座' },
        { id: 2, name: 'Taurus', name_zh: '金牛座' },
        { id: 3, name: 'Gemini', name_zh: '雙子座' },
        { id: 4, name: 'Cancer', name_zh: '巨蟹座' },
        { id: 5, name: 'Leo', name_zh: '獅子座' },
        { id: 6, name: 'Virgo', name_zh: '處女座' },
        { id: 7, name: 'Libra', name_zh: '天秤座' },
        { id: 8, name: 'Scorpio', name_zh: '天蠍座' },
        { id: 9, name: 'Sagittarius', name_zh: '射手座' },
        { id: 10, name: 'Capricorn', name_zh: '摩羯座' },
        { id: 11, name: 'Aquarius', name_zh: '水瓶座' },
        { id: 12, name: 'Pisces', name_zh: '雙魚座' }
      ]

    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查詢會員列表 */
    getList() {
      this.loading = true;
      listMember(this.queryParams).then(response => {
        this.memberList = response.rows;
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
        userName: undefined,
        nickname: undefined,
        email: undefined,
        birthDate: undefined,
        birthTime: undefined,
        sex: undefined,
        birthLocation: undefined,
        bloodType: undefined,
        educationStatus: undefined,
        workStatus: undefined,
        relationshipStatus: undefined,
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
      this.title = "添加會員";
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMember(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改會員";
      });
    },
    /** 提交按鈕 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMember(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMember(this.form).then(response => {
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
      const memberIds = row.id || this.ids;
      this.$modal.confirm('是否確認刪除會員編號為"' + memberIds + '"的數據項？').then(function () {
        return delMember(memberIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => { });
    },
  }
};
</script>
