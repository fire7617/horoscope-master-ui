<template>
  <div class="app-container home">
    <div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-statistic group-separator="," :value="totalMember" title="總會員數">
              <template slot="prefix">
                <i class="el-icon-star-on" style="color: red"></i>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic group-separator="," decimal-separator="." :value="tryoutMember" title="總試用數">
              <template slot="prefix">
                <i class="el-icon-s-flag" style="color: blue"></i>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic group-separator="," :value="orderMember" title="總訂閱數">
              <template slot="prefix">
                <i class="el-icon-s-order" style="color: greenyellow"></i>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="今日" name="now">
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," :value="dateMemeber.news" title="新增會員數">
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," decimal-separator="." :value="dateMemeber.tries" title="新增試用數">
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," :value="dateMemeber.finishs" title="過試用數">
                </el-statistic>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="本週" name="week">
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," :value="dateMemeber.news" title="新增會員數">
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," decimal-separator="." :value="dateMemeber.tries" title="新增試用數">
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," :value="dateMemeber.finishs" title="過試用數">
                </el-statistic>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>

export default {
  name: "Index",
  data() {
    return {
      totalMember: 0,
      tryoutMember: 0,
      orderMember: 0,
      activeTab: 'now',
      dateMemeber: {
        news: 0,
        tries: 0,
        finishs: 0,
      }
    };
  },
  created() {

  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      //todo 請求對應的數據
    }
  },
};
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.box-card {
  background-color: #1574de;
  color: #fff;
  width: 100%;
  height: 100px;
}

.box-title {
  font-size: 18px;
  text-align: center;
}

.box-number {
  font-size: 24px;
  text-align: center;
}

.row-title {
  margin-top: 20px;
  margin-bottom: 10px
}
</style>
