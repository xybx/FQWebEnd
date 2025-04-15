<template>
  <div class='container'>
    <div >
      <el-row :gutter='20'>
<!--        <el-col :span='3'>-->
<!--          <span>-->
<!--            总数量 0 个-->
<!--          </span>-->
<!--        </el-col>-->
<!--        <el-col :span='3'>-->
<!--          <span>-->
<!--            异常服务 0 个-->
<!--          </span>-->
<!--        </el-col>-->

        <el-col :span='1.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addServer()'>
                新增服务器监控
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span='1'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-refresh' class='handle-del mr10' @click='queryList()'>
                刷新
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table style='font-size: 15px; margin-top: 10px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header' v-loading='loading'>
      <el-table-column prop='ip' label='IP' align='center'></el-table-column>
      <el-table-column prop='serverName' label='服务器名称' align='center'></el-table-column>
      <el-table-column prop='cpu' label='CPU当前使用率' align='center'></el-table-column>
      <el-table-column prop='memory' label='内存' align='center'></el-table-column>
      <el-table-column prop='storageSpace' label='存储空间' width='230' align='center'></el-table-column>
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
                     :current-page='queryParam.page'
                     :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                     :total='total'>
      </el-pagination>
    </div>

    <el-dialog
        :title='title'
        :visible.sync='addFlag'
        width='35%'
        :before-close='handleClose'>
      <div style='margin-bottom: 20px'>
        <span style='color: red'>注意事项：</span>默认连接为windows服务器，请安装openssh并开放22端口！
        <br>
      </div>
      <el-form ref='addForm' :model='dataForm' :rules='dataFormRules' label-width='auto'>
        <el-form-item label='服务器名称：' prop='serverName'>
          <el-input v-model.trim='dataForm.serverName'></el-input>
        </el-form-item>

        <el-form-item label='IP：' prop='ip'>
          <el-input v-model.trim='dataForm.ip'></el-input>
        </el-form-item>

        <el-form-item label='服务器账号：' prop='loginName'>
          <el-input v-model.trim='dataForm.loginName'></el-input>
        </el-form-item>

        <el-form-item label='服务器密码：' prop='loginPassword'>
          <el-input type='password' show-password v-model.trim='dataForm.loginPassword'></el-input>
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
import {queryPageApi, saveOrEditApi, delApi} from "@/api/monitor/ServerMonitor-api"
export default {
  name: 'serverMonitor',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        name: undefined,
        page: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      dataForm: {
        serverName: undefined,
        ip: undefined,
        loginName: undefined,
        loginPassword: undefined,
      },
      dataFormCopy: {
        pid: undefined,
        serverName: undefined,
        ip: undefined,
        loginName: undefined,
        loginPassword: undefined,
      },
      dataFormRules: {
        serverName: [{ required: true, message: '请输入服务器名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入IP', trigger: 'blur' }],
        loginName: [{ required: true, message: '请输入服务器账号', trigger: 'blur' }],
        loginPassword: [{ required: true, message: '请输入服务器密码', trigger: 'blur' }],
      },
      title: "新增服务器信息",
      addFlag: false,
      addLoading: false
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
    this.queryList();
  },
  created() {

  },
  methods: {
    // 删除数据
    handleDelete(row) {
      this.$confirm('确认服务器名称为 ' + row.serverName + ' 的信息？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(_ => {
        delApi(row.pid).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功！');
            this.queryList();
          } else {
            this.$message.error('删除失败！');
          }
        });
      }).catch(_ => {
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
        saveOrEditApi(this.dataForm).then(res => {
          if (res.code == 200) {
            this.$message.success('操作成功！');
            this.addFlag = false;
            this.queryList();
          }
          this.addLoading = false;
        })
      });
    },
    queryList() {
      this.loading = true;
      queryPageApi(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
        this.loading = false;
      })
    },
    handleEdit(row) {
      this.addFlag = true;
      this.title = "编辑服务器信息";
      Object.assign(this.dataForm, row);
    },
    addServer() {
      this.addFlag = true;
      this.title = "新增服务器信息";
      Object.assign(this.dataForm, this.dataFormCopy);
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
    handleClose(done) {
      done();
    },
  }
};
</script>
<style>

.el-table .cell {
  white-space: pre-line;
}
.el-row {
  margin-bottom: 20px;
}
:last-child {
  margin-bottom: 0;
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