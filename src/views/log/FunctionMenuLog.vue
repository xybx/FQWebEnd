<template>
  <div class='container'>
    <div>
      <el-row :gutter='20'>
        <el-col :span='5.5'>
          <div class='grid-content bg-purple'>
            <el-date-picker
                v-model='dateValue'
                type='datetimerange'
                value-format='yyyy-MM-dd HH:mm:ss'
                range-separator='至'
                start-placeholder='访问起始时间'
                end-placeholder='访问结束时间'>
            </el-date-picker>
          </div>
        </el-col>

        <el-col :span='3'>
          <div class='grid-content bg-purple'>
            <el-select v-model='queryParam.officeId' clearable placeholder='请选择部门'>
              <el-option
                  v-for='(item, index) in departOptions'
                  :key='item.pid'
                  :label='item.name'
                  :value='item.pid'
              ></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span='5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='queryUseRankData'>
                查询
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class='rank'>
      <el-row>
        <el-col :span='24' v-loading='useRankLoading'>
          <div id='useRank' />
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { queryUseRank } from '@/api/log/FunctionMenuLog-api';
import { getAllDepts } from '@/api/login-api';

export default {
  name: 'functionMenuLog',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        startTime: undefined,
        endTime: undefined,
        userName: undefined,
        officeId: undefined
      },
      dateValue: [],
      useRankLoading: false,
      useRankNameList: [],
      useRankDataList: [],
      departOptions: []
    };
  },
  computed: {},
  mounted() {
    this.getDepart();
    this.queryUseRankData();
  },
  created() {

  },
  methods: {
    queryUseRankData() {
      this.useRankLoading = true;
      if (this.dateValue != null) {
        if (this.dateValue.length > 0) {
          this.queryParam.startTime = this.dateValue[0];
          this.queryParam.endTime = this.dateValue[1];
        }
      } else {
        this.queryParam.startTime = undefined;
        this.queryParam.endTime = undefined;
      }
      queryUseRank(this.queryParam).then(res => {
        if (res.code == 200) {
          this.useRankNameList = [];
          this.useRankDataList = [];
          if (res.data.length > 0) {
            res.data.forEach(item => {
              this.useRankNameList.push(item.functionName);
              this.useRankDataList.push(item.useCount);
            });
          }
          let useRankDom = document.getElementById('useRank');
          let myUseRank = this.$echarts.init(useRankDom);
          let option = {
            title: {
              text: '功能菜单使用量排行'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },

            xAxis: {
              type: 'category',
              data: this.useRankNameList,
              axisLabel: {
                rotate: -45
              }
            },
            yAxis: {
              type: 'value',
              minInterval: 1
            },
            series: [
              {
                type: 'bar',
                data: this.useRankDataList
              }
            ]
          };

          option && myUseRank.setOption(option);
        }
        this.useRankLoading = false;
      });
    },
    getDepart() {
      getAllDepts().then(res => {
        if (res.code === 200) {
          this.departOptions = res.data;
        }
      });
    }
  }
};
</script>
<style lang='scss'>
.rank {
  margin-top: 30px;

  .el-row {
    display: flex;
    flex: 1;
    min-height: 100%;

    .el-col {
      min-height: 100%;

      #useRank {
        display: flex;
        flex: 1;
        width: 100%;
        height: 700px;
      }
    }
  }
}


:last-child {
  margin-bottom: 0;
}


.bg-purple-dark {
  background: #99a9bf;
}


.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>