<template>
  <div class='iconmanage'>
    <el-card class="box-card">
      <div class="text item">
        <el-button type='primary' round @click='addGroup'>新增图标组</el-button>
        <el-table v-loading="tabloading" :data="tableData" :row-key="row=>{return row.pid}" tooltip-effect="dark" :element-loading-text="loadingText" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
          <el-table-column label="图标(组)名称" align="center">
            <template v-slot="scope">
              <span v-if="!scope.row.children" class="noch">{{scope.row.name}}</span>
              <template v-else>
                {{scope.row.groupname}}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="图标样式" align="center">
            <template #default="{row,$index}">
              <span v-if="!row.icon">(无)</span>
              <i v-if="row.icon" class="iconfont" :class="row.icon"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="success" plain round size="small" @click="editClick(scope.row)">修改</el-button>
              <el-button type="danger" plain round size="small" @click="delClick(scope.row)">删除</el-button>
              <el-button v-if="scope.row.children" type="primary" round size="small" @click="addSingle(scope.row.pid)">新增图标</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog class="icondialog" :title="title" :visible.sync="DialogVisible" width="30%" :append-to-body='true' :close-on-click-modal='false' :before-close='handleClose' center>
        <el-form ref="formData" :model="formData" :rules="formRules" label-width="110px">
          <template v-if="keys == 1">
            <el-form-item label="图标组名称" prop="groupname">
              <el-input v-model="formData.groupname" placeholder="请输入图标组名称" @input="()=>{this.$forceUpdate()}" />
            </el-form-item>
            <el-form-item label="图标组排序">
              <el-input-number v-model="formData.ordernum" :min="1" placeholder="请输入图标组排序" />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="图标名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入图标名称" @input="()=>{this.$forceUpdate()}" />
            </el-form-item>
            <el-form-item label="图标iconfont" prop="icon">
              <el-input v-model="formData.icon" placeholder="请输入图标iconfont" @input="()=>{this.$forceUpdate()}" />
            </el-form-item>
            <el-form-item label="图标排序">
              <el-input-number v-model="formData.ordernum" :min="1" placeholder="请输入图标排序" />
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveData">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTreeData, delTreeGroup, delTreeItem, putTreeGroup, putTreeItem } from '../../api/iconManage-api';
export default {
  name: 'IconManage',
  data(){
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      formData:{},
      rowkey:['5'],
      DialogVisible:false,
      title:'',
      keys:null,
      formRules:{
        groupname:[{required: true, trigger: "blur", message: "请输入图标组名称"}],
        name:[{required: true, trigger: "blur", message: "请输入图标名称"}],
        icon:[{required: true, trigger: "blur", message: "请输入图标iconfont"}]
      },
      fpid:null,
    }
  },
  created() {
  },
  mounted() {
    this.getTableData()
  },
  methods:{
    addGroup(){
      this.title = '新增图标组'
      this.keys = 1
      this.DialogVisible = true
    },
    addSingle(pid){
      this.fpid = pid
      this.title = '新增图标'
      this.keys = 2
      this.DialogVisible = true
    },
    async getTableData(){
      let res = await getTreeData()
      this.tableData = res.data.length > 0 ? res.data.map(item=>{
        return {
          pid:item.pid,
          groupname:item.groupname,
          ordernum:item.ordernum,
          children:item.icontypes.length > 0 ? item.icontypes.map(val=>{
            return {
              pid:val.pid+100,
              groupid:val.groupid,
              name:val.name,
              icon:val.icon,
              ordernum:val.ordernum,
            }
          }) : []
        }
      }) : []
      setTimeout(()=>{
        this.tabloading = false
      },2000)
    },
    saveData(){
      this.$refs.formData.validate(async (valid)=>{
          if(valid){
            let obj = this.formData
            this.keys ==1 ? obj: this.formData.pid ? Object.assign(obj,{groupid:this.fpid,pid:this.formData.pid-100}):Object.assign(obj,{groupid:this.fpid})
            let res = this.keys == 1 ? await putTreeGroup(obj) :await putTreeItem(obj)
            if(res.code == 200){
              this.$message.success(this.formData.pid ? '修改成功':'添加成功')
              this.handleClose()
              this.getTableData()
            }
          }else {
            return false
          }
      })
    },
    handleClose(){
      this.title = ''
      this.keys = null
      this.fpid = null
      this.$refs.formData.resetFields()
      this.formData = this.$options.data().formData
      this.DialogVisible = false
    },
    editClick(obj){
      this.title = obj.icon ? '编辑图标':'编辑图标组'
      this.keys = obj.icon ? 2 : 1
      this.fpid = obj.icon ? obj.groupid : null
      this.formData = obj
      this.DialogVisible = true
    },
    delClick(obj){
      let pid = obj.icon ? obj.pid-100 : obj.pid
      this.$confirm('你确定要删除吗？','删除提示',{type:'warning'}).then(async ()=>{
        let res = obj.icon ? await delTreeItem({pid:pid}) : await delTreeGroup({pid:pid})
        if(res.code == 200){
          this.$message.success('已删除')
          this.getTableData()
        }
      }).catch(()=>{
        this.$message.info('取消删除')
        return false
      })
    },
  },
};
</script>
<style scoped lang='scss'>
.iconmanage{
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-card{
    display:flex;
    flex-direction: column;
    flex:1;
    ::v-deep{
      .el-card__body{
        display:flex;
        flex-direction: column;
        height:100%;
        overflow-y:auto;
        .el-pagination{
          text-align: center;
        }
        .el-table{
          margin:20px 0;
          tr{
            th{
              .cell{
                font-size: 14px;
              }
            }
            td{
              .cell{
                font-size:14px;
                .el-table__expand-icon{
                  .el-icon-arrow-right{
                    font-size: 15px;
                  }
                }
                &>span{
                  font-size: 14px;
                }
                &>i{
                  font-size:24px;
                  color:#2d8cf0;
                }
              }
            }
          }
        }
      }
    }
  }
}

</style>