<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" inline v-show="showSearch" label-width="68px">
      <el-form-item label="關鍵字" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="請輸入關鍵字"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:direction:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="directionList" @selection-change="handleSelectionChange">
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="圖示預覽" align="center" width="100">
        <template slot-scope="scope">
          <el-image 
            style="width: 30px; height: 30px; border-radius: 4px;"
            :src="getImageUrl(scope.row.key)"
            :preview-src-list="[getImageUrl(scope.row.key)]"
          >
            <div slot="error" class="image-error-slot">
              <i class="el-icon-picture-outline" style="font-size: 20px; color: #909399;"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="英文名稱" align="center" prop="en" />
      <el-table-column label="中文名稱" align="center" prop="tw" />
      <el-table-column label="Key" align="center" prop="key" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:direction:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="delete-btn"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:direction:remove']"
          >刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Key" prop="key">
          <el-input v-model="form.key" placeholder="請輸入 Key" />
        </el-form-item>
        <el-form-item label="英文名稱" prop="en">
          <el-input v-model="form.en" placeholder="請輸入英文名稱" />
        </el-form-item>
        <el-form-item label="中文名稱" prop="tw">
          <el-input v-model="form.tw" placeholder="請輸入中文名稱" />
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
import { listDirection, getDirection, delDirection, addDirection, updateDirection } from "@/api/question/direction";

export default {
  name: "Direction",
  data() {
    return {
      // 遮罩層
      loading: true,
      // 顯示搜索條件
      showSearch: true,
      // 圖示表格數據
      directionList: [],
      // 彈出層標題
      title: "",
      // 是否顯示彈出層
      open: false,
      // 查詢參數
      queryParams: {
        keyword: undefined
      },
      // 表單參數
      form: {
        id: undefined,
        type: 'direction',  // 固定值
        key: undefined,
        en: undefined,
        tw: undefined
      },
      // 表單校驗
      rules: {
        key: [
          { required: true, message: "Key 不能為空", trigger: "blur" }
        ],
        en: [
          { required: true, message: "英文名稱不能為空", trigger: "blur" }
        ],
        tw: [
          { required: true, message: "中文名稱不能為空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查詢圖示列表 */
    getList() {
      this.loading = true;
      listDirection(this.queryParams).then(response => {
        console.log('API 回應資料:', response); // 檢查 API 回應
        this.directionList = response.rows || [];
        this.loading = false;
      }).catch(() => {
        this.directionList = [];
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
        type: 'direction',
        key: '',
        en: '',
        tw: ''
      };
      this.resetForm("form");
    },
    /** 搜索按鈕操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按鈕操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按鈕操作 */
    handleAdd() {
      this.reset();
      this.form = {
        type: 'direction',
        key: '',
        en: '',
        tw: ''
      };
      this.open = true;
      this.title = "添加圖示";
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDirection(id).then(response => {
        this.form = {
          ...response.data,
          type: 'direction'  // 確保 type 值正確
        };
        this.open = true;
        this.title = "修改圖示";
      });
    },
    /** 提交按鈕 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 確保提交時包含所有必要欄位，包括 key
          const submitData = {
            type: 'direction',
            key: this.form.en.toLowerCase(), // 使用英文名稱的小寫作為 key
            en: this.form.en,
            tw: this.form.tw
          };
          
          console.log('提交的資料:', submitData); // 檢查提交的資料結構
          
          if (this.form.id != undefined) {
            submitData.id = this.form.id;  // 如果是編輯才加入 id
            updateDirection(submitData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDirection(submitData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 刪除按鈕操作 */
    handleDelete(id) {
      this.$modal.confirm('是否確認刪除該圖示？').then(() => {
        return delDirection(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => {});
    },
    // 新增方法用於取得圖片路徑
    getImageUrl(key) {
      // 檢查 key 值
      console.log('當前 key:', key);
      
      // 檢查 API URL，移除結尾的斜線
      const baseUrl = (process.env.VUE_APP_API_URL || window.location.origin).replace(/\/$/, '');
      console.log('baseUrl:', baseUrl);
      
      // 組合完整 URL
      const imageUrl = `${baseUrl}/icon/${key}.png`;
      console.log('完整圖片路徑:', imageUrl);
      
      return imageUrl;
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.delete-btn {
  color: #f56c6c !important;  /* 使用 Element UI 的危險紅色 */
  font-weight: 500;  /* 稍微加粗 */
  margin-left: 10px;  /* 與修改按鈕保持一定距離 */
}

.delete-btn:hover {
  color: #ff4949 !important;  /* hover 時的顏色 */
  background-color: #fef0f0;  /* hover 時的背景色 */
  border-radius: 2px;  /* 輕微圓角 */
}
</style> 