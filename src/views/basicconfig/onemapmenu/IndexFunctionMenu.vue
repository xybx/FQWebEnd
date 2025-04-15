<!--
 * @Author: ssq
 * @Date: 2023-01-03 13:38:44
 * @LastEditors: ssq
 * @LastEditTime: 2023-01-04 16:36:58
 * @FilePath: \3d-web\src\views\basicconfig\onemapmenu\IndexFunctionMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by hydp, All Rights Reserved. 
-->
<template>
  <div class='container'>
    <div class='grid-content bg-purple'>
      <div>
        <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addMenuClick'>新增功能菜单</el-button>
      </div>
    </div>

    <el-table :data='tableData' style='width: 100%;margin-bottom: 20px;margin-top: 1%;font-size: 15px' row-key='pid'
              border :default-expand-all='isExpand'
              :tree-props="{ children: 'childList'}">
      <el-table-column prop='name' label='菜单名称' align='center'>
      </el-table-column>
      <el-table-column prop='code' label='code' align='center'>
      </el-table-column>
      <el-table-column prop='iconUrl' label='图标' align='center' height='150' width='150'>
        <template slot-scope='scope'>
          <el-image :src='resourceUrl + scope.row.iconUrl'
                    :preview-src-list='[resourceUrl + scope.row.iconUrl]' min-width='50' height='50' />
        </template>
      </el-table-column>
      <el-table-column prop='description' label='功能描述' align='center' show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop='serial' label='排序' align='center'>
      </el-table-column>
      <el-table-column label='操作' align='center'>
        <template slot-scope='scope'>
          <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
          <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)'
                     style='color:red'>删除
          </el-button>
          <el-button v-if='scope.row.parentId == 0' type='text' icon='el-icon-delete' confirm
                     @click='addChild(scope.row)' style='color:green'>添加子节点
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title='添加父级功能菜单' custom-class="set-dialog" :visible.sync='addParentFlag' width='30%' :before-close='handleAddMenuClose'>
      <el-form ref='saveDataformRef' :model='menuDataForm' :rules='addRules' label-width='100px'>
        <el-form-item label='菜单名称：' prop='name'>
          <el-input v-model='menuDataForm.name'></el-input>
        </el-form-item>
        <el-form-item label='code：' prop='code'>
          <el-input v-model='menuDataForm.code'></el-input>
        </el-form-item>
        <el-form-item label='菜单图标：' prop='iconUrl'>
          <el-upload ref='addUpload' action='#' list-type='picture-card' :file-list='fileList' :auto-upload='false'
                     :limit='1' :on-change='handleChange' :on-exceed='beforeAddIcon' accept='.jpg,.png'>
            <i slot='default' class='el-icon-plus'></i>
            <div slot='file' slot-scope='{file}'>
              <img class='el-upload-list__item-thumbnail' :src='file.url' alt=''>
              <span class='el-upload-list__item-actions'>
                                <span class='el-upload-list__item-preview' @click='handlePictureCardPreview(file)'>
                                    <i class='el-icon-zoom-in'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete'
                                      @click='handleDownload(file)'>
                                    <i class='el-icon-download'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete' @click='handleRemove(file)'>
                                    <i class='el-icon-delete'></i>
                                </span>
                            </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label='排序：' prop='serial'>
          <el-input-number :min='0' size='medium' v-model='menuDataForm.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addParentFlag = false'>取 消</el-button>
                <el-button type='primary' @click='saveMenu()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title='编辑父级功能菜单' custom-class="set-dialog" :visible.sync='editParentFlag' width='30%' :before-close='handleAddMenuClose'>
      <el-form ref='editDataform' :model='menuDataForm' :rules='addRules' label-width='100px'>
        <el-form-item label='菜单名称：' prop='name'>
          <el-input v-model='menuDataForm.name'></el-input>
        </el-form-item>
        <el-form-item label='code：' prop='code'>
          <el-input v-model='menuDataForm.code'></el-input>
        </el-form-item>
        <el-form-item label='菜单图标：' prop='iconUrl'>
          <el-upload ref='editUpload' action='#' list-type='picture-card' :file-list='fileList' :auto-upload='false'
                     :limit='1' :on-change='handleChange' :on-exceed='beforeAddIcon' accept='.jpg,.png'>
            <i slot='default' class='el-icon-plus'></i>
            <div slot='file' slot-scope='{file}'>
              <!-- <img class="el-upload-list__item-thumbnail" :src="resourceUrl + menuDataForm.iconUrl" alt="" /> -->
              <!-- <img v-if="menuDataForm.iconUrl != null" class="el-upload-list__item-thumbnail" :src="resourceUrl + menuDataForm.iconUrl" alt=""/> -->
              <img class='el-upload-list__item-thumbnail' :src='file.url' alt='' />
              <span class='el-upload-list__item-actions'>
                                <span class='el-upload-list__item-preview' @click='handlePictureCardPreview(file)'>
                                    <i class='el-icon-zoom-in'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete'
                                      @click='handleDownload(file)'>
                                    <i class='el-icon-download'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete' @click='handleRemove(file)'>
                                    <i class='el-icon-delete'></i>
                                </span>
                            </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label='排序：' prop='serial'>
          <el-input-number :min='0' size='medium' v-model='menuDataForm.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='editParentFlag = false'>取 消</el-button>
                <el-button type='primary' @click='saveMenu()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title='添加子级别功能菜单' custom-class="set-dialog" :visible.sync='addChildFlag' width='30%' :before-close='handleAddMenuClose'>
      <el-form ref='addChildDataform' :model='menuChildDataForm' :rules='menuChildDataFormRules' label-width='100px'>
        <el-form-item label='菜单名称：' prop='name'>
          <el-input v-model.trim='menuChildDataForm.name'></el-input>
        </el-form-item>
        <el-form-item label='code：' prop='code'>
          <el-input v-model.trim='menuChildDataForm.code'></el-input>
        </el-form-item>
        <el-form-item label='功能描述：' prop='description'>
          <el-input v-model.trim='menuChildDataForm.description' type="textarea" :rows='4'></el-input>
        </el-form-item>
        <el-form-item label='菜单图标：' prop='iconUrl'>
          <el-upload ref='addChildUpload' action='#' list-type='picture-card' :file-list='fileList' :auto-upload='false'
                     :limit='1' :on-change='handleChange' :on-exceed='beforeAddIcon' accept='.jpg,.png'>
            <i slot='default' class='el-icon-plus'></i>
            <div slot='file' slot-scope='{file}'>
              <img class='el-upload-list__item-thumbnail' :src='file.url' alt=''>
              <span class='el-upload-list__item-actions'>
                                <span class='el-upload-list__item-preview' @click='handlePictureCardPreview(file)'>
                                    <i class='el-icon-zoom-in'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete'
                                      @click='handleDownload(file)'>
                                    <i class='el-icon-download'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete' @click='handleRemove(file)'>
                                    <i class='el-icon-delete'></i>
                                </span>
                            </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label='排序：' prop='serial'>
          <el-input-number :min='0' size='medium' v-model='menuChildDataForm.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addChildFlag = false'>取 消</el-button>
                <el-button type='primary' @click='saveMenu()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title='编辑子级别功能菜单' :visible.sync='editChildFlag' width='30%' :before-close='handleAddMenuClose'>
      <el-form ref='editChildDataform' :model='menuChildDataForm' :rules='menuChildDataFormRules' label-width='100px'>
        <el-form-item label='菜单名称：' prop='name'>
          <el-input v-model='menuChildDataForm.name'></el-input>
        </el-form-item>
        <el-form-item label='code：' prop='code'>
          <el-input v-model='menuChildDataForm.code'></el-input>
        </el-form-item>
        <el-form-item label='功能描述：' prop='description'>
          <el-input v-model.trim='menuChildDataForm.description'  type="textarea" :rows='4'></el-input>
        </el-form-item>
        <el-form-item label='菜单图标：' prop='iconUrl'>
          <el-upload ref='editChildUpload' action='#' list-type='picture-card' :file-list='fileList'
                     :auto-upload='false' :limit='1' :on-change='handleChange' :on-exceed='beforeAddIcon'
                     accept='.jpg,.png'>
            <i slot='default' class='el-icon-plus'></i>
            <div slot='file' slot-scope='{file}'>
              <img class='el-upload-list__item-thumbnail' :src='file.url' alt=''>
              <span class='el-upload-list__item-actions'>
                                <span class='el-upload-list__item-preview' @click='handlePictureCardPreview(file)'>
                                    <i class='el-icon-zoom-in'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete'
                                      @click='handleDownload(file)'>
                                    <i class='el-icon-download'></i>
                                </span>
                                <span v-if='!disabled' class='el-upload-list__item-delete' @click='handleRemove(file)'>
                                    <i class='el-icon-delete'></i>
                                </span>
                            </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label='排序：' prop='serial'>
          <el-input-number :min='0' size='medium' v-model='menuChildDataForm.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='editChildFlag = false'>取 消</el-button>
                <el-button type='primary' @click='saveMenu()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :visible.sync='dialogVisible'>
      <img width='100%' :src='dialogImageUrl' alt=''>
    </el-dialog>
  </div>
</template>

<script>
import { queryData, saveOrEdit, del } from '@/api/IndexFunctionMenu.js';

export default {
  data() {
    return {
      tableData: [],
      resourceUrl: window.resourceUrl,
      addParentFlag: false,
      editParentFlag: false,
      addChildFlag: false,
      editChildFlag: false,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      isExpand: false,
      menuDataForm: {
        pid: 0,
        name: '',
        code: '',
        serial: 0,
        iconUrl: ''
      },
      menuChildDataForm: {
        pid: 0,
        name: '',
        code: '',
        serial: 0,
        parentId: 0,
        description: undefined,
        iconUrl: ''
      },
      addRules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: 'code不能为空', trigger: 'blur' }],
        iconUrl: [{ required: true, message: '图标不能为空', trigger: 'blur' }]
      },
      menuChildDataFormRules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: 'code不能为空', trigger: 'blur' }],
        iconUrl: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '描述功能不能为空', trigger: 'blur' }],
      }
    };
  },
  components: {},
  mounted() {
    this.initTableData();
  },
  methods: {
    addChild(row) {

      this.addChildFlag = true;
      this.menuChildDataForm.pid = 0;
      this.menuChildDataForm.name = '';
      this.menuChildDataForm.code = '';
      this.menuChildDataForm.serial = 0;
      this.menuChildDataForm.description = undefined;
      this.menuChildDataForm.parentId = row.pid;
      this.$nextTick(() => {
        this.$refs.addChildUpload.clearFiles();
      });

    },
    handleEdit(row) {
      if (row.parentId == 0) {
        this.editParentFlag = true;
        Object.assign(this.menuDataForm, row);
      } else {
        this.editChildFlag = true;
        this.menuChildDataForm.description = undefined;
        Object.assign(this.menuChildDataForm, row);
      }
      this.fileList = [];
      let file = {
        name: row.name,
        url: this.resourceUrl + row.iconUrl
      };
      this.fileList.push(file);
    },
    initTableData() {
      queryData().then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
        } else {
          this.$message.warning('请勿重复点击提交！');
        }
      });
    },
    addMenuClick() {
      this.addParentFlag = true;
      this.menuDataForm.pid = 0;
      this.menuDataForm.name = '';
      this.menuDataForm.serial = 0;
      this.menuDataForm.code = '';
      this.menuDataForm.iconUrl = '';
      this.$nextTick(() => {
        this.$refs.addUpload.clearFiles();
      });
    },
    saveMenu() {
      if (this.addParentFlag) {
        this.$refs.saveDataformRef.validate(async (valid) => {
          if (!valid) return this.$message.error('请补充必填项');
          const formData = new FormData();
          formData.append('file', this.fileList[0].raw);
          formData.append('pid', this.menuDataForm.pid);
          formData.append('name', this.menuDataForm.name);
          formData.append('code', this.menuDataForm.code);
          formData.append('serial', this.menuDataForm.serial);
          const res = await saveOrEdit(formData);
          if (res.code === 200) {
            this.$message.success(`添加成功！`);
            this.addParentFlag = false;
            this.initTableData();
          }
        });
      } else if (this.editParentFlag) {
        this.$refs.editDataform.validate(async (valid) => {
          if (!valid) return this.$message.error('请补充必填项');
          const formData = new FormData();
          formData.append('file', this.fileList[0].raw);
          formData.append('pid', this.menuDataForm.pid);
          formData.append('name', this.menuDataForm.name);
          formData.append('code', this.menuDataForm.code);
          formData.append('serial', this.menuDataForm.serial);
          const res = await saveOrEdit(formData);
          if (res.code === 200) {
            this.$message.success(`修改成功！`);
            this.editParentFlag = false;
            this.initTableData();
          }
        });
      } else if (this.addChildFlag) {
        this.$refs.addChildDataform.validate(async (valid) => {
          if (!valid) return this.$message.error('请补充必填项');
          const formData = new FormData();
          formData.append('file', this.fileList[0].raw);
          formData.append('pid', this.menuChildDataForm.pid);
          formData.append('name', this.menuChildDataForm.name);
          formData.append('code', this.menuChildDataForm.code);
          formData.append('serial', this.menuChildDataForm.serial);
          formData.append('parentId', this.menuChildDataForm.parentId);
          formData.append('description', this.menuChildDataForm.description);
          const res = await saveOrEdit(formData);
          if (res.code === 200) {
            this.$message.success(`添加成功！`);
            this.addChildFlag = false;
            this.initTableData();
          }
        });
      } else if (this.editChildFlag) {
        this.$refs.editChildDataform.validate(async (valid) => {
          if (!valid) return this.$message.error('请补充必填项');
          const formData = new FormData();
          formData.append('file', this.fileList[0].raw);
          formData.append('pid', this.menuChildDataForm.pid);
          formData.append('name', this.menuChildDataForm.name);
          formData.append('code', this.menuChildDataForm.code);
          formData.append('serial', this.menuChildDataForm.serial);
          formData.append('description', this.menuChildDataForm.description);
          const res = await saveOrEdit(formData);
          if (res.code === 200) {
            this.$message.success(`修改成功！`);
            this.editChildFlag = false;
            this.initTableData();
          }
        });
      }
    },
    handleAddMenuClose() {
      if (this.addParentFlag) {
        this.$refs.addUpload.clearFiles();

      } else if (this.editParentFlag) {
        this.$refs.editUpload.clearFiles();
      } else if (this.addChildFlag) {
        this.$refs.addChildUpload.clearFiles();
      } else {
        this.$refs.editChildUpload.clearFiles();
      }
      this.editParentFlag = false;
      this.addParentFlag = false;
      this.addChildFlag = false;
      this.editChildFlag = false;
    },
    handleRemove(file) {
      if (this.addParentFlag) {
        this.$refs.addUpload.clearFiles();
      } else if (this.editParentFlag) {
        this.$refs.editUpload.clearFiles();
      } else if (this.addChildFlag) {
        this.$refs.addChildUpload.clearFiles();
      } else {
        this.$refs.editChildUpload.clearFiles();
      }
      this.menuDataForm.iconUrl = '';
      this.fileList = [];
    },
    handleDownload(file) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAddIcon(files, fileList) {
      this.$message.warning(`当前限制单次上传 1 个图标，请先移除后上传`);
    },
    handleChange(file, fileList) {

      if (fileList.length > 0) {
        this.fileList = fileList;
        if (this.addParentFlag || this.editParentFlag) {
          this.menuDataForm.iconUrl = '1';
        } else if (this.addChildFlag || this.editChildFlag) {
          this.menuChildDataForm.iconUrl = '1';
        }
      } else {
        if (this.addParentFlag || this.editParentFlag) {
          this.menuDataForm.iconUrl = '';
        } else if (this.addChildFlag || this.editChildFlag) {
          this.menuChildDataForm.iconUrl = '';
        }
        this.fileList = [];
      }
    },
    handleDelete(row) {

      this.$confirm('确认删除菜单名称为 ' + row.name + ' 的数据？')
          .then(_ => {
            del(row.pid).then(res => {
              if (res.code == 200) {
                this.$message.success('删除成功!');
                this.initTableData();
              }
            });
          })
          .catch(_ => {
          });

    }
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';


</style>
