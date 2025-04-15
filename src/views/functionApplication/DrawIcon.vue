<template>
  <div class='container'>
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane label="项目名称" name="name">
      </el-tab-pane>
      <el-tab-pane label="图标信息" name="info">
      </el-tab-pane>

    </el-tabs>

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

    <div v-if="type == 'name'">
      <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='pid' label='PID' width='80' align='center'></el-table-column>
        <el-table-column prop='userid' label='用户ID' align='center'></el-table-column>
        <el-table-column prop='username' label='用户名称' align='center'></el-table-column>
        <el-table-column prop='name' label='项目名称' align='center'></el-table-column>
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

    <div v-if="type == 'info'">
      <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='iconname' label='图标名称' align='center'></el-table-column>
        <el-table-column prop='graphicpoints' label='图形信息' align='center'></el-table-column>
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

  </div>
</template>

<script>
import { getList, del, existChildData, getListIcon } from '@/api/functionApplication/DrawIcon-api'
export default {
  name: 'sceneRoaming',
  data() {
    return {
      type: 'name',
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
    handleClick() {
      this.queryParam.page = '1';
      this.queryParam.keyWord = '';
      this.queryList()
    },
    queryList() {
      if (this.type == 'name') {
        getList(this.queryParam).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else {
        getListIcon(this.queryParam).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        });
      }

    },
    buttonQueryList() {
      this.queryParam.page = 1;
      if (this.type == 'name') {
        getList(this.queryParam).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else {
        getListIcon(this.queryParam).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        });
      }
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
        if (this.type == 'name') {
          // 校验是否存在子数据
          existChildData(row.pid).then(res => {
            if (res.code == 200) {
              if (res.data == true) {
                this.$confirm('此项目存在子项数据，不能删除！', '提示', {
                  confirmButtonText: "确定",
                  type: "warning"
                });
                return
              } else {
                del(row.pid).then(res2 => {
                  if (res2.code == 200) {
                    this.$message.success('删除成功！');
                    this.queryList();
                  } else {
                    this.$message.error('删除失败！');
                  }
                });
              }
            }
          })
        } else {
          del(row.pid).then(res2 => {
            if (res2.code == 200) {
              this.$message.success('删除成功！');
              this.queryList();
            } else {
              this.$message.error('删除失败！');
            }
          });
        }
      }).catch(_ => {
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