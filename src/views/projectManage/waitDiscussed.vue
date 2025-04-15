<template>
    <!-- 全部内容 -->
    <el-container>
        <!-- 筛选项 -->
        <el-header>
            <el-form :inline="true" :label-position="labelPosition" label-width="auto" :model="formInline"
                class="demo-form-inline">
                <el-form-item label="项目编号">
                    <el-input v-model="formInline.pid" placeholder="请输入项目编号"></el-input>
                </el-form-item>
                <el-form-item label="建设单位">
                    <el-input v-model="formInline.buildUnit" placeholder="请输入建设单位"></el-input>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-input v-model="formInline.pname" placeholder="请输入项目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <!-- 该行作为布局位置占位符 -->
                </el-form-item>
                <el-form-item label="设计单位">
                    <el-input v-model="formInline.designUnit" placeholder="请输入设计单位"></el-input>
                </el-form-item>
                <el-form-item label="发起日期">
                    <el-date-picker v-model="formInline.sendTime" type="monthrange" range-separator="至"
                        start-placeholder="开始月份" end-placeholder="结束月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发起人">
                    <el-input v-model="formInline.promoter" placeholder="请输入发起人"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="search">查询</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <!-- 筛选项 -->

        <!-- 列表 -->
        <el-main>
            <!-- 按钮集 -->
            <div class="btn">
                <el-button class="add" @click="add">新增项目</el-button>
                <el-button class="transimit" @click="transimit">转正在会商</el-button>
                <el-button class="repeal" @click="repeal">隐藏项目</el-button>
            </div>
            <!-- 按钮集 -->

            <!-- 列表 -->
            <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="70"> </el-table-column>
                <el-table-column label="序号" type="index" width="70" align="center"> </el-table-column>
                <el-table-column prop="prjno" label="项目编号" align="center"> </el-table-column>
                <el-table-column prop="constructionname" label="建设单位" align="center"> </el-table-column>
                <el-table-column prop="prjname" label="项目名称" align="center"> </el-table-column>
                <el-table-column prop="designunit" label="设计单位" align="center"> </el-table-column>
                <el-table-column prop="starttime" label="发起日期" align="center"> </el-table-column>
                <el-table-column prop="principal" label="发起人" align="center"> </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑项目</el-button>
                        <el-button type="text" size="mini" @click="handleDesign(scope.row)">设计汇演</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 列表 -->

            <!-- 页码 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 页码 -->
        </el-main>
        <!-- 列表 -->

        <!-- 编辑项目弹窗 -->
        <el-dialog title="编辑项目" :visible.sync="dialogVisible" width="35%" custom-class="set-dialog"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="项目名称">
                    <el-input v-model="form.prjname"></el-input>
                </el-form-item>
                <el-form-item label="三维模型">
                    <el-select v-model="form.kind" placeholder="请选择三维模型">
                        <el-option v-for="item in mapTypes" :key="item.pid" :label="item.label"
                            :value="item.kind"></el-option>
                    </el-select>
                    <el-input v-model="form.modelurl" placeholder="三维模型URL"></el-input>
                </el-form-item>
                <el-form-item label="项目简介">
                    <quill-editor class="ql-editor" v-model="form.prjintro" :options="editorOption"> </quill-editor>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="editSaveData(form)">保存</el-button>
                <!-- <el-button @click="design">设计汇演</el-button> -->
            </span>
        </el-dialog>
        <!-- 编辑项目弹窗 -->

        <!-- 新增项目弹窗 -->
        <el-dialog title="新增项目" :visible.sync="addDialogVisible" width="35%" custom-class="set-dialog"
            :before-close="handleClose2">
            <el-form ref="form2" :model="form2" label-width="100px">
                <el-form-item label="项目名称">
                    <el-input v-model="form2.name"></el-input>
                </el-form-item>
                <el-form-item label="三维模型">
                    <el-select v-model="form.region" placeholder="请选择三维模型">
                        <el-option v-for="item in mapTypes" :key="item.pid" :label="item.label"
                            :value="item.kind"></el-option>
                    </el-select>
                    <el-input v-model="form2.url" placeholder="三维模型URL"></el-input>
                </el-form-item>
                <el-form-item label="项目简介">
                    <quill-editor class="ql-editor" v-model="form2.content" :options="editorOption2"> </quill-editor>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="addSaveData(form2)">保存</el-button>
                <!-- <el-button v-show="view" @click="addDesign">设计汇演</el-button> -->
            </span>
        </el-dialog>
        <!-- 新增项目弹窗 -->
    </el-container>
    <!-- 全部内容 -->
</template>

<script type="module">
export { default } from '@/views/projectManage/js/waitDiscussed';
</script>

<style scoped lang="scss">
@import '@/views/projectManage/style/waitDiscussed.scss';
</style>
