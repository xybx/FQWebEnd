<template>
  <div class='container'>
    <div style='width: 70%'>
      <el-row :gutter='20'>

        <el-col :span='4'>
          <el-select v-model='queryParam.firstClass' placeholder='请选择一级类'>
            <el-option
                v-for='item in options'
                :key='item.value'
                :label='item.label'
                :value='item.value'>
            </el-option>
          </el-select>
        </el-col>

        <el-col :span='4'>
          <el-select v-model='queryParam.secondClass' placeholder='请选择二级类'>
            <el-option
                v-for='item in options'
                :key='item.value'
                :label='item.label'
                :value='item.value'>
            </el-option>
          </el-select>
        </el-col>

        <el-col :span='8'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keywords' placeholder='根据项目分类进行关键词搜索'></el-input>
            </div>
          </div>
        </el-col>

        <el-col :span='2'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-search' class='handle-del mr10'
                         @click='buttonQueryHistoryprjList'>
                搜索
              </el-button>
            </div>
          </div>
        </el-col>

      </el-row>

      <el-row :gutter='20'>
        <el-col :span='3'>
          <span>
            总数量 {{ total }} 个
          </span>
        </el-col>
        <el-col :span='3'>
          <span>
            异常服务 0 个
          </span>
        </el-col>
        <el-col :span='4'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' :plain='selectA' icon='el-icon-bottom' class='handle-del mr10'
                         @click='handleSort(1)'>
                按请求次数排序
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span='4'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' :plain='selectB' icon='el-icon-bottom' class='handle-del mr10'
                         @click='handleSort(2)'>
                按响应时长排序
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header'>
      <el-table-column prop='pid' label='PID' align='center'></el-table-column>
      <el-table-column prop='productName' label='产品名称' align='center'></el-table-column>
      <el-table-column prop='productLevel' label='产品级别' align='center'></el-table-column>
      <el-table-column prop='dateCreateTime' label='生产日期' align='center'></el-table-column>
      <el-table-column prop='productBrief' label='产品摘要' align='center'></el-table-column>
      <el-table-column prop='type' label='格式类型' width='230' align='center'></el-table-column>
      <el-table-column label='操作' align='center'>
        <template slot-scope='scope'>
          <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
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
  name: 'serviceMonitor',
  data() {
    return {
      tableData: [
        {
          pid: '1',
          productName: '2022ArcGIS影像图测试',
          productLevel: '1',
          dateCreateTime: '2023-05-26',
          productBrief: '2023年初发布的测试服务',
          type: 'ArcGIS'
        },
        {
          pid: '2',
          productName: '2022ArcGIS影像图测试',
          productLevel: '1',
          dateCreateTime: '2022-07-03',
          productBrief: '2022年7月发布的测试服务',
          type: 'ArcGIS'
        }
      ],
      // 查询数据
      queryParam: {
        firstClass: undefined,
        secondClass: undefined,
        keywords: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 2,
      options: [{
        value: '选项1',
        label: 'arcgis'
      }, {
        value: '选项2',
        label: 'geoscene'
      }, {
        value: '选项3',
        label: 'supermap'
      }, {
        value: '选项4',
        label: '其他'
      }],
      selectA: false,
      selectB: true
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
    handleSort(type) {
      if (type == 1) {
        this.selectA = false;
        this.selectB = true;
      } else {
        this.selectA = true;
        this.selectB = false;
      }
    }
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