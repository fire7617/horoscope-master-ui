<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="菜單名稱" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="請輸入菜單名稱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="狀態" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜單狀態" clearable>
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
          v-hasPermi="['system:menu:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          :loading="loading"
          :disabled="!menuList.length"
        >{{ isExpandAll ? '摺疊' : '展開' }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="sortedMenuList"
      row-key="menuId"
      :expand-row-keys="expandedKeys"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜單名稱" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="圖標" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="perms" label="權限標識" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="組件路徑" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="狀態" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="創建時間" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜單對話框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上級菜單">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="選擇上級菜單"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜單類型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目錄</el-radio>
                <el-radio label="C">菜單</el-radio>
                <el-radio label="F">按鈕</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜單圖標" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="點擊選擇圖標" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜單名稱" prop="menuName">
              <el-input v-model="form.menuName" placeholder="請輸入菜單名稱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顯示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="選擇是外鏈則路由地址需要以`http(s)://`開頭" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                是否外鏈
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="訪問的路由地址，如：`user`，如外網地址需內鏈訪問則以`http(s)://`開頭" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="請輸入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="訪問的組件路徑，如：`system/user/index`，默認在`views`目錄下" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                組件路徑
              </span>
              <el-input v-model="form.component" placeholder="請輸入組件路徑" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item>
              <el-input v-model="form.perms" placeholder="請輸入權限標識" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定義的權限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                權限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <el-input v-model="form.query" placeholder="請輸入路由參數" maxlength="255" />
              <span slot="label">
                <el-tooltip content='訪問路由的默認傳遞參數，如：`{"id": 1, "name": "ry"}`' placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由參數
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="選擇是則會被`keep-alive`緩存，需要匹配組件的`name`和地址保持一致" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                是否緩存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">緩存</el-radio>
                <el-radio label="1">不緩存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="選擇隱藏則路由將不會出現在側邊欄，但仍然可以訪問" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                顯示狀態
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in dict.type.sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="選擇停用則路由將不會出現在側邊欄，也不能被訪問" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                菜單狀態
              </span>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加版本號顯示 -->
    <div class="version-info">
      <span>v{{ version }}</span>
      <span class="environment-badge">{{ environment }}</span>
    </div>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Menu",
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩層
      loading: true,
      // 顯示搜索條件
      showSearch: true,
      // 菜單表格樹數據
      menuList: [],
      // 菜單樹選項
      menuOptions: [],
      // 彈出層標題
      title: "",
      // 是否顯示彈出層
      open: false,
      // 是否展開，默認全部摺疊
      isExpandAll: false,
      // 重新渲染表格狀態
      refreshTable: true,
      // 查詢參數
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表單參數
      form: {},
      // 表單校驗
      rules: {
        menuName: [
          { required: true, message: "菜單名稱不能為空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜單順序不能為空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能為空", trigger: "blur" }
        ]
      },
      expandedKeys: [], // 當前展開的行的 keys
    };
  },
  computed: {
    sortedMenuList() {
      // 先過濾出頂層菜單（parentId 為 0 的項目）
      const topLevelMenus = this.menuList.filter(menu => menu.parentId === 0);
      // 對頂層菜單按 orderNum 排序
      return topLevelMenus.sort((a, b) => a.orderNum - b.orderNum).map(menu => {
        // 找出該頂層菜單的所有子菜單
        const children = this.menuList
          .filter(item => item.parentId === menu.menuId)
          .sort((a, b) => a.orderNum - b.orderNum);
        
        return {
          ...menu,
          children: children.length > 0 ? children : undefined
        };
      });
    },
    version() {
      return process.env.VERSION || '1.0.0'
    },
    environment() {
      const env = process.env.VUE_APP_MODE || process.env.NODE_ENV
      switch(env) {
        case 'development':
          return 'Dev'
        case 'staging':
          return 'UAT'
        case 'production':
          return 'Prod'
        default:
          return 'Dev'
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    // 確保初始狀態為摺疊
    this.$nextTick(() => {
      this.refreshTable = false;
      setTimeout(() => {
        this.refreshTable = true;
      }, 0);
    });
  },
  methods: {
    // 選擇圖標
    selected(name) {
      this.form.icon = name;
    },
    /** 查詢菜單列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = response.data;
        this.expandedKeys = []; // 確保載入數據後是摺疊狀態
        this.isExpandAll = false; // 重置展開狀態
        this.loading = false;
      });
    },
    /** 轉換菜單數據結構 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查詢菜單下拉樹結構 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: '主類目', children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
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
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0"
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
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜單";
    },
    /** 展開/摺疊操作 */
    toggleExpandAll() {
      const icons = document.querySelectorAll('.el-table__expand-icon');
      icons.forEach(icon => {
        // 如果圖標未展開（不包含 el-table__expand-icon--expanded 類），則點擊它
        if (this.isExpandAll) {
          if (icon.classList.contains('el-table__expand-icon--expanded')) {
            icon.click();
          }
        } else {
          if (!icon.classList.contains('el-table__expand-icon--expanded')) {
            icon.click();
          }
        }
      });
      
      this.isExpandAll = !this.isExpandAll;
    },
    /** 修改按鈕操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改菜單";
      });
    },
    /** 提交按鈕 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            updateMenu(this.form).then(response => {
              this.open = false;
              if(response.code == 200){
                this.$modal.msgSuccess("修改成功");              
                this.getList();
              }else{
                this.$model.msgError(response.message);
              }
            });
          } else {
            addMenu(this.form).then(response => {
              this.open = false;
              if(response.code == 200){
                this.$modal.msgSuccess("新增成功");              
                this.getList();
              }else{
                this.$model.msgError(response.message);
              }
            });
          }
        }
      });
    },
    /** 刪除按鈕操作 */
    handleDelete(row) {
      this.$modal.confirm('是否確認刪除名稱為"' + row.menuName + '"的數據項？').then(function() {
        return delMenu(row.menuId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刪除成功");
      }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.table-expand {
  padding: 0 20px;
}

.version-info {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  color: #909399;
  z-index: 100;

  .environment-badge {
    margin-left: 8px;
    padding: 2px 6px;
    background: rgba(144, 147, 153, 0.1);
    border-radius: 4px;
  }
}
</style>