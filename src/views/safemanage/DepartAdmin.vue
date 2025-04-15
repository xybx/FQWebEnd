<!--
 * @Author: WCL
 * @Date: 2022-02-11 16:34:48
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 09:38:20
 * @FilePath: \fjsy-web\src\views\safemanage\DepartAdmin.vue
 * @Description: 安全管理 - 部门管理
-->
<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-refresh" class="handle-del mr10" @click="addDepart">同步部门</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="keywords" placeholder="请输入部门名称搜索" class="handle-input fr"></el-input>
            <!-- <el-button type="primary" @click="ownUpdataOffice">同步科室</el-button> -->
        </div>

        <el-table style="font-size: 15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="pid" label="PID" width="280" align="center"></el-table-column>
            <el-table-column prop="name" label="部门名称" align="center"></el-table-column>
            <!-- <el-table-column prop="code" label="所属行政区编号"></el-table-column> -->
            <el-table-column prop="describe" label="描述" width="300" align="center"></el-table-column>
            <el-table-column prop="isenable" label="是否禁用" align="center">
                <template slot-scope="scope">
                    {{ scope.row.isenable == 0 ? '禁用' : '启用' }}
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :current-page="pageNum"
                :page-size="pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            :title="setTitle"
            :visible.sync="setVisible"
            width="35%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <div>
              同步部门注意事项：
              <br>
              1.同步部门是根据福清部门数据同步，如果部门数据有更改，同步的数据完全按照最新的数据来更新；
              <br>
              2.同步部门会同时同步部门下的用户；
              <br>
              3.同步数据耗时根据数据量决定，也与网络情况有关。点击同步按钮后请耐心等待。如果同步时间过长请联系管理员查看！
              <br>
              4.为良好的系统体验，同步数据时请先联系各个部门通知，尽量不要在工作时间同步数据；
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button :loading='syncLoading' type="primary" @click="sync">同 步</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getList, getXZQList, saveOffice, enableOffice, UpdataOffice, syncData } from '@/api/safeadmin/depart-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            keywords: '',
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            pageTotal: 0,
            setForm: {
                pid: 0,
                name: '',
                describe: '',
                code: '',
                serial: ''
            },
            syncLoading: false,
            setFormRules: {
                name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
                code: [{ required: true, message: '请选择部门', trigger: 'change' }]
            },
            xzqList: [],
            setVisible: false,
            setTitle: '新增'
        };
    },
    computed: {},
    watch: {
        setVisible(boo) {
            if (boo) {
                this.getXZQ_List();
            }
        }
    },
    created() {},
    mounted() {
        this.getList();
    },
    methods: {
        // 获取图层
        async getList(form) {
            let params = {
                keywords: this.keywords,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            if (form?.keywords) {
                Object.assign(params, form);
            }
            const res = await getList(params);
            if (res.code === 200) {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            }
        },
        // //获取行政区列表
        // async getXZQ_List() {
        //     const res = await getXZQList();
        //     if (res.code  === 200) {
        //         this.xzqList = res.data;
        //     }
        // },

        handleChange(value) {
            this.setForm.code = value[value.length - 1];
            console.log(this.setForm.code);
        },
        //添加部门
        addDepart() {
            this.setTitle = '同步部门';
            this.setVisible = true;
        },
        //编辑赋值
        handleEdit(row) {
            console.log(row);
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
        },
        //保存
        save() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveOffice(this.setForm);
                debugger;
                if (res.code  === 200) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getList();
                }
            });
        },
      // 同步部门数据，同时同步用户
      sync() {
        if (this.syncLoading) {
          this.$message.warning("请勿重复点击同步！")
        }
        this.syncLoading = true;
        syncData().then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getList();
            this.setVisible = false;
          }
          this.syncLoading = false;
        })
      },
        //添加用户
        addUserList(row) {
            console.log(row);
            this.$router.push({
                path: '/peopleadmin',
                query: {
                    officeid: row.pid
                }
            });
        },
        //删除
        async handleDelete(row) {
            let params = {
                pid: row.pid,
                isenable: row.isenable == 0 ? 1 : 0
            };
            const res = await enableOffice(params);
            if (res.code  === 200) {
                this.$message.success('操作成功');
                this.getList();
            }
        },
        //搜索
        handleSearch() {
            let form = {
                keyword: this.keywords
            };
            this.getList(form);
        },

        // 页码切换
        handlePageChange(val) {
            this.pageNum = val;
            let form = {
                keyword: this.keywords
            };
            this.getList(form);
        },

        // 关闭新增，编辑的弹窗
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },
        ///同步科室
        async ownUpdataOffice() {
            let params = {
                token:'hydp888'
            }
            const res = await UpdataOffice(params);
            console.log(params);
            console.log(res);
            if (res.code  === 200) {
                this.$message.success(`${this.setTitle}成功`);
                this.getList();
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
::v-deep .set-dialog {
    .el-cascader {
        width: 100%;
    }
}
</style>
