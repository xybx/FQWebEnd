<!--
 * @Author: ssq
 * @Date: 2022-09-26 15:47:10
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 11:18:24
 * @FilePath: \fjsy-web\src\views\highQuality\highQuality.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
-->
<template>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="4">
                <div class="grid-content bg-purple">
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div>
                        <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="clearData">
                            清空数据</el-button>
                        <el-button type="primary" icon="el-icon-upload2" class="handle-del mr10" @click="importExcel">
                            导入数据</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-dialog title="导入数据" :visible.sync="importData" width="30%" :before-close="handleImportDataClose">
            <el-upload class="upload-demo" :action="importUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                :headers="headers" accept=".xlsx" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed"
                :on-success="onSuccess" :file-list="fileList">
                <el-button size="small" type="primary">点击导入</el-button>
                <div slot="tip" class="el-upload__tip">如果不先清空数据就是增量导入！如需覆盖导入请先清空数据！</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importData = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { delAll } from '@/api/highQuality-api';
export default {
    name: "highQuality",
    data() {
        return {
            importData: false,
            importURL: '',
            fileList: [],
        }
    },
    computed: {
        // 上传时需要的请求头
        headers() {
            const token = sessionStorage.getItem('token');
            return {
                Authorization: token
            };
        },
    },
    mounted() {
    },
    created() {
        this.initImportUrl();
    },
    methods: {
        clearData() {
            this.$confirm('此操作将清空全部数据，将会导致展示页面部分时间内无数据！建议在非工作时间清空！', '提示', {
                confirmButtonText: '清空',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    delAll().then(res => {
                        if (res.code == 200) {
                            this.$message.success("清空成功！");
                        } else { 
                            this.$message.error(res.msg);
                        }
                    })
                })
                .catch(() => {
                    this.$message.info('已取消清空');
                });
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
            console.log("上传成功结果 -> ", response)
            if (response.code == 200) {
                this.$message.success(response.msg)
                // 关闭对话框，刷新列表
                this.importData = false;
                this.queryHistoryprjList();
            } else {
                this.$message.warning(response.msg)
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
            this.importUrl = window.apiURL + "/highQuality/import";
        },
        handleImportDataClose(done) {
            done();
        },
    }
}
</script>