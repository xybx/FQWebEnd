<template>
  <div class='container'>
    <el-row :gutter='20'>
      <el-col :span='4'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.keyWord' placeholder='根据服务名称关键字搜索'></el-input>
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
      <el-table-column prop='label' label='服务名称' align='center'></el-table-column>
      <el-table-column prop='url' label='服务地址' align='center'></el-table-column>
      <el-table-column prop='kind' label='服务类型' align='center' :formatter='kindFormat'></el-table-column>
      <el-table-column prop='enable' label='是否启用' align='center' width='100px'>
        <template slot-scope='scope'>
          <span v-if='scope.row.isEnable === 1'>是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop='dbName' label='数据库表名称' align='center'></el-table-column>
      <el-table-column prop='dbDataCoordinateSystem' label='数据库数据坐标系' align='center' width='100px'></el-table-column>
      <el-table-column label='操作' align='center'>
        <template slot-scope='scope'>
          <el-button v-if='scope.row.isEnable == 1' type='text' class='red' style='color: red' icon='el-icon-close' confirm @click='handleEnable(scope.row)'>
            禁用
          </el-button>
          <el-button v-if='scope.row.isEnable != 1' type='text' style='color: forestgreen' class='green' icon='el-icon-check' confirm @click='handleEnable(scope.row)'>
            启用
          </el-button>
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
        width='35%'
        custom-class="set-dialog"
        :before-close='handleClose'>

      <el-form ref='addForm' :model='dataForm' :rules='dataFormRules' label-width='auto'>
        <el-form-item label='服务名称：' prop='label'>
          <el-input v-model.trim='dataForm.label'></el-input>
        </el-form-item>

        <el-form-item label='服务地址：' prop='url'>
          <el-input v-model.trim='dataForm.url'></el-input>
        </el-form-item>

        <el-form-item label='地图类型：' prop='kind'>
          <el-select style='width: 280px' v-model='dataForm.kind' filterable placeholder='请选择地图类型'>
            <el-option v-for='item in kindList' :key='item.intnum' :label='item.name'
                       :value='item.intnum'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='数据库表名称：' prop='dbName'>
          <el-input v-model.trim='dataForm.dbName'></el-input>
        </el-form-item>

        <el-form-item label='建筑高度数据库字段名称：' prop='dbJzgdFieldName'>
          <el-input v-model.trim='dataForm.dbJzgdFieldName'></el-input>
        </el-form-item>

        <el-form-item label='用地面积数据库字段名称：' prop='dbYdmjFieldName'>
          <el-input v-model.trim='dataForm.dbYdmjFieldName'></el-input>
        </el-form-item>

        <el-form-item label='数据库数据面数据字段名称：' prop='dbDataFieldName'>
          <el-input v-model.trim='dataForm.dbDataFieldName'></el-input>
        </el-form-item>

        <el-form-item label='计算因子：' prop='dbCalculateDivisor'>
          <el-input-number v-model='dataForm.dbCalculateDivisor' :min='1' :step='3'></el-input-number>
        </el-form-item>

        <el-form-item label='数据库索引字段名称：' prop='dbIdFieldName'>
          <el-input v-model.trim='dataForm.dbIdFieldName'></el-input>
        </el-form-item>

        <el-form-item label='属性id字段对应的数据库字段名称：' prop='dbIdFieldName'>
          <el-input v-model.trim='dataForm.dbPropertyFieldName'></el-input>
        </el-form-item>

        <el-form-item label='数据库数据坐标系：' prop='dbDataCoordinateSystem'>
          <el-input-number v-model='dataForm.dbDataCoordinateSystem' :min='0'></el-input-number>
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
import { getList, del, getKindType, saveOrEdit, enable } from '@/api/functionApplication/AnalysisServe-api';

export default {
  name: 'analysisServe',
  data() {
    return {
      dataForm: {
        pid: undefined,
        label: undefined,
        url: undefined,
        kind: undefined,
        dbName: undefined,
        dbJzgdFieldName: undefined,
        dbYdmjFieldName: undefined,
        dbDataFieldName: undefined,
        dbCalculateDivisor: 3,
        dbIdFieldName: undefined,
        dbPropertyFieldName: undefined,
        dbDataCoordinateSystem: undefined
      },
      dataFormCopy: {
        pid: undefined,
        label: undefined,
        url: undefined,
        kind: undefined,
        dbName: undefined,
        dbJzgdFieldName: undefined,
        dbYdmjFieldName: undefined,
        dbDataFieldName: undefined,
        dbCalculateDivisor: 3,
        dbIdFieldName: undefined,
        dbPropertyFieldName: undefined,
        dbDataCoordinateSystem: undefined
      },
      dataFormRules: {
        label: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入服务地址', trigger: 'blur' }],
        kind: [{ required: true, message: '请选择地图类型', trigger: 'change' }],
        enable: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        dbName: [{ required: true, message: '请输入数据库表名称', trigger: 'blur' }],
        dbJzgdFieldName: [{ required: true, message: '请输入建筑高度数据库字段名称', trigger: 'blur' }],
        dbYdmjFieldName: [{ required: true, message: '请输入用地面积数据库字段名称', trigger: 'blur' }],
        dbDataFieldName: [{ required: true, message: '请输入数据库数据面数据字段名称', trigger: 'blur' }],
        dbCalculateDivisor: [{ required: true, message: '请输入计算因子', trigger: 'blur' }],
        dbIdFieldName: [{ required: true, message: '请输入数据库索引字段名称', trigger: 'blur' }],
        dbPropertyFieldName: [{ required: true, message: '请输入属性id字段对应的数据库字段名称', trigger: 'blur' }],
        dbDataCoordinateSystem: [{ required: true, message: '数据库数据坐标系', trigger: 'blur' }]
      },
      addTitle: '新增分析服务',
      addFlag: false,
      tableData: [],
      // 查询数据
      queryParam: {
        keyWord: '',
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
    this.initKindList();
    this.queryList();
  },
  methods: {
    kindFormat(row, column) {
      if (this.kindList.length > 0) {
        for (let i = 0; i < this.kindList.length; i++) {
          if (row.kind == this.kindList[i].intnum) {
            return this.kindList[i].name;
          }
        }
      }
    },
    initKindList() {
      getKindType().then(res => {
        if (res.code === 200) {
          this.kindList = res.data;
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

        saveOrEdit(this.dataForm).then(res => {
          if (res.code == 200) {
            this.$message.success('操作成功！');
            this.addFlag = false;
            this.queryList();
          }
          this.addLoading = false;
        });
      });
    },
    editData(row) {
      this.addFlag = true;
      this.addTitle = '修改分析服务';
      Object.assign(this.dataForm, row);
    },
    addData() {
      this.addFlag = true;
      this.addTitle = '新增分析服务';
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
          this.$message.success("操作成功！");
          this.queryList();
        }
      })
    },
    handleEdit(row) {
      this.addFlag = true;
      this.addTitle = "编辑分析服务";
      Object.assign(this.dataForm, row);
    },
    // 删除数据
    handleDelete(row) {
      this.$confirm('确认服务名称为 ' + row.label + ' 的数据？', '提示', {
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
<style scoped lang="scss">
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