<template>
  <div class='container'>
    <!--  TODO 未具体实现页面功能，只是先需要有这个东西  -->
    <div style='width: 50%'>
      <el-row :gutter='20'>

        <el-col :span='8'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keywords' placeholder='根据项目分类进行关键词搜索'></el-input>
            </div>
          </div>
        </el-col>

        <el-col :span='4'>
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
      <el-table-column prop='productName' label='部门名称' align='center'></el-table-column>
      <el-table-column prop='productLevel' label='用户名称' align='center'></el-table-column>
      <el-table-column prop='dateCreateTime' label='产品名称' align='center'></el-table-column>
      <el-table-column prop='productBrief' label='申请公函' align='center'></el-table-column>
      <el-table-column prop='type' label='申请说明' align='center'></el-table-column>
      <el-table-column prop='typea' label='申请时间' align='center'></el-table-column>
      <el-table-column prop='typeb' label='授权范围' align='center'></el-table-column>
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
  name: 'serverApply',
  data() {
    return {
      tableData: [
        {
          pid: '1',
          productName: '测试部门',
          productLevel: '王xx',
          dateCreateTime: '影像图',
          productBrief: '请联系具体用户人员',
          type: '这是一个测试申请，可以随时删除',
          typea: '2024-12-26',
          typeb: '科室内部',
        }
      ],
      // 查询数据
      queryParam: {
        keywords: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 1,
      options: [{
        value: '选项1',
        label: '分类1'
      }, {
        value: '选项2',
        label: '分类2'
      }, {
        value: '选项3',
        label: '分类3'
      }, {
        value: '选项4',
        label: '分类4'
      }, {
        value: '选项5',
        label: '分类5'
      }],
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