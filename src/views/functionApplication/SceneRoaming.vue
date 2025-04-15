<template>
  <div class='container'>
    <el-row :gutter='20'>
      <el-col :span='4'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.keyWord' placeholder='根据关键字搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='12'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
              查询
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header'>
      <el-table-column prop='pid' label='PID' width='80' align='center'></el-table-column>
      <el-table-column prop='userid' label='用户ID' align='center'></el-table-column>
      <el-table-column prop='username' label='用户名称' align='center'></el-table-column>
      <el-table-column prop='name' label='漫游名称' align='center'></el-table-column>
      <el-table-column prop='isroute' label='是否显示绘制路线' align='center' :formatter='isrouteFormat'></el-table-column>
      <el-table-column prop='height' label='漫游高度' align='center'></el-table-column>
      <el-table-column prop='speed' label='时速' align='center'></el-table-column>
      <el-table-column prop='angle' label='视角' align='center' :formatter='angleFormat'></el-table-column>
      <el-table-column prop='model' label='漫游模式' align='center' :formatter='modelFormat'></el-table-column>
      <el-table-column label='操作' align='center'>
        <template slot-scope='scope'>
          <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
          </el-button>
        </template>
      </el-table-column>
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
import { getList, del } from '@/api/functionApplication/SceneRoaming-api'
export default {
  name: 'sceneRoaming',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        keyWord: '',
        page: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  computed: {},
  mounted() {
  },
  created() {
    this.queryList();
  },
  methods: {
    isrouteFormat(row, column) {
      if (row == 1) {
        return '显示';
      } else {
        return '不显示';
      }
    },
    angleFormat(row, column) {
      if (row == 1) {
        return '跟随视角';
      } else {
        return '第一人称视角';
      }
    },
    modelFormat(row, column) {
      if (row == 1) {
        return '飞机';
      } else if (row == 2) {
        return '汽车';
      } else {
        return '行人';
      }
    },
    queryList() {
      getList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    buttonQueryList() {
      this.queryParam.page = 1;
      getList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
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
    // 删除数据
    handleDelete(row) {
      this.$confirm('确认删除PID为 ' + row.pid + ' 的数据？', '提示', {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(_ => {
        del(row.pid).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功！');
            this.queryList();
          } else {
            this.$message.error('删除失败！');
          }
        });
      }).catch(_ => {
        console.log('取消删除！');
      });
    }
  }
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.background {
  background-color: white;
}

.el-cascader {
  width: 350px;
}
</style>