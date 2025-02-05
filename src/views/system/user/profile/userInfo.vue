<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="郵箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="用戶備註" prop="remark">
      <el-input v-model="user.remark" maxlength="30" />
    </el-form-item> 
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">關閉</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 表單校驗
      rules: {
        email: [
          { required: true, message: "郵箱地址不能為空", trigger: "blur" },
          {
            type: "email",
            message: "請輸入正確的郵箱地址",
            trigger: ["blur", "change"]
          }
        ],
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
