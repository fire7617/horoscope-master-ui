<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用戶名稱" prop="userName">
            <el-input  v-model="form.userName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="用戶備註" prop="remark">
            <el-input v-model="form.remark" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <el-table v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="table" @selection-change="handleSelectionChange" :data="roles.slice((pageNum-1)*pageSize,pageNum*pageSize)">
      <el-table-column label="序號" type="index" align="center">
        <template slot-scope="scope">
          <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column label="角色編號" align="center" prop="roleId" />
      <el-table-column label="角色名稱" align="center" prop="roleName" />
      <el-table-column label="權限字符" align="center" prop="roleKey" />
      <el-table-column label="創建時間" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />

    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <!-- <el-button @click="close()">返回</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAuthRole, updateAuthRole } from "@/api/system/user";

export default {
  name: "AuthRole",
  data() {
    return {
       // 遮罩層
      loading: true,
      // 分頁信息
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 選中角色編號
      roleIds:[],
      // 角色信息
      roles: [],
      // 用戶信息
      form: {}
    };
  },
  created() {
    const userId = this.$route.params && this.$route.params.userId;
    if (userId) {
      this.loading = true;
      getAuthRole(userId).then((response) => {
        this.form = response.user;
        this.roles = response.roles;
        this.total = this.roles.length;
        this.$nextTick(() => {
          this.roles.forEach((row) => {
            if (row.flag) {
              this.$refs.table.toggleRowSelection(row);
            }
          });
        });
        this.loading = false;
      });
    }
  },
  methods: {
    /** 單擊選中行數據 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多選框選中數據
    handleSelectionChange(selection) {
      this.roleIds = selection.map((item) => item.roleId);
    },
    // 保存選中的數據編號
    getRowKey(row) {
      return row.roleId;
    },
    /** 提交按鈕 */
    submitForm() {
      const userId = this.form.userId;
      const roleIds = this.roleIds.join(",");
      updateAuthRole({ userId: userId, roleIds: roleIds }).then((response) => {
        this.$modal.msgSuccess("授權成功");
        this.close();
      });
    },
    /** 關閉按鈕 */
    close() {
      //const obj = { path: "/system/user" };
      //this.$tab.closeOpenPage(obj);
    },
  },
};
</script>