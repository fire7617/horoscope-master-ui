<template>
  <div class="app-container home">
    <div>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="權重" name="factor">
          <Factor/>
        </el-tab-pane>
        <el-tab-pane label="運勢分類" name="fortune_type">
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Factor from '@/views/horoscope/factor.vue';
Vue.component('Factor', Factor); 

export default {
  name: "Param",
  data() {
    return {
      activeTab: 'factor',
    };
  },
  created() {

  },
  methods: {
    handleTabClick(tab) {
      // this.$router.push({ name: 'Answer' }); // Navigate to the corresponding route
    },
    components: [
      Factor
    ]
  }
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
