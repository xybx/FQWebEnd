<template>
  <div class='container'>
    <el-row :gutter='20'>
      <el-col :span='4'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.serverName' clearable placeholder='根据服务名称关键字搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='12'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
              查询
            </el-button>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header'>
      <el-table-column prop='name' label='服务名称' align='center'></el-table-column>
      <el-table-column prop='url' label='服务地址' align='center'></el-table-column>
      <el-table-column prop='serial' label='排序' align='center' width='150px'></el-table-column>
      <el-table-column label='操作' align='center'>
        <template slot-scope='scope'>
          <el-button type='text' class='blue' icon='el-icon-edit' confirm @click='handleEdit(scope.row)'>
            编辑
          </el-button>
          <el-button type='text' class='red' style='color: red' icon='el-icon-delete' confirm
                     @click='handleDelete(scope.row)'>
            删除
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

    <el-dialog
        :title='addTitle'
        :visible.sync='addFlag'
        width='25%'
        custom-class='set-dialog'
        destroy-on-close
        :before-close='handleClose'>

      <el-form ref='addForm' :model='dataForm' :rules='dataFormRules' label-width='auto'>
        <el-form-item label='服务' prop='serverId'>
          <el-select v-model="dataForm.serverId" filterable  placeholder="请选择服务">
            <el-option
                v-for="item in serverList"
                :key="item.PID"
                :label="item.NAME"
                :value="item.PID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="serial">
          <el-input-number v-model="dataForm.serial" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addFlag = false'>取 消</el-button>
                <el-button :loading='addLoading' type='primary' @click='save()'>确 定</el-button>
            </span>

    </el-dialog>

  </div>
</template>

<script>
import { getList, del, edit, add, queryThreeDimensionalityServer } from '@/api/functionApplication/CityDesign-api';

export default {
  name: 'analysisServe',
  data() {
    return {
      dataForm: {
        pid: undefined,
        serverId: undefined,
        serial: 0
      },
      dataFormCopy: {
        pid: undefined,
        serverId: undefined,
        serial: 0
      },
      serverList: [],
      dataFormRules: {
        serverId: [{ required: true, message: '请选择服务', trigger: 'change' }],
        url: [{ required: true, message: '请输入服务地址', trigger: 'blur' }]
      },
      addTitle: '新增城市设计服务',
      addFlag: false,
      tableData: [],
      // 查询数据
      queryParam: {
        serverName: undefined,
        page: 1,
        pageSize: 10
      },
      total: 0,
      addLoading: false,
      kindList: []

    };
  },
  computed: {},
  mounted() {
  },
  created() {
    this.queryList();
  },
  methods: {
    getThreeServerList() {
      queryThreeDimensionalityServer().then(res => {
        if (res.code == 200) {
          this.serverList = res.data;
        }
      });
    },
    save() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入必填项');
        if (this.addLoading) {
          this.$message.warning('请勿重复点击！');
          return;
        }
        this.addLoading = true;
        if (this.dataForm.pid != null || this.dataForm.pid != undefined) {
          // 修改
          edit(this.dataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.addFlag = false;
              this.queryList();
            }
            this.addLoading = false;
          })
        } else {
          // 新增
          add(this.dataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.addFlag = false;
              this.queryList();
            }
            this.addLoading = false;
          })
        }
      });
    },
    addData() {
      this.addFlag = true;
      this.addTitle = '新增城市设计服务';
      this.getThreeServerList();
      Object.assign(this.dataForm, this.dataFormCopy);
    },
    handleClose(done) {
      done();
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
    handleEnable(row) {
      enable(row.pid).then(res => {
        if (res.code == 200) {
          this.$message.success('操作成功！');
          this.queryList();
        }
      });
    },
    handleEdit(row) {
      this.addFlag = true;
      this.addTitle = '修改城市设计服务';
      this.getThreeServerList();
      Object.assign(this.dataForm, row);
    },
    // 删除数据
    handleDelete(row) {
      this.$confirm('确认服务名称为 ' + row.name + ' 的数据？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
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
<style scoped lang='scss'>
@import '@/assets/scss/common.scss';

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