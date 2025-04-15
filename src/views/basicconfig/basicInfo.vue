<!--
 * @Author: WCL
 * @Date: 2022-02-08 16:04:14
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-22 11:19:16
 * @FilePath: \3d-web\src\views\basicconfig\basicInfo.vue
 * @Description: 三维基础信息
-->
<template>
    <div class="container">
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item style="width: 40%" label="服务用户名" prop="username">
                    <el-input v-model.trim="setForm.username" placeholder="请输入服务用户名"></el-input>
                </el-form-item>
                <el-form-item style="width: 40%" label="服务密码" prop="password">
                    <el-input v-model.trim="setForm.password" placeholder="请输入服务密码"></el-input>
                </el-form-item>
                <el-form-item style="width: 40%" label="服务地址" prop="server">
                    <el-input v-model.trim="setForm.server" placeholder="请输入服务地址"></el-input>
                </el-form-item>
                <el-form-item style="width: 40%" label="服务获取token地址" prop="tokenurl">
                    <el-input v-model.trim="setForm.tokenurl" placeholder="请输入服务获取token地址"></el-input>
                </el-form-item>
            </el-form>
            <span style="margin-left: 35%" slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
    </div>
</template>

<script>
import { gaochengGetList, gaochengSaveServer, gaochengDelServer } from '@/api/gaochengData-api';
import { queryData, saveOrEdit } from '@/api/basicInfo-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin: false,
            // 查询关键字
            queryname: '',
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            setForm: {
                pid: 0,
                username: '',
                password: '',
                server: '',
                tokenurl: '',
            },
            setFormRules: {
                username: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                password: [{ required: true, message: 'url不能为空', trigger: 'blur' }],
                server: [{ required: true, message: 'url不能为空', trigger: 'blur' }],
                tokenurl: [{ required: true, message: 'url不能为空', trigger: 'blur' }],
            },
            setTitle: '',
            setVisible: false
        };
    },
    computed: {},
    watch: {},
    created() { },
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.getData();
    },
    methods: {
        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 搜索
        handleSearch() {
            let form = {
                keyword: this.queryname
            };
            this.getData();
        },

        // 当前页点击
        handlePageChange(val) {
            this.currentPage = val;
            let form = {
                keyword: this.queryname
            };
            this.getData();
        },

        // 获取列表数据
        async getData() {

            const res = await queryData();
            if (res.code === 200) {
                Object.assign(this.setForm, res.data);
            }
        },

        // 弹窗确认
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveOrEdit(this.setForm);
                if (res.code === 200) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getData();
                }
            });
        },

        // 弹窗关闭
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
                    const res = await gaochengDelServer(row.PID);
                    if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.getData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
</style>