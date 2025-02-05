<template>
  <div class="app-container">

      <!--用戶數據-->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="用戶名稱" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="請輸入用戶名稱"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="狀態" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用戶狀態"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
              v-hasPermi="['system:user:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
            >刪除</el-button>
          </el-col>          
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用戶編號" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
          <el-table-column label="用戶名稱" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="郵箱" align="center" key="email" prop="email" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="狀態" align="center" key="status" v-if="columns[3].visible">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="創建時間" align="center" prop="createTime" v-if="columns[4].visible" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >刪除</el-button>
              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                    v-hasPermi="['system:user:resetPwd']">重置密碼</el-dropdown-item>
                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />


    <!-- 添加或修改用戶配置對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用戶名" prop="userName">
              <el-input v-model="form.userName" placeholder="請輸入用戶名" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="郵箱" prop="email">
              <el-input v-model="form.email" placeholder="請輸入郵箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
 
        <el-row>
          <el-col :span="12">
            <el-form-item label="狀態">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="請選擇角色">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>          
        </el-row>        
        <el-row>
          <el-col :span="24">
            <el-form-item label="備註">
              <el-input v-model="form.remark" type="textarea" placeholder="請輸入內容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用戶導入對話框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">將文件拖到此處，或<em>點擊上傳</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已經存在的用戶數據
          </div>
          <span>僅允許導入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下載模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">確 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: { Treeselect },
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
      // 用戶表格數據
      userList: null,
      // 彈出層標題
      title: "",
      // 是否顯示彈出層
      open: false,
      // 默認密碼
      initPassword: "123456",
      // 日期範圍
      dateRange: [],
      // 角色選項
      roleOptions: [],
      // 表單參數
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用戶導入參數
      upload: {
        // 是否顯示彈出層（用戶導入）
        open: false,
        // 彈出層標題（用戶導入）
        title: "",
        // 是否禁用上傳
        isUploading: false,
        // 是否更新已經存在的用戶數據
        updateSupport: 0,
        // 設置上傳的請求頭部
        headers: { Authorization: "Bearer " + getToken() },
        // 上傳的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查詢參數
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        email: undefined,
        status: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用戶編號`, visible: true },
        { key: 1, label: `用戶名稱`, visible: true },
        { key: 2, label: `郵箱`, visible: true },
        { key: 3, label: `狀態`, visible: true },
        { key: 4, label: `創建時間`, visible: true }
      ],
      // 表單校驗
      rules: {
        email: [
          {
            type: "email",
            message: "請輸入正確的郵箱地址",
            trigger: ["blur", "change"]
          }
        ],
      }
    };
  },
  watch: {
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查詢用戶列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 用戶狀態修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "啟用" : "停用";
      this.$modal.confirm('確認要"' + text + '""' + row.userName + '"用戶嗎？').then(function() {
        return changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
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
        userId: undefined,
        userName: undefined,
        password: undefined,
        email: undefined,
        status: "0",
        remark: undefined,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多選框選中數據
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作觸發
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 新增按鈕操作 */
    handleAdd() {
      this.reset();
      getUser().then(response => {
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用戶";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.roleOptions = response.roles;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改用戶";
        this.form.password = "";
      });
    },
    /** 重置密碼按鈕操作 */
    handleResetPwd(row) {
      this.$prompt('請輸入"' + row.userName + '"的新密碼', "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用戶密碼長度必須介於 5 和 20 之間"
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.$modal.msgSuccess("修改成功，新密碼是：" + value);
          });
        }).catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按鈕 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.open = false;
              if(response.code == 200){
                this.$modal.msgSuccess("修改成功");                
                this.getList();
              }else{
                this.$modal.msgError(response.message);
              }
            });
          } else {
            addUser(this.form).then(response => {
              this.open = false;
              if(response.code == 200){
                this.$modal.msgSuccess("新增成功");                
                this.getList();
              }else{
                this.$modal.msgError(response.message);
              }
            });
          }
        }
      });
    },
    /** 刪除按鈕操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal.confirm('是否確認刪除用戶編號為"' + userIds + '"的數據項？').then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => {});
    },
    /** 導出按鈕操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 導入按鈕操作 */
    handleImport() {
      this.upload.title = "用戶導入";
      this.upload.open = true;
    },
    /** 下載模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上傳中處理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上傳成功處理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "導入結果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上傳文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>