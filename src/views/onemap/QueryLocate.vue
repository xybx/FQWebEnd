<!--
 * @Author: WCL
 * @Date: 2022-02-11 11:30:15
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-03 15:48:11
 * @FilePath: \fjsy-web\src\views\onemap\QueryLocate.vue
 * @Description: 统一平台 - 查询定位
-->
<template>
  <div class='container'>
    <!-- 顶部表单 -->
    <el-row :gutter='20'>
      <el-col :span='4'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.keyWord' placeholder='根据名称搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='12'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
              查询
            </el-button>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addType'
                       v-if="isAdmin == 'true'">
              新增
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div style='margin-top: 10px'>
      <el-table style='font-size:15px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='pid' label='PID' width='80' align='center'></el-table-column>
        <el-table-column prop='servername' label='名称' align='center'></el-table-column>
        <el-table-column prop='layername' label='图层服务' align='center'></el-table-column>
        <el-table-column prop='queryfield' label='查询字段' align='center'></el-table-column>
        <el-table-column prop='showfield' label='显示字段' align='center'></el-table-column>
        <el-table-column prop='sort' label='排序' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)' v-if="isAdmin == 'true'">编辑
            </el-button>
            <el-button type='text' icon='el-icon-delete' class='red' @click='handleDelete(scope.row)'
                       v-if="isAdmin == 'true'"
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
        :title='setTitle'
        :visible.sync='setVisible'
        width='30%'
        custom-class='set-dialog'
        @close='closedSetDialog'
        :close-on-click-modal='false'
    >
      <el-form ref='setForm' :model='setForm' label-width='auto' class='set-form' :rules='setFormRules'>
        <el-form-item label='服务类型' prop='type'>
          <el-select v-model='setForm.type' placeholder='请先选择服务类型'>
            <el-option v-for='item in servertypelist' :key='item.name' :label='item.name' :value='item.type' />
          </el-select>
        </el-form-item>
        <el-form-item label='服务名称' prop='servername'>
          <el-select v-if="setForm.type === 2" v-model='setForm.servername' filterable @change='changeWebGis' placeholder='请选择地图服务'>
            <el-option v-for='item in webgisLayers' :key='item.NAME' :label='item.NAME' :value='item.NAME'></el-option>
          </el-select>
          <el-input v-if="setForm.type === 3" v-model='setForm.servername' placeholder='请输入地图服务'/>
        </el-form-item>
        <el-form-item v-if="setForm.type === 3" label='服务地址' prop='servername'>
          <el-input v-model='setForm.serverurl' placeholder='请输入地图服务地址'/>
        </el-form-item>
        <el-form-item label='图层名称' prop='layername'>
          <el-select v-if="setForm.type === 2" v-model='setForm.layername' filterable @change='changeLayer' placeholder='请先选择地图服务'>
            <el-option v-for='item in layerList' :key='item.name' :label='item.name' :value='item.name'></el-option>
          </el-select>
          <el-input v-if="setForm.type === 3" v-model='setForm.layername' placeholder='请输入图层名称'/>
        </el-form-item>
        <el-form-item v-if="setForm.type === 3" label='图层id' prop='layerid'>
          <el-input v-model='setForm.layerid' placeholder='请输入图层id'/>
        </el-form-item>
        <el-form-item label='查询字段' prop='queryfield'>
          <el-select v-if="setForm.type === 2" v-model='setForm.queryfield' filterable @change='changeWebGis' placeholder='请先选择图层服务'>
            <el-option v-for='item in fieldList' :key='item.name' :label='item.name' :value='item.name'></el-option>
          </el-select>
          <el-input v-if="setForm.type === 3" v-model='setForm.queryfield' placeholder='请输入查询字段'/>
        </el-form-item>
        <el-form-item label='显示字段' prop='showfield'>
          <el-select v-if="setForm.type === 2" v-model='setForm.showfield' filterable @change='changeWebGis' placeholder='请先选择图层服务'>
            <el-option v-for='item in fieldList' :key='item.name' :label='item.name' :value='item.name'></el-option>
          </el-select>
          <el-input v-if="setForm.type === 3" v-model='setForm.showfield' placeholder='请输入显示字段'/>
        </el-form-item>
        <el-form-item label='排序' prop='sort'>
          <el-input-number v-model='setForm.sort'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='setVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveAdd'>确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLocateLayers,
  saveLocateLayer,
  delLocateLayer,
  getChildServerUrl,
  GetLayerField
} from '@/api/onemap/querylocate-api';
import { getWebGis } from '@/api/onemap/hxdownload-api';

export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      queryParam: {
        keyWord: '',
        page: 1,
        pageSize: 10
      },
      isAdmin: false,
      tableData: [],
      setVisible: false,
      setTitle: '',
      total: 0,
      type: '二维',
      servertypelist: [
        {
          type: 2,
          name: '二维'
        },
        {
          type: 3,
          name: '三维'
        }
      ],
      setForm: {
        pid: 0,
        servername: '',
        serverurl: '',
        layerid: '',
        layername: '',
        queryfield: '',
        showfield: '',
        sort: 0,
        type: 2
      },
      setFormRules: {
        servername: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '服务类型不能为空', trigger: 'blur' }],
        layername: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
        queryfield: [{ required: true, message: '查询字段不能为空', trigger: 'blur' }],
        layerid: [{ required: true, message: '图层id不能为空', trigger: 'blur' }],
        showfield: [{ required: true, message: '显示字段不能为空', trigger: 'blur' }]
      },
      layerList: [],
      fieldList: [],
      webgisLayers: [],
      webgisLayerId: ''
    };
  },
  computed: {},
  watch: {
    $route: {
      handler(val) {
        this.setForm.moduletype = this.$route.query.type;
        this.getData();
      }
    },
    setVisible(boo) {
      if (boo) {
        this.getWebGisData();
      }
    }
  },
  created() {
  },
  mounted() {
    this.isAdmin = sessionStorage.getItem('isadmin');
    this.setForm.moduletype = this.$route.query.type;
    if (this.$route.query.type == undefined || this.$route.query.type == '') {
      this.setForm.moduletype = 1;
    }
    this.getData();
  },
  methods: {
    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      this.getData();
    },
    buttonQueryList() {
      this.queryParam.page = 1;
      this.getData();
    },
    // 获取地图服务列表
    async getWebGisData() {
      const res = await getWebGis();
      if (res.code === 200) {
        this.webgisLayers = res.data;
      }
    },
    changeLayer(val) {
      let arr = this.layerList.filter((item) => {
        if (item.name === val) {
          return item;
        }
      });
      this.setForm.layerid = arr[0].id;
      this.setForm.layername = arr[0].name;
      this.setForm.queryfield = '';
      this.setForm.showfield = '';
      this.fieldList = [];

      let param = {
        id: this.setForm.layerid,
        url: this.setForm.serverurl
      };
      GetLayerField(param).then(res => {
        if (res.code == 200) {
          this.fieldList = res.data;
        }
      });
    },
    // 选择地图服务
    changeWebGis(val) {
      let arr = this.webgisLayers.filter((item) => {
        if (item.NAME === val) {
          return item;
        }
      });
      this.setForm.servername = arr[0].NAME;
      this.setForm.serverurl = arr[0].URL;
      this.setForm.layerid = '';
      this.setForm.layername = '';
      this.setForm.queryfield = '';
      this.setForm.showfield = '';
      this.fieldList = [];
      this.layerList = [];
      let param = {
        url: this.setForm.serverurl
      };
      // 根据地址获取图层layer列表
      getChildServerUrl(param).then(res => {
        if (res.code == 200) {
          this.layerList = res.data;
        }
      });
    },

    // 新增
    addType() {
      this.setTitle = '新增';
      this.setVisible = true;
    },

    // 获取列表数据
    async getData() {
      const res = await getLocateLayers(this.queryParam);
      if (res.code === 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },

    // 弹窗确定
    saveAdd() {
      this.$refs.setForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        const res = await saveLocateLayer(this.setForm);
        if (res.code === 200) {
          this.$message.success(`${this.setTitle}成功`);
          this.setVisible = false;
          this.getData();
        }
      });
    },

    // 关闭窗口
    closedSetDialog() {
      this.$refs.setForm.resetFields();
      this.setForm = this.$options.data().setForm;
    },

    // 编辑
    handleEdit(row) {
      console.log(row);
      this.setTitle = '编辑';
      this.setVisible = true;
      Object.assign(this.setForm, row);

      if (row.type == 2) {
        let param1 = {
          url: this.setForm.serverurl
        };
        // 根据地址获取图层layer列表
        getChildServerUrl(param1).then(res => {
          if (res.code == 200) {
            this.layerList = res.data;
          }
        });

        let param = {
          id: this.setForm.layerid,
          url: this.setForm.serverurl
        };
        GetLayerField(param).then(res => {
          if (res.code == 200) {
            this.fieldList = res.data;
          }
        });
      }
    },

    // 删除
    async handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let params = {
              id: row.pid
            };
            const res = await delLocateLayer(params);
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getData();
            }
          })
          .catch(() => {
          });


    },

    // 子图层
    handleChild(row) {
      console.log(row);
      this.$router.push({
        path: '/locatechild',
        query: {
          id: row.PID
        }
      });
    }
  }
};
</script>

<style scoped lang='scss'>
@import '@/assets/scss/common.scss';

.el-select {
  width: 100%;
}
</style>
