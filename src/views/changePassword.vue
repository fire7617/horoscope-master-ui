<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">星座後臺管理系統</h3>
      <el-form-item prop="username">
        <el-input v-model="user.userName" type="text" auto-complete="off" placeholder="帳號" disabled>
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          placeholder="密碼"
          @keyup.enter.native="handleChangePassword"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          auto-complete="off"
          placeholder="確認密碼"
          @keyup.enter.native="handleChangePassword"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
     
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleChangePassword"
        >
          <span v-if="!loading">修 改</span>
          <span v-else>修 改 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/'">跳過</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2021 Talkmate by CFD (全富數位有限公司)</span>
    </div>
  </div>
</template>

<script>
import { resetSelfPwd } from "@/api/system/user";
import { getUserProfile } from "@/api/system/user";
export default {
  name: "changePassword",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("兩次輸入的密碼不一致"));
      } else {
        callback();
      }
    };
    return {
      user: {},
      codeUrl: "",
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        uuid: ""
      },
      registerRules: {
        password: [
          { required: true, trigger: "blur", message: "請輸入您的密碼" },
          { min: 5, max: 20, message: '用戶密碼長度必須介於 5 和 20 之間', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "請再次輸入您的密碼" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        code: [{ required: true, trigger: "change", message: "請輸入驗證碼" }]
      },
      loading: false,
      captchaEnabled: true
    };
  },
  created() {
    this.getUser();
  },
  methods: {
   getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
      });
    },
    handleChangePassword() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          resetSelfPwd(this.registerForm.password).then(res => {
            this.$alert("<font color='red'>恭喜你，您的密碼修改成功！</font>", '系統提示', {
              dangerouslyUseHTMLString: true,
              type: 'success'
            }).then(() => {
              this.$router.push("/");
            }).catch(() => {});
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.register-code-img {
  height: 38px;
}
</style>
