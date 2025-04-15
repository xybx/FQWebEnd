<!--
 * @Author: ssq
 * @Date: 2022-09-26 15:47:10
 * @LastEditors: ssq
 * @LastEditTime: 2022-10-27 14:27:41
 * @FilePath: \fjsy-web\src\views\historyprj\historyprj.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
-->
<template>
  <div class='container'>
    <el-row :gutter='20'>
      <el-col :span='4'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.keywords' placeholder='根据项目分类进行关键词搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='12'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryHistoryprjList'>
              查询
            </el-button>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>新增</el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header'>
      <el-table-column prop='pid' label='id' align='center'></el-table-column>
      <el-table-column prop='province' label='省份' align='center'></el-table-column>
      <el-table-column prop='city' label='城市' align='center'></el-table-column>
      <el-table-column prop='districtorcounty' label='区/县' align='center'></el-table-column>
      <el-table-column prop='street' label='街道' align='center'></el-table-column>
      <el-table-column prop='prjfirstlevel' label='项目大类' width='230' align='center'></el-table-column>
      <el-table-column prop='prjssecondlevel' label='项目小类' width='230' align='center'></el-table-column>
      <el-table-column prop='prjyear' label='项目年份' width='80' align='center'></el-table-column>
      <el-table-column prop='prjamount' label='项目金额（万元）' width='160' align='center'></el-table-column>
      <el-table-column prop='prjcount' label='项目数量' width='80' align='center'></el-table-column>
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

    <el-dialog
        title='新增历史项目数据'
        :visible.sync='addFlag'
        width='35%'
        :before-close='handleClose'>
      <el-form ref='addform' :model='addDataForm' :rules='addRules' label-width='100px'>
        <el-form-item label='省市区/县：' prop='addArea'>
          <el-cascader v-model='addDataForm.addArea' :props='{ checkStrictly: true }' :options='options'
                       @change='handleAddChange'></el-cascader>
        </el-form-item>
        <el-form-item label='项目大类：' prop='prjfirstlevel'>
          <el-input v-model='addDataForm.prjfirstlevel' maxlength='15' show-word-limit></el-input>
        </el-form-item>
        <el-form-item label='项目小类：' prop='prjssecondlevel'>
          <el-input v-model='addDataForm.prjssecondlevel' maxlength='15' show-word-limit></el-input>
        </el-form-item>
        <el-form-item label='项目年份：' prop='prjyear'>
          <el-input-number :min='1949' :max='2100' size='medium' v-model='addDataForm.prjyear'></el-input-number>
        </el-form-item>
        <el-form-item label='项目金额：' prop='prjamount'>
          <el-input-number :min='0' size='medium' :precision='4' v-model='addDataForm.prjamount'></el-input-number>
          <span>（万元）</span>
        </el-form-item>
        <el-form-item label='项目数量：' prop='prjcount'>
          <el-input-number :min='0' size='medium' v-model='addDataForm.prjcount'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addFlag = false'>取 消</el-button>
                <el-button :loading='addLoding' type='primary' @click="addHistoryprj('addform')">确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title='编辑历史项目数据' :visible.sync='editEntityFlag' width='35%' :before-close='handleEditClose'>
      <el-form ref='editform' :model='editDataForm' :rules='editRules' label-width='100px'>
        <el-form-item label='省市区/县：' prop='editArea'>
          <el-cascader v-model='editArea' :props='{ checkStrictly: true }' :options='options'
                       @change='handleEditChange'></el-cascader>
        </el-form-item>
        <el-form-item label='项目大类：' prop='prjfirstlevel'>
          <el-input v-model='editDataForm.prjfirstlevel' maxlength='15' show-word-limit></el-input>
        </el-form-item>
        <el-form-item label='项目小类：' prop='prjssecondlevel'>
          <el-input v-model='editDataForm.prjssecondlevel' maxlength='15' show-word-limit></el-input>
        </el-form-item>
        <el-form-item label='项目年份：' prop='prjyear'>
          <el-input-number :min='1949' :max='2100' size='medium' v-model='editDataForm.prjyear'></el-input-number>
        </el-form-item>
        <el-form-item label='项目金额：' prop='prjamount'>
          <el-input-number :min='0' size='medium' :precision='4' v-model='editDataForm.prjamount'></el-input-number>
          <span>（万元）</span>
        </el-form-item>
        <el-form-item label='项目数量：' prop='prjcount'>
          <el-input-number :min='0' size='medium' v-model='editDataForm.prjcount'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='editEntityFlag = false'>取 消</el-button>
                <el-button :loading='editLoding' type='primary' @click="editHistoryprj('editform')">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog
        title='导入模板数据'
        :visible.sync='importData'
        width='30%'
        :before-close='handleImportDataClose'>
      <el-upload class='upload-demo' :action='importUrl' :on-preview='handlePreview'
                 :on-remove='handleRemove' :headers='headers' accept='.xls' :before-remove='beforeRemove' multiple
                 :limit='1' :on-exceed='handleExceed'
                 :on-success='onSuccess'
                 :file-list='fileList'>
        <el-button size='small' type='primary'>点击导入</el-button>
        <div slot='tip' class='el-upload__tip'>只能导入下载后的模板文件</div>
      </el-upload>
      <span slot='footer' class='dialog-footer'>
                    <el-button @click='importData = false'>取 消</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHistoryprjList,
  saveHistoryprj,
  delHistoryprj,
  exportExcel,
  editEntity,
  queryFujianUrban
} from '@/api/historyprj-api';

export default {
  name: 'historyprj',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        keywords: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      addFlag: false,
      addLoding: false,
      // 添加数据表单
      addDataForm: {
        province: '',
        city: '',
        districtorcounty: '',
        prjfirstlevel: '',
        prjssecondlevel: '',
        prjyear: '',
        prjamount: '',
        prjcount: ''
      },
      addDataFormCopy: {
        province: '',
        city: '',
        districtorcounty: '',
        prjfirstlevel: '',
        prjssecondlevel: '',
        prjyear: '',
        prjamount: '',
        prjcount: '',
        addArea: []

      },
      editArea: [],
      editEntityFlag: false,
      editLoding: false,
      editDataForm: {
        pid: '',
        province: '',
        city: '',
        districtorcounty: '',
        prjfirstlevel: '',
        prjssecondlevel: '',
        prjyear: '',
        prjamount: '',
        prjcount: ''
      },
      importData: false,
      importURL: '',
      fileList: [],
      options: [],
      addRules: {
        prjfirstlevel: [
          { required: true, message: '请输入项目大类名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        addArea: [
          { type: 'array', required: true, message: '请选择省市区/县', trigger: 'change' }
        ],
        prjssecondlevel: [
          { required: true, message: '请输入项目小类名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        prjyear: [
          { type: 'number', required: true, message: '请输入项目年份', trigger: 'blur' }
        ],
        prjamount: [
          { type: 'number', required: true, message: '请输入项目金额', trigger: 'blur' }
        ],
        prjcount: [
          { type: 'number', required: true, message: '请输入项目数量', trigger: 'blur' }
        ]
      },
      editRules: {
        prjfirstlevel: [
          { required: true, message: '请输入项目大类名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        prjssecondlevel: [
          { required: true, message: '请输入项目小类名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        prjyear: [
          { type: 'number', required: true, message: '请输入项目年份', trigger: 'blur' }
        ],
        prjamount: [
          { type: 'number', required: true, message: '请输入项目金额', trigger: 'blur' }
        ],
        prjcount: [
          { type: 'number', required: true, message: '请输入项目数量', trigger: 'blur' }
        ]
      }
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
    this.queryHistoryprjList();
    this.initImportUrl();
    this.initAreaTree();
  },
  methods: {
    initAreaTree() {
      queryFujianUrban().then(res => {
        if (res.code == 200) {
          console.log('查询的省市区结果 ->', res);
          let options = {
            value: '',
            label: '',
            children: []
          };
          options.value = res.data.code;
          options.label = res.data.name;

          for (let i = 0; i < res.data.child.length; i++) {
            // 市区数据
            let cityOptions = {
              value: '',
              label: '',
              children: []
            };
            cityOptions.value = res.data.child[i].code;
            cityOptions.label = res.data.child[i].name;

            for (let j = 0; j < res.data.child[i].child.length; j++) {
              // 区县数据
              let distOptions = {
                value: '',
                label: '',
                children: []
              };
              if (res.data.child[i].child[j]) {
                distOptions.value = res.data.child[i].child[j].code;
              }
              if (res.data.child[i].child[j]) {
                distOptions.label = res.data.child[i].child[j].name;
              }
              for (let k = 0; k < res.data.child[i].child[j].child.length; k++) {
                // 街道数据
                // 区县数据
                let streetOptions = {
                  value: '',
                  label: ''
                };
                if (res.data.child[i].child[j].child[k]) {
                  streetOptions.value = res.data.child[i].child[j].child[k].code;
                }
                if (res.data.child[i].child[j].child[k]) {
                  streetOptions.label = res.data.child[i].child[j].child[k].name;
                }
                distOptions.children.push(streetOptions);
              }

              cityOptions.children.push(distOptions);
            }

            options.children.push(cityOptions);
          }
          // 目前只有福建省 2022.9.28
          this.options.push(options);
        }
      });
    },
    // 查询列表数据
    queryHistoryprjList() {
      // this.queryParam.pageNum = 1;
      getHistoryprjList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    buttonQueryHistoryprjList() {
      this.queryParam.pageNum = 1;
      getHistoryprjList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.queryHistoryprjList();
    },
    handleCurrentChange(val) {
      this.queryParam.pageNum = val;
      this.queryHistoryprjList();
    },
    // 修改数据
    handleEdit(row) {
      this.editArea = [];
      if (row.province != null && row.province != '') {
        this.editArea.push(row.province);
      }
      if (row.city != null && row.city != '') {
        this.editArea.push(row.city);
      }
      if (row.districtorcounty != null && row.districtorcounty != '') {
        this.editArea.push(row.districtorcounty);
      }
      if (row.street != null && row.street != '') {
        this.editArea.push(row.street);
      }

      this.editEntityFlag = true;
      this.editDataForm.pid = row.pid;
      this.editDataForm.province = row.province;
      this.editDataForm.city = row.city;
      this.editDataForm.districtorcounty = row.districtorcounty;
      this.editDataForm.prjfirstlevel = row.prjfirstlevel;
      this.editDataForm.prjssecondlevel = row.prjssecondlevel;
      this.editDataForm.prjyear = row.prjyear;
      this.editDataForm.prjamount = row.prjamount;
      this.editDataForm.prjcount = row.prjcount;
    },
    // 添加数据
    addData() {
      this.addDataForm.addArea = [];
      this.addDataForm = JSON.parse(JSON.stringify(this.addDataFormCopy));
      this.addFlag = true;
    },
    handleEditClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => { });
    },
    // 关闭回调
    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => { });
    },
    handleImportDataClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => { });
    },
    // 新增历史项目数据
    addHistoryprj(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addLoding) {
            this.$message.warning('请勿重复点击提交！');
            return;
          }
          this.addLoding = true;
          // 防止重复提交，进行按钮禁用
          saveHistoryprj(this.addDataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('保存成功！');
            } else {
            }
            this.addFlag = false;
            this.addLoding = false;
            this.queryHistoryprjList();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 编辑历史项目数据
    editHistoryprj(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editLoding) {
            this.$message.warning('请勿重复点击提交！');
            return;
          }
          this.editLoding = true;
          editEntity(this.editDataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('修改成功！');
            } else {
            }
            this.editEntityFlag = false;
            this.editLoding = false;
            this.queryHistoryprjList();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 删除数据
    handleDelete(row) {
      this.$confirm('确认删除id为 ' + row.pid + ' 的数据？')
          .then(_ => {
            console.log('执行删除');
            delHistoryprj(row.pid).then(res => {
              if (res.code == 200) {
                this.$message.success('删除成功！');
                this.queryHistoryprjList();
              } else {
                this.$message.error('删除失败');
              }
            });
          })
          .catch(_ => {
            console.log('取消删除');
          });
    },
    // 下载模板数据
    downTemplate() {
      // window.open(window.apiURL + "/historyprj/download/template");
      exportExcel(window.apiURL + '/historyprj/download/template', sessionStorage.getItem('token'));
    },
    importExcel() {
      this.importData = true;
      this.fileList = [];
    },
    // 文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制单次上传 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`);
    },
    onSuccess(response, file, fileList) {
      console.log('上传成功结果 -> ', response);
      if (response.code == 200) {
        this.$message.success(response.msg);
        // 关闭对话框，刷新列表
        this.importData = false;
        this.queryHistoryprjList();
      } else {
        this.$message.warning(response.msg);
        // 删除当前数据
        let index = -1;
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].name == file.name) {
            index = i;
          }
        }
        fileList.splice(index, 1);
      }
    },
    initImportUrl() {
      this.importUrl = window.apiURL + '/historyprj/exportbyexcel';
      console.log(this.importUrl);
    },
    handleAddChange(value) {
      this.addDataForm.province = value[0];
      this.addDataForm.city = value[1];
      this.addDataForm.districtorcounty = value[2];
      this.addDataForm.street = value[3];

    },
    handleEditChange(value) {
      this.editDataForm.province = value[0];
      this.editDataForm.city = value[1];
      this.editDataForm.districtorcounty = value[2];
      this.editDataForm.street = value[3];
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

.bg-purple {
  background: #d3dce6;
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