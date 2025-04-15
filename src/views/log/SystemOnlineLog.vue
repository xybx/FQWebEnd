<template>
  <div class='container'>
    <div >
      <el-row :gutter='20'>
        <el-col :span='1.5'>
          <span>
            访问时间:
          </span>
        </el-col>
        <el-col :span='6'>
          <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-col>

        <el-col :span='1.5'>
          <span>
            用户名:
          </span>
        </el-col>
        <el-col :span='5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keywords' placeholder='根据用户名搜索'></el-input>
            </div>
          </div>
        </el-col>

        <el-col :span='10'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryHistoryprjList'>
                搜索
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header'>
      <el-table-column prop='pid' label='PID' align='center'></el-table-column>
      <el-table-column prop='ip' label='部门' align='center'></el-table-column>
      <el-table-column prop='machineName' label='用户名' align='center'></el-table-column>
      <el-table-column prop='cpu' label='IP' align='center'></el-table-column>
      <el-table-column prop='memory' label='时间' align='center'></el-table-column>
      <el-table-column prop='storageSpace' label='事件' width='230' align='center'></el-table-column>
      <el-table-column label='操作' align='center'>
        <template slot-scope='scope'>
          <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
          <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination'>
      <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                     :current-page='queryParam.pageNum'
                     :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                     :total='total'>
      </el-pagination>
    </div>

  </div>
</template>

<script>

export default {
  name: 'systemOnlineLog',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        firstClass: undefined,
        secondClass: undefined,
        keywords: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      value1: '',
      value2: ''
    };
  },
  computed: {
    // 上传时需要的请求头
    headers() {
      const token = sessionStorage.getItem('token');
      return {
        Authorization: token
      };
    }
  },
  mounted() {
  },
  created() {

  },
  methods: {

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