<!--
 * @Author: WCL
 * @Date: 2022-02-10 10:04:55
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-03 15:32:03
 * @FilePath: \fjsy-web\src\views\onemap\Condition.vue
 * @Description: 统一平台 - 条件查询
-->
<template>
  <div class='container'>
    <div class='service-main'>
      <el-tabs v-model='tabValue'  @tab-click='handleTabClick'>
        <el-tab-pane v-for='(item, index) in tabList' :disabled="item.name != '1'" :key='index' :label='item.label' :name='item.name'></el-tab-pane>
      </el-tabs>
      <div v-if="tabValue == '1'">
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
                <el-button type='primary' icon='el-icon-circle-plus-outline' class='handle-del mr10' @click='addItem'>
                  新增
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="tabValue != '1'">
        <div class="top-radio">
          <div>
            <span class="curr-role">当前专题名称：{{ specialTopic }}</span>
            <el-button style='margin-left: 10px' type='primary' icon='el-icon-circle-plus-outline' class='handle-del mr10' @click='addItem'>
              新增
            </el-button>
          </div>
        </div>
      </div>
      <div style='margin-top: 10px'>
        <!-- 表格 -->
        <el-table style='font-size: 15px' :data='tableData' border stripe>
          <el-table-column
              v-for='(item, index) in tableCols'
              :key='index'
              :label='item.label'
              :prop='item.prop'
              :width='item.width'
              align='center'
          ></el-table-column>

          <el-table-column label='操作' align='center'>
            <template v-slot='scope'>
              <el-button
                  size='mini'
                  type='text'
                  plain
                  icon='el-icon-search'
                  v-if="tabValue == '1'"
                  @click='searchFieldList(scope.row)'>
                查询字段
              </el-button>
              <el-button
                  size='mini'
                  type='text'
                  plain
                  icon='el-icon-notebook-2'
                  v-if="tabValue == '1'"
                  @click='resultList(scope.row)'>
                结果显示
              </el-button>
              <el-button
                  size='mini'
                  type='warning'
                  plain
                  v-if="scope.row.controltype && scope.row.controltype == 'list'"
                  @click='handleList(scope.row)'
              >{{ isAdmin == 'true' ? '编辑列表项' : '查看列表项' }}
              </el-button>
              <el-button size='mini' type='text' plain class='blue' icon='el-icon-edit' @click='handleEdit(scope.row)'>{{
                  isAdmin == 'true' ? '编辑' : '查看'
                }}
              </el-button>
              <el-button
                  v-if="isAdmin == 'true'"
                  size='small'
                  type='text'
                  plain
                  icon='el-icon-delete'
                  class='red'
                  @click='handleDelete(scope.row)'
              >删除
              </el-button
              >
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

    <!-- 左侧树弹窗 -->
    <el-dialog
        :title='treeTitle'
        :visible.sync='treeVisible'
        width='25%'
        custom-class='set-dialog'
        @closed='closedTree'
        :close-on-click-modal='false'
    >
      <el-form ref='treeForm' :model='treeForm' label-width='auto' class='group-form' :rules='treeFormRules'>
        <el-form-item label='名称' prop='TABNAME'>
          <el-input v-model='treeForm.TABNAME'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='treeVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveTreeDialog'>确 定</el-button>
            </span>
    </el-dialog>

    <!-- 图层配置弹窗 -->
    <el-dialog
        :title='layerTitle'
        :visible.sync='layerVisible'
        width='25%'
        custom-class='set-dialog'
        @closed='closedLayer'
        :close-on-click-modal='false'
    >
      <el-form ref='layerForm' :model='layerForm' label-width='auto' class='group-form' :rules='layerFormRules'>
        <el-form-item label='专题名称' prop='name'>
        <el-input v-model='layerForm.name'></el-input>
      </el-form-item>
        <el-form-item label='图层名称' prop='layername'>
          <el-input v-model='layerForm.layername'></el-input>
        </el-form-item>
        <el-form-item label='图层地址' prop='layerurl'>
          <el-input v-model='layerForm.layerurl'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='layerVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveLayerDialog'>确 定</el-button>
            </span>
    </el-dialog>

    <!-- 结果显示弹窗 -->
    <el-dialog
        :title='resTitle'
        :visible.sync='resVisible'
        width='25%'
        custom-class='set-dialog'
        @closed='closedRes'
        :close-on-click-modal='false'
    >
      <el-form ref='resForm' :model='resForm' label-width='auto' class='group-form' :rules='resFormRules'>
        <el-form-item label='结果字段名称' prop='fieldname'>
          <el-select v-model='resForm.fieldname' @change='changeResField' placeholder='请选择查询字段'>
            <el-option v-for='(item, index) in fieldList' :key='index' :label='`${item.name}:${item.alias}`'
                       :value='item.name'>
            </el-option>
          </el-select>
          <!-- <el-input v-model.trim="resForm.FIELDNAME"></el-input> -->
        </el-form-item>
        <el-form-item label='字段类型' prop='fieldtype'>
          <el-select v-model='resForm.fieldtype'>
            <el-option
                v-for='(item, index) in fieldTypeList'
                :key='index'
                :label='item.dictName'
                :value='item.dictValue'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='字段描述' prop='fielddesc'>
          <el-input v-model.trim='resForm.fielddesc' type='textarea'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='resVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveResDialog'>确 定</el-button>
            </span>
    </el-dialog>

    <!-- 查询字段弹窗 -->
    <el-dialog
        :title='searchTitle'
        :visible.sync='searchVisible'
        width='25%'
        custom-class='set-dialog'
        @closed='closedSearch'
        :close-on-click-modal='false'
    >
      <el-form ref='searchForm' :model='searchForm' label-width='auto' class='group-form' :rules='searchFormRules'>
        <el-form-item label='查询字段' prop='fieldname'>
          <el-select v-model='searchForm.fieldname' @change='changeField' placeholder='请选择查询字段'>
            <el-option v-for='(item, index) in fieldList' :key='index' :label='`${item.name}:${item.alias}`'
                       :value='item.name'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='查询字段描述' prop='displayname'>
          <el-input v-model.trim='searchForm.displayname'></el-input>
        </el-form-item>
        <el-form-item label='字段类型' prop='fieldtype'>
          <el-select v-model='searchForm.fieldtype'>
            <el-option
                v-for='(item, index) in fieldTypeList'
                :key='index'
                :label='item.dictName'
                :value='item.dictValue'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='控件类型' prop='controltype'>
          <el-select v-model='searchForm.controltype'>
            <el-option
                v-for='(item, index) in ctrlTypeList'
                :key='index'
                :label='item.dictName'
                :value='item.dictValue'
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='searchVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveSearchDialog'>确 定</el-button>
            </span>
    </el-dialog>

    <!-- 编辑列表项弹窗 -->
    <el-dialog
        :title='listTitle'
        :visible.sync='listVisible'
        width='50%'
        custom-class='set-dialog'
        @closed='closedList'
        :close-on-click-modal='false'
    >
      <el-form ref='listForm' :inline='true' :model='listForm' label-width='auto' class='group-form'
               :rules='listFormRules' v-if="isAdmin == 'true'">
        <el-form-item label='控件名称' prop='controlname'>
          <el-input v-model.trim='listForm.controlname'></el-input>
        </el-form-item>
        <el-form-item label='控件值' prop='controlvalue'>
          <el-input v-model.trim='listForm.controlvalue'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size='mini' type='primary' @click='saveListDialog'>添加</el-button>
        </el-form-item>
      </el-form>

      <el-table :data='listFieldData' border stripe max-height='400'>
        <el-table-column label='PID' prop='pid' align='center'></el-table-column>
        <el-table-column label='控件名称' prop='controlname' align='center'></el-table-column>
        <el-table-column label='控件值' prop='controlvalue' align='center'></el-table-column>

        <el-table-column label='操作' align='center' min-width='100' v-if="isAdmin == 'true'">
          <template v-slot='scope'>
            <el-button size='mini' type='danger' plain @click='listDelete(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot='footer' class='dialog-footer'>
                <el-button @click='listVisible = false'>取 消</el-button>
                <el-button type='primary' @click='listVisible = false' v-if="isAdmin == 'true'">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTabList,
  saveTab,
  delTab,
  getLayerList,
  saveLayer,
  delLayer,
  getResField,
  saveResField,
  delResField,
  getField,
  saveField,
  delField,
  getFieldType,
  getCtrlType,
  saveListField,
  getListField,
  delListField,
  getServerFields
} from '@/api/onemap/condition-api';
import { getWebGis, getServerLayers } from '@/api/onemap/hxdownload-api';

export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      queryParam: {
        keyWord: '',
        page: 1,
        pageSize: 10,
        layerid: ''
      },
      specialTopic: '',
      isAdmin: false,
      webgisLayers: [],
      webgisLayerId: '',
      sonlayers: [],
      fieldList: [],
      treeData: [],
      treeVisible: false,
      treeTitle: '',
      total: 0,
      treeForm: {
        TABNAME: ''
      },
      treeFormRules: {
        TABNAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      tabList: [
        { label: '图层配置', name: '1' },
        { label: '查询字段', name: '2' },
        { label: '结果显示', name: '3' }
      ],
      tabValue: '1',
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      layerlist: [],
      tableCols: [],
      tableColsTotal: {
        // 图层配置
        one: [
          { prop: 'pid', label: 'PID', width: '80' },
          { prop: 'name', label: '专题名称' },
          { prop: 'layername', label: '图层名称' },
          { prop: 'layerurl', label: '图层服务' }
        ],
        // 查询字段
        two: [
          { prop: 'pid', label: 'PID', width: '80' },
          { prop: 'fieldname', label: '查询字段名'},
          { prop: 'displayname', label: '查询字段(描述)'},
          { prop: 'fieldtype', label: '字段类型'},
          { prop: 'controltype', label: '控件类型'}
          // { prop: 'STATUS', label: '状态', width: '100' }
        ],
        // 结果字段
        three: [
          { prop: 'pid', label: 'PID', width: '80' },
          { prop: 'fieldname', label: '字段名称'},
          { prop: 'fielddesc', label: '字段描述'},
          { prop: 'fieldtype', label: '字段类型'}
        ]
      },
      treePID: null,
      currentKey: null,
      layerTitle: '',
      layerVisible: false,
      layerForm: {
        name: '',
        layername: '',
        layerurl: ''
      },
      layerFormRules: {
        name: [{ required: true, message: '专题名称不能为空', trigger: 'blur' }],
        layername: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
        layerurl: [{ required: true, message: '图层地址不能为空', trigger: 'blur' }]
      },

      resTitle: '',
      resVisible: false,
      resForm: {
        fieldname: '',
        fieldtype: '',
        fielddesc: ''
      },
      resFormRules: {
        fieldname: [{ required: true, message: '结果字段名称不能为空', trigger: 'blur' }],
        fieldtype: [{ required: true, message: '字段类型不能为空', trigger: 'change' }],
        fielddesc: [{ required: true, message: '字段描述不能为空', trigger: 'blur' }]
      },
      fieldTypeList: [], // 字段类型列表
      ctrlTypeList: [], // 控件类型列表

      searchTitle: '',
      searchVisible: false,
      searchForm: {
        displayname: '',
        fieldname: '',
        fieldtype: '',
        controltype: ''
      },
      searchFormRules: {
        displayname: [{ required: true, message: '查询描述字段不能为空', trigger: 'blur' }],
        fieldname: [{ required: true, message: '查询字段不能为空', trigger: 'blur' }],
        fieldtype: [{ required: true, message: '字段类型不能为空', trigger: 'change' }],
        controltype: [{ required: true, message: '控件类型不能为空', trigger: 'change' }]
      },

      listTitle: '编辑列表项',
      listVisible: false,
      listForm: {
        controlname: '',
        controlvalue: ''
      },
      listFormRules: {
        controlname: [{ required: true, message: '控件名称不能为空', trigger: 'blur' }],
        controlvalue: [{ required: true, message: '控件值不能为空', trigger: 'blur' }]
      },
      listFieldData: [],
      listFileID: ''
    };
  },
  computed: {},
  watch: {
    tabValue: {
      handler(val) {
        if (val == 1) {
          this.tableCols = this.tableColsTotal.one;
        } else if (val == 2) {
          this.tableCols = this.tableColsTotal.two;
        } else if (val == 3) {
          this.tableCols = this.tableColsTotal.three;
        }
      },
      immediate: true
    },
    treePID: {
      handler(val) {
        // debugger;
        let params = {
          layerid: val == null ? this.tabValue : val
        };
        if (this.tabValue == 1) {
          this.queryParam.layerid = '';
          this.getLayers(params);
        } else if (this.tabValue == 2) {
          this.getSearchs(params);
        } else if (this.tabValue == 3) {
          this.getRes(params);
        }
      },
      immediate: true
    },
    resVisible(boo) {
      if (boo) {
        this.getChildFields(this.queryParam.layerid);
        this.getFieldTypeList();
      }
    },
    searchVisible(boo) {
      if (boo) {
        this.getChildFields(this.queryParam.layerid);
        this.getCtrlTypeList();
        this.getFieldTypeList();
      }
    },
    layerVisible(boo) {
      if (boo) {
        this.getWebGisData();
        this.sonlayers = [];
      }
    }
  },
  created() {
  },
  mounted() {
    this.isAdmin = sessionStorage.getItem('isadmin');
    this.getTreeData();
  },
  methods: {
    resultList(row) {
      this.queryParam.layerid = row.pid;
      this.queryParam.page = 1;
      this.specialTopic = row.name;
      this.tabValue = '3';
      this.total = 0;
      this.tableData = [];
      this.getRes(this.queryParam);
    },
    searchFieldList(row) {
      this.queryParam.layerid = row.pid;
      this.queryParam.page = 1;
      this.specialTopic = row.name;
      this.tabValue = '2';
      this.total = 0;
      this.tableData = [];
      this.getSearchs(this.queryParam);
    },
    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      if (this.tabValue == '1') {
        // 查询图层
        this.getLayers(this.queryParam);
      } else if (this.tabValue == '2') {
        // 查询字段
        this.getSearchs(this.queryParam);
      } else {
        // 结果显示
        this.getRes(this.queryParam);
      }
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      if (this.tabValue == '1') {
        // 查询图层
        this.getLayers(this.queryParam);
      } else if (this.tabValue == '2') {
        // 查询字段
        this.getSearchs(this.queryParam);
      } else {
        // 结果显示
        this.getRes(this.queryParam);
      }
    },
    buttonQueryList() {
      this.queryParam.page = 1;
      this.getLayers(this.queryParam);
    },
    // 获取地图服务列表
    async getWebGisData() {
      const res = await getWebGis();
      if (res.code === 200) {
        this.webgisLayers = res.data;
      }
    },

    // 选择地图服务
    async changeWebGis(val) {
      let arr = this.webgisLayers.filter((item) => {
        return item.NAME === val;
      });
      var webgispid = arr[0].ID;
      const res = await getServerLayers({ webgispid });
      if (res.code === 200) {
        this.sonlayers = res.data;
      }
    },

    //选择子图层
    changeSonLayer(val) {
      let arr = this.sonlayers.filter((item) => {
        return item.Id === val;
      });
      this.layerForm.LAYERNAME = arr[0].Name;
      this.layerForm.LAYERURL = arr[0].Url;
    },

    // 图层字段列表
    async getChildFields(layerid) {
      let params = {
        layerid
      };
      const res = await getServerFields(params);
      if (res.code === 200) {
        this.fieldList = res.data;
      }
    },

    //选择字段
    changeField(val) {
      let arr = this.fieldList.filter((item) => {
        return item.name === val;
      });
      this.searchForm.displayname = arr[0].alias;
      this.searchForm.fieldname = arr[0].name;
    },

    changeResField(val) {
      let arr = this.fieldList.filter((item) => {
        return item.name === val;
      });
      this.resForm.fielddesc = arr[0].alias;
      this.resForm.fieldname = arr[0].name;
    },

    // 新增类型
    addTab() {
      this.treeVisible = true;
      this.treeTitle = '新增类型';
      Object.assign(this.treeForm, { pid: 0 });
    },

    // 保存树
    saveTreeDialog() {
      this.$refs.treeForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入必填项');
        const res = await saveTab(this.treeForm);
        if (res.code === 200) {
          this.$message.success('成功');
          this.treeVisible = false;
          this.getTreeData();
        }
      });
    },

    // 树弹窗关闭
    closedTree() {
      this.$refs.treeForm.resetFields();
    },

    // 树节点点击
    handleNodeClick(obj) {
      this.treePID = obj.PID;
    },

    // 图层配置列表
    async getLayers(params) {
      // debugger;
      const res = await getLayerList(params);
      if (res.code === 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.layerlist = res.data.records;
      }
    },

    // 查询字段列表
    async getSearchs(params) {
      const res = await getField(params);
      if (res.code === 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },

    // 结果字段列表
    async getRes(params) {
      const res = await getResField(params);
      if (res.code === 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },

    // 获取左侧树
    async getTreeData() {
      const res = await getTabList();
      if (res.code === 200) {
        this.treeData = res.data;
        if (this.treeData != null && this.treeData.length > 0) {
          this.currentKey = this.treeData[0].PID;
          this.treePID = this.treeData[0].PID;
          this.$nextTick(() => {
            this.$refs.treeData.setCurrentKey(this.currentKey);
          });
        }
      }
    },

    // 编辑树分组
    editTree(row) {
      this.treeVisible = true;
      this.treeTitle = '编辑类型';
      Object.assign(this.treeForm, row);
    },

    // 删除树分组
    async delTree(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let params = {
              pid: row.PID
            };
            const res = await delTab(params);
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getTreeData();
            }
          })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    // 标签页切换
    handleTabClick(val) {
      // debugger;
      if (this.tabValue == 1) {
        this.queryParam.layerid = '';
        this.getLayers(this.queryParam);
      } else if (this.tabValue == 2) {
        this.getSearchs(this.queryParam);
      } else if (this.tabValue == 3) {
        this.getRes(this.queryParam);
      }
    },

    // 编辑
    handleEdit(row) {
      console.log(row);
      if (this.tabValue == 1) {
        this.resVisible = false;
        this.searchVisible = false;
        this.layerVisible = true;
        this.layerTitle = '编辑图层配置';
        Object.assign(this.layerForm, row);
      } else if (this.tabValue == 2) {
        this.layerVisible = false;
        this.resVisible = false;
        this.searchVisible = true;
        this.searchTitle = '编辑查询字段';
        Object.assign(this.searchForm, row);
      } else if (this.tabValue == 3) {
        this.layerVisible = false;
        this.resVisible = true;
        this.resTitle = '编辑结果显示';
        Object.assign(this.resForm, row);
      }
    },

    // 删除
    async handleDelete(row) {

      //询问是否删除
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let form = {
              pid: row.pid
            };
            if (this.tabValue == 1) {
              const res = await delLayer(form);
              if (res.code === 200) {
                this.$message.success('删除成功');
                this.getLayers(this.queryParam);
              }
            } else if (this.tabValue == 2) {
              const res = await delField(form);
              if (res.code === 200) {
                this.$message.success('删除成功');
                this.getSearchs(this.queryParam);
              }
            } else if (this.tabValue == 3) {
              const res = await delResField(form);
              if (res.code === 200) {
                this.$message.success('删除成功');
                this.getRes(this.queryParam);
              }
            }
          })
          .catch(() => {

          });


    },

    // 图层配置弹窗关闭
    closedLayer() {
      this.$refs.layerForm.resetFields();
      this.webgisLayerId = '';
      this.sonlayers = [];
    },

    // 新增表格项
    addItem() {
      if (this.tabValue == 1) {
        this.resVisible = false;
        this.searchVisible = false;
        this.layerVisible = true;
        this.layerTitle = '新增图层配置';
        Object.assign(this.layerForm, { pid: 0 });
      } else if (this.tabValue == 2) {
        this.layerVisible = false;
        this.resVisible = false;
        this.searchVisible = true;
        this.searchTitle = '新增查询字段';
        Object.assign(this.searchForm, { pid: 0, layerid: this.queryParam.layerid });
      } else if (this.tabValue == 3) {
        this.layerVisible = false;
        this.searchVisible = false;
        this.resVisible = true;
        this.resTitle = '新增结果显示';
        Object.assign(this.resForm, { pid: 0, layerid: this.queryParam.layerid });
      }
    },

    // 保存图层配置
    saveLayerDialog() {
      this.$refs.layerForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        console.log('请求信息,', this.layerForm);
        const res = await saveLayer(this.layerForm);
        if (res.code === 200) {
          this.$message.success(`${this.layerTitle}成功`);
          this.layerVisible = false;

          this.getLayers(this.queryParam);
        }
      });
    },

    // 结果显示弹窗关闭
    closedRes() {
      this.$refs.resForm.resetFields();
    },

    // 保存结果显示
    saveResDialog() {
      this.$refs.resForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        const res = await saveResField(this.resForm);
        if (res.code == 200) {
          this.$message.success(`${this.resTitle}成功`);
          this.resVisible = false;
          this.getRes(this.queryParam);
        }
      });
    },

    // 获取字段类型列表
    async getFieldTypeList() {
      const res = await getFieldType();
      if (res.code === 200) {
        this.fieldTypeList = res.data;
      }
    },

    // 获取控件类型列表
    async getCtrlTypeList() {
      const res = await getCtrlType();
      if (res.code === 200) {
        this.ctrlTypeList = res.data;
      }
    },

    // 查询字段弹窗关闭
    closedSearch() {
      this.$refs.searchForm.resetFields();
    },

    // 保存查询字段
    saveSearchDialog() {
      this.$refs.searchForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        this.searchForm.filedvalues = null;
        this.searchForm.status = null;
        const res = await saveField(this.searchForm);
        if (res.code === 200) {
          this.$message.success(`${this.searchTitle}成功`);
          this.searchVisible = false;
          this.getSearchs(this.queryParam);
        }
      });
    },

    // 编辑列表项
    handleList(row) {
      console.log(row);
      this.listVisible = true;
      this.listFileID = row.pid;
      Object.assign(this.listForm, { pid: 0, fieldid: row.pid });
      this.getListFieldData();
    },

    async getListFieldData() {
      let params = {
        fieldid: this.listFileID
      };
      const res = await getListField(params);
      if (res.code === 200) {
        this.listFieldData = res.data;
      }
    },

    // 关闭列表项弹窗
    closedList() {
      this.$refs.listForm.resetFields();
    },

    // 保存列表项
    saveListDialog() {
      this.$refs.listForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        const res = await saveListField(this.listForm);
        if (res.code === 200) {
          this.$message.success(`添加成功`);
          this.$refs.listForm.resetFields();
          this.getListFieldData();
        }
      });
    },

    // 列表项删除
    async listDelete(row) {

      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            console.log(row);
            let params = {
              pid: row.pid
            };
            const res = await delListField(params);
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getListFieldData();
            }
          })
          .catch(() => {
            this.$message.info('已取消删除');
          });

    }
  }
};
</script>

<style scoped lang='scss'>
@import '@/assets/scss/common.scss';

.container {
  display: flex;
  min-height: 81vh;

  .service-aside {
    width: 300px;
    border: 1px solid #dcdfe6;
    margin-right: 10px;
  }

  .service-main {
    flex: 1;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .el-input {
      width: 200px;
    }
  }

  .mr {
    margin-right: 10px;
  }

  ::v-deep .el-tree-node__content {
    font-size: 14px;
  }

  .add-service {
    text-align: center;
    margin: 5px 0;
  }
}

.el-select {
  width: 100%;
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

.background {
  background-color: white;
}

.el-cascader {
  width: 350px;
}
</style>
