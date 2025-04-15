<template>
  <div class='container'>
    <div >
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
            <el-input v-model='queryParam.userName' placeholder='根据用户名称模糊搜索'></el-input>
          </div>
        </el-col>

        <el-col :span='3'>
          <div class='grid-content bg-purple'>
            <el-input v-model='queryParam.layerName' placeholder='根据专题名称模糊搜索'></el-input>
          </div>
        </el-col>

        <el-col :span='5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
                查询
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header' v-loading="loading">
      <el-table-column type='index' :index='indexMethod' label='序号' align='center' width='100'></el-table-column>
      <el-table-column prop='ip' label='ip' align='center'></el-table-column>
      <el-table-column prop='userName' label='用户名' align='center'></el-table-column>
      <el-table-column prop='officeName' label='部门' align='center'></el-table-column>
      <el-table-column prop='createTime' label='访问时间' align='center'></el-table-column>
      <el-table-column prop='layerName' label='专题名称' align='center'></el-table-column>

    </el-table>
    <div class='pagination'>
      <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                     :current-page='queryParam.page'
                     :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                     :total='total'>
      </el-pagination>
    </div>

  </div>
</template>

<script>
import {queryPageApi} from '@/api/log/SpecialTopicVisitLog-api'
export default {
  name: 'specialTopicVisitLog',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        startDate: undefined,
        endDate: undefined,
        userName: undefined,
        layerName: undefined,
        page: 1,
        pageSize: 10
      },
      total: 0,
      value1: '',
      value2: '',
      dateValue:[],
      loading: false
    };
  },
  computed: {

  },
  mounted() {
    this.queryList();
  },
  created() {

  },
  methods: {
    buttonQueryList() {
      this.queryParam.page = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      if (this.dateValue != null) {
        if (this.dateValue.length > 0) {
          this.queryParam.startDate = this.dateValue[0];
          this.queryParam.endDate = this.dateValue[1];
        }
      } else {
        this.queryParam.startDate = undefined;
        this.queryParam.endDate = undefined;
      }
      queryPageApi(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
        this.loading = false;
      })
    },
    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      this.queryList();
    },
    indexMethod(index) {
      return index + 1;
    },
  }
};
</script>
<style>
.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
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