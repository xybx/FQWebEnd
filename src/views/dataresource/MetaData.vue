<template>
  <div class='container'>
    <div style='width: 50%'>
      <el-row :gutter='20'>
        <el-col :span='6'>
          <el-select v-model='queryParam.firstClass' @clear='clearFirstClassChange' clearable @change='firstClassChange'
                     placeholder='请选择一级类'>
            <el-option
                v-for='item in firstClassList'
                :key='item.PID'
                :label='item.SNAME'
                :value='item.PID'>
            </el-option>
          </el-select>
        </el-col>

        <el-col :span='6'>
          <el-select v-model='queryParam.secondClass' clearable placeholder='请选择二级类'>
            <el-option
                v-for='item in secondClassList'
                :key='item.PID'
                :label='item.SNAME'
                :value='item.PID'>
            </el-option>
          </el-select>
        </el-col>

        <el-col :span='8'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keyWord' placeholder='根据产品名称或产品简介匹配搜索'></el-input>
            </div>
          </div>
        </el-col>

        <el-col :span='4'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
                搜索
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              header-cell-class-name='table-header'>
      <el-table-column prop='pid' label='PID' align='center' width='120'></el-table-column>
      <el-table-column prop='productName' label='产品名称' align='center'></el-table-column>
      <el-table-column prop='productLevel' label='产品级别' align='center'></el-table-column>
      <el-table-column prop='makeDate' label='生产日期' align='center'></el-table-column>
      <el-table-column prop='productBrief' label='产品摘要' align='center'></el-table-column>
      <el-table-column prop='type' label='格式类型' align='center'></el-table-column>
      <el-table-column label='操作' align='center'>
        <template slot-scope='scope'>
          <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
          <el-button type='text' icon='el-icon-search' confirm @click='handleDetail(scope.row)'>详情</el-button>
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
        title='元数据'
        :visible.sync='metaDataFlag'
        width='60%'
        @close='closeMetaData'
        custom-class='set-dialog'
        :close-on-click-modal='false'>
      <el-form ref='metaDataRef' :disabled='metaDataDisableFlag' :model='metaData' label-width='auto'>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='产品名称' prop='productName'>
              <el-input v-model='metaData.productName' placeholder='请输入产品名称'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='产品级别' prop='productLevel'>
              <el-input v-model='metaData.productLevel' placeholder='请输入产品级别'></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='生产日期' prop='makeDate'>
              <el-date-picker
                  format='yyyy年MM月dd日'
                  value-format='yyyy-MM-dd'
                  v-model='metaData.makeDate'
                  type='date'
                  placeholder='请选择生产日期'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='产品摘要' prop='productBrief'>
              <el-input v-model='metaData.productBrief' placeholder='请输入产品摘要'></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='格式类型' prop='type'>
              <el-input v-model='metaData.type' placeholder='请输入格式类型'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='产品时点' prop='productTiming'>
              <el-date-picker
                  format='yyyy年MM月dd日'
                  value-format='yyyy-MM-dd'
                  v-model='metaData.productTiming'
                  type='date'
                  placeholder='请选择产品时点'>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='数据质量' prop='dataQuality'>
              <el-input v-model='metaData.dataQuality' placeholder='请输入数据质量'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='坐标系统' prop='locationSystem'>
              <el-input v-model='metaData.locationSystem' placeholder='请输入坐标系统'></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='高程基准' prop='gaocheng'>
              <el-input v-model='metaData.gaocheng' placeholder='请输入高程基准'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='分辨率' prop='resolution'>
              <el-input v-model='metaData.resolution' placeholder='请输入分辨率'></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='生产单位名称' prop='productionUnitName'>
              <el-input v-model='metaData.productionUnitName' placeholder='请输入生产单位名称'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='生产单位电话' prop='productionUnitPhoneNum'>
              <el-input v-model='metaData.productionUnitPhoneNum' placeholder='请输入生产单位电话'></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='生产单位地址' prop='productionUnitAddress'>
              <el-input v-model='metaData.productionUnitAddress' placeholder='请输入生产单位地址'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='质检单位名称' prop='checkUnitName'>
              <el-input v-model='metaData.checkUnitName' placeholder='请输入质检单位名称'></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='安全涉密等级' prop='confidentialLevel'>
              <el-select v-model='metaData.confidentialLevel' placeholder='请选择安全涉密等级'>
                <el-option
                    v-for='item in securityLevelList'
                    :key='item.name'
                    :label='item.name'
                    :value='item.name'>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='数据创建日期' prop='dataCreateTime'>
              <el-date-picker
                  format='yyyy年MM月dd日'
                  value-format='yyyy-MM-dd'
                  v-model='metaData.dataCreateTime'
                  type='date'
                  placeholder='请选择数据创建日期'>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20'>
          <el-col :span='12'>
            <el-form-item label='订阅消息' prop='subscriptionMessage'>
              <el-input type='textarea' :rows="2" v-model.trim='metaData.subscriptionMessage' placeholder='请输入订阅消息'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot='footer'>
        <el-button @click='closeMetaData'>取 消</el-button>
        <el-button :loading='metaDataSaveFlag' type='primary' @click='saveMetaData()'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { metaDataList, initClassList, saveMetaDataApi } from '@/api/LayerMetaData-api';

export default {
  name: 'metaData',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        firstClass: undefined,
        secondClass: undefined,
        keyWord: undefined,
        page: 1,
        pageSize: 10
      },
      total: 0,
      firstClassList: [],
      secondClassList: [],
      metaDataFlag: false,
      metaDataSaveFlag: false,
      metaDataDisableFlag: false,
      metaData: {
        productName: '',
        productLevel: '',
        makeDate: '',
        productBrief: '',
        type: '',
        productTiming: '',
        dataQuality: '',
        locationSystem: '',
        gaocheng: '',
        resolution: '',
        productionUnitName: '',
        productionUnitPhoneNum: '',
        productionUnitAddress: '',
        checkUnitName: '',
        confidentialLevel: '',
        dataCreateTime: '',
        subscriptionMessage: undefined
      },
      metaDataRules: {
        productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
        productLevel: [{ required: true, message: '产品级别不能为空', trigger: 'blur' }],
        makeDate: [{ required: true, message: '生产日期不能为空', trigger: 'blur' }],
        productBrief: [{ required: true, message: '产品摘要不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '格式类型不能为空', trigger: 'blur' }],
        productTiming: [{ required: true, message: '产品时点不能为空', trigger: 'blur' }],
        dataQuality: [{ required: true, message: '数据质量不能为空', trigger: 'blur' }],
        locationSystem: [{ required: true, message: '坐标系统不能为空', trigger: 'blur' }],
        gaocheng: [{ required: true, message: '高程基准不能为空', trigger: 'blur' }],
        resolution: [{ required: true, message: '分辨率不能为空', trigger: 'blur' }],
        productionUnitName: [{ required: true, message: '生产单位名称不能为空', trigger: 'blur' }],
        productionUnitPhoneNum: [{ required: true, message: '生产单位电话不能为空', trigger: 'blur' }],
        productionUnitAddress: [{ required: true, message: '生产单位地址不能为空', trigger: 'blur' }],
        checkUnitName: [{ required: true, message: '质检单位名称不能为空', trigger: 'blur' }],
        confidentialLevel: [{ required: true, message: '安全涉密等级不能为空', trigger: 'change' }],
        subscriptionMessage: [{ required: true, message: '订阅消息不能为空', trigger: 'blur' }],
        dataCreateTime: [{ required: true, message: '数据创建日期不能为空', trigger: 'blur' }]
      },
      securityLevelList: [
        {
          name: '涉密'
        },
        {
          name: '政务'
        },
        {
          name: '公众'
        }
      ]
    };
  },
  computed: {

  },
  mounted() {
    this.initFirstClass();
    this.queryList();
  },
  created() {
  },
  methods: {
    initFirstClass() {
      initClassList().then(res => {
        if (res.code == 200) {
          this.firstClassList = res.data;
        }
      });
    },
    initSecondClass(val) {
      if (val == '') {
        return;
      }
      initClassList({ classId: val }).then(res => {
        this.secondClassList = res.data;
      });
    },
    firstClassChange(val) {
      this.initSecondClass(val);
    },
    clearFirstClassChange() {
      this.queryParam.firstClass = undefined;
      this.queryParam.secondClass = undefined;
      this.secondClassList = [];
    },
    queryList() {
      metaDataList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    buttonQueryList() {
      this.queryParam.page = 1;
      metaDataList(this.queryParam).then(res => {
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
    handleEdit(row) {
      this.metaDataFlag = true;
      Object.assign(this.metaData, row);
    },
    handleDetail(row) {
      this.metaDataFlag = true;
      this.metaDataDisableFlag = true;
      Object.assign(this.metaData, row);
    },
    closeMetaData() {
      this.metaDataFlag = false;
      this.metaDataDisableFlag = false;
      this.$refs.metaDataRef.resetFields();
    },
    saveMetaData() {
      this.$refs.metaDataRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入必填项');
        if (this.metaDataSaveFlag) {
          this.$message.warning('请勿重复点击！');
          return;
        }
        this.metaDataSaveFlag = true;
        saveMetaDataApi(this.metaData).then(res => {
          if (res.code == 200) {
            this.$message.success('操作成功');
            this.metaDataFlag = false;
          }
          this.metaDataSaveFlag = false;
          this.queryList();
        });
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import '@/assets/scss/common.scss';

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