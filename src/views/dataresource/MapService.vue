<!--
 * @Author: WCL
 * @Date: 2022-01-25 10:43:26
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-30 10:11:58
 * @FilePath: \3d-web\src\views\dataresource\MapService.vue
 * @Description: 地图服务
-->
<template>
    <div class="container">
        <div class="service-aside">
            <div>
                <el-button class="add-service-button" @click="addService" type="success"> 新增根目录 </el-button>
                <el-button @click="addLayer" type="success">新增子节点</el-button>
                <el-button @click="editTree" type="primary">编辑选中</el-button>
                <el-button @click="delTree" type="danger">删除选中</el-button>
            </div>
            <el-tree
                style="margin-top: 5px"
                :data="treeData"
                :props="treeProps"
                :expand-on-click-node="false"
                highlight-current
                @node-click="handleNodeClick"
            >
                <span slot-scope="scope">
                    {{ scope.data.SNAME }}
                </span>
            </el-tree>
        </div>
        <div class="service-main">
            <div class="search-box">
                <el-button type="primary" size="small" @click="handleAdd">新增服务</el-button>
                <div>
                    <el-input v-model="searchTXT" placeholder="请输入关键字" class="mr"></el-input>
                    <el-button type="primary" size="small" @click="handleSearch" class="">搜索</el-button>
                </div>
            </div>
            <el-table style="font-size: 15px" :data="tableData" border stripe>
                <el-table-column prop="PID" label="PID" align="center"></el-table-column>
                <el-table-column prop="NAME" label="名称" align="center"></el-table-column>
                <el-table-column prop="URL" label="URL" align="center"></el-table-column>
                <el-table-column prop="PRJTYPE" label="项目类型" align="center">
                    <template v-slot="scope">
                        {{ scope.row.PRJTYPE === 1 ? 'arcgis' : scope.row.PRJTYPE === 2 ? 'cesium' : '全部' }}
                    </template>
                </el-table-column>
                <el-table-column prop="VISIBLE" label="是否可见" align="center">
                    <template v-slot="scope">
                        {{ scope.row.VISIBLE === 0 ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="ENABLE" label="是否启用" align="center">
                    <template v-slot="scope">
                        {{ scope.row.ENABLE === 0 ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="ORDERNUM" label="排序" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="scope">
                        <el-button size="mini" type="text" icon="el-icon-connection" class="blue" @click="handleProperty(scope.row)"
                            >属性绑定
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-notebook-2" class="blue" @click="handleMetaData(scope.row)"
                            >元数据
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.row)">编辑 </el-button>
                        <el-button size="mini" type="text" icon="el-icon-receiving" class="blue" @click="handleImgText(scope.row)">
                            图文关联
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)"
                            >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next, jumper"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹窗 -->
        <el-dialog title="编辑" :visible.sync="setVisible" width="30%" custom-class="set-dialog" :close-on-click-modal="false">
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules"></el-form>
        </el-dialog>

        <!-- 图层组弹窗 -->
        <el-dialog
            :title="groupTitle"
            :visible.sync="groupVisible"
            width="30%"
            custom-class="set-dialog"
            @closed="closedGroup"
            :close-on-click-modal="false"
        >
            <el-form ref="groupForm" :model="groupForm" label-width="auto" class="group-form" :rules="groupFormRules">
                <el-form-item label="名称" prop="SNAME">
                    <el-input v-model="groupForm.SNAME"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="DESCRIPTION">
                    <el-input v-model="groupForm.DESCRIPTION"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="CODE">
                    <el-input v-model="groupForm.CODE"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="SERIAL">
                    <el-input v-model.number="groupForm.SERIAL" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveGroupDialog">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="图文关联"
            :visible.sync="imgText"
            width="25%"
            @close="closeImgText"
            custom-class="set-dialog"
            :close-on-click-modal="false"
        >
            <el-form ref="imgTextRef" :model="imgTextData" label-width="auto" :rules="imgTextDataRules">
                <el-form-item label="关联字段" prop="field">
                    <el-input v-model="imgTextData.field" placeholder="请输入关联字段"></el-input>
                </el-form-item>
                <el-form-item label="关联URL" prop="url">
                    <el-input v-model="imgTextData.url" placeholder="请输入关联URL"></el-input>
                </el-form-item>
            </el-form>

            <div class="button-container">
                <el-button type="primary" @click="addChildNode">新增子节点</el-button>
                <el-upload
                    ref="uploadDocumentRef"
                    action="#"
                    :on-preview="uploadDocumentHandlePreview"
                    :multiple="false"
                    :limit="1"
                    :on-exceed="uploadDocumentHandleExceed"
                    :on-change="uploadDocumentChange"
                    :show-file-list="false"
                    :on-success="uploadDocumentOnSuccess"
                    :disabled="documentFileDisable"
                    :file-list="documentFileList"
                    :auto-upload="false"
                >
                    <el-button size="small" type="primary" @click="uploadDocumentCheck">上传文档</el-button>
                </el-upload>
                <el-button type="primary" @click="downloadDocument">下载文档</el-button>
                <el-button type="danger" @click="delNode">删除选中节点</el-button>
            </div>

            <div class="fileTree">
                <el-tree
                    ref="tree"
                    style="overflow-y: auto; height: 200px"
                    :data="fileTreeData"
                    :highlight-current="true"
                    :props="defaultProps"
                    @node-click="handleNodeClickTest"
                ></el-tree>
            </div>

            <el-dialog
                :modal="false"
                style="margin-top: 5%"
                :visible.sync="addChildNodeFlag"
                title="新增子节点"
                width="15%"
                @close="closeAddChildNode"
            >
                <el-form ref="addChildDataRef" :model="addChildData" label-width="auto" :rules="addChildDataRules">
                    <el-form-item label="节点名称" prop="name">
                        <el-input v-model="addChildData.name" placeholder="请输入节点名称"></el-input>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeAddChildNode">取 消</el-button>
                    <el-button type="primary" @click="saveChildNode()">确 定</el-button>
                </span>
            </el-dialog>

            <span slot="footer" class="dialog-footer">
                <el-button @click="closeImgText">取 消</el-button>
                <el-button type="primary" @click="pictureConfirm()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="元数据"
            :visible.sync="metaDataFlag"
            width="60%"
            @close="closeMetaData"
            custom-class="set-dialog"
            :close-on-click-modal="false"
        >
            <el-form ref="metaDataRef" :model="metaData" label-width="auto">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="产品名称" prop="productName">
                            <el-input v-model="metaData.productName" placeholder="请输入产品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品级别" prop="productLevel">
                            <el-input v-model="metaData.productLevel" placeholder="请输入产品级别"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="生产日期" prop="makeDate">
                            <el-date-picker
                                format="yyyy年MM月dd日"
                                value-format="yyyy-MM-dd"
                                v-model="metaData.makeDate"
                                type="date"
                                placeholder="请选择生产日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品摘要" prop="productBrief">
                            <el-input v-model="metaData.productBrief" placeholder="请输入产品摘要"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="格式类型" prop="type">
                            <el-input v-model="metaData.type" placeholder="请输入格式类型"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品时点" prop="productTiming">
                            <el-date-picker
                                format="yyyy年MM月dd日"
                                value-format="yyyy-MM-dd"
                                v-model="metaData.productTiming"
                                type="date"
                                placeholder="请选择产品时点"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="数据质量" prop="dataQuality">
                            <el-input v-model="metaData.dataQuality" placeholder="请输入数据质量"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="坐标系统" prop="locationSystem">
                            <el-input v-model="metaData.locationSystem" placeholder="请输入坐标系统"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="高程基准" prop="gaocheng">
                            <el-input v-model="metaData.gaocheng" placeholder="请输入高程基准"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分辨率" prop="resolution">
                            <el-input v-model="metaData.resolution" placeholder="请输入分辨率"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="生产单位名称" prop="productionUnitName">
                            <el-input v-model="metaData.productionUnitName" placeholder="请输入生产单位名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生产单位电话" prop="productionUnitPhoneNum">
                            <el-input v-model="metaData.productionUnitPhoneNum" placeholder="请输入生产单位电话"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="生产单位地址" prop="productionUnitAddress">
                            <el-input v-model="metaData.productionUnitAddress" placeholder="请输入生产单位地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="质检单位名称" prop="checkUnitName">
                            <el-input v-model="metaData.checkUnitName" placeholder="请输入质检单位名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="安全涉密等级" prop="confidentialLevel">
                            <el-select v-model="metaData.confidentialLevel" placeholder="请选择安全涉密等级">
                                <el-option v-for="item in securityLevelList" :key="item.name" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数据创建日期" prop="dataCreateTime">
                            <el-date-picker
                                format="yyyy年MM月dd日"
                                value-format="yyyy-MM-dd"
                                v-model="metaData.dataCreateTime"
                                type="date"
                                placeholder="请选择数据创建日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="订阅消息" prop="subscriptionMessage">
                            <el-input
                                type="textarea"
                                :rows="2"
                                v-model.trim="metaData.subscriptionMessage"
                                placeholder="请输入订阅消息"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer">
                <el-button @click="metaDataFlag = false">取 消</el-button>
                <el-button :loading="metaDataSaveFlag" type="primary" @click="saveMetaData()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 服务弹窗 -->
        <el-dialog
            :title="setServerDialogName"
            :visible.sync="serveVisible"
            width="60%"
            @close="closeServeDialog"
            custom-class="set-dialog"
            :close-on-click-modal="false"
        >
            <el-form ref="serveForm" :model="serveForm" label-width="auto" :rules="serveFormRules">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="服务组" prop="GROUPID">
                            <el-cascader
                                v-model="serveForm.GROUPID"
                                :options="treeData"
                                :props="{
                                    expandTrigger: 'hover',
                                    value: 'PID',
                                    label: 'SNAME',
                                    children: 'CHILDREN',
                                    checkStrictly: true,
                                    emitPath: false
                                }"
                                :show-all-levels="false"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目类型" prop="PRJTYPE">
                            <el-select v-model="serveForm.PRJTYPE" placeholder="请选择">
                                <el-option
                                    v-for="item in prjtypeList"
                                    :key="item.intnum"
                                    :label="item.name"
                                    :value="item.stringnum"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="地图服务地址" prop="URL">
                            <el-input v-model="serveForm.URL" placeholder="请输入地图服务地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务名称" prop="NAME">
                            <el-input v-model="serveForm.NAME" placeholder="请输入服务名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="地图类型" prop="KIND">
                            <el-select v-model="serveForm.KIND" placeholder="请选择">
                                <el-option
                                    v-for="item in serveTypeList"
                                    :key="item.intnum"
                                    :label="item.name"
                                    :value="item.stringnum"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="四至范围" prop="RANGE">
                            <div class="form-item-box">
                                <el-input v-model="serveForm.RANGE" placeholder="请输入四至范围"></el-input>

                                <el-popover
                                    placement="top-start"
                                    width="250"
                                    trigger="hover"
                                    content="当添加服务为 ArcGIS 二维服务（MapServer） 时，需要填写四至范围，格式为：xmin,ymin,xmax,ymax,wkid"
                                >
                                    <i class="iconfont icon-shuxing" slot="reference"></i>
                                </el-popover>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="serveForm.KIND == 16" :gutter="20">
                    <el-col :span="12">
                        <el-form-item v-if="serveForm.KIND == 16" label="是否倾斜">
                            <el-switch
                                v-model="serveForm.ISINCLINE"
                                active-text="是"
                                inactive-text="否"
                                :active-value="1"
                                :inactive-value="0"
                            >
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="serveForm.KIND == 5" :gutter="20">
                    <el-col :span="12">
                        <el-form-item v-if="serveForm.KIND == 5" label="是否天地图" prop="ISTIANDI">
                            <el-switch
                                v-model="serveForm.ISTIANDI"
                                active-text="是"
                                inactive-text="否"
                                :active-value="1"
                                :inactive-value="0"
                            >
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="serveForm.KIND == 5" label="平铺信息" prop="TILEINFO">
                            <el-input v-model="serveForm.TILEINFO" placeholder="请输入平铺信息"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="地图服务类型" prop="MAPTYPE">
                            <el-select v-model="serveForm.MAPTYPE" placeholder="请选择">
                                <el-option
                                    v-for="item in mapTypeList"
                                    :key="item.intnum"
                                    :label="item.name"
                                    :value="item.stringnum"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="透明度" prop="OPACITY">
                            <el-slider v-model="serveForm.OPACITY"></el-slider>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="要素服务" prop="FACTOR">
                            <el-input v-model="serveForm.FACTOR" placeholder="请输入要素服务"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物理数据库" prop="PHYSICALDATABASE">
                            <el-select v-model="serveForm.PHYSICALDATABASE" placeholder="请选择">
                                <el-option
                                    v-for="item in physicalDataBaseList"
                                    :key="item.intnum"
                                    :label="item.name"
                                    :value="item.stringnum"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="数据表" prop="DATATABLE">
                            <el-input v-model="serveForm.DATATABLE" placeholder="请输入数据表"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-form-item label="是否可见" prop="VISIBLE">
                            <el-switch
                                v-model="serveForm.VISIBLE"
                                active-text="是"
                                inactive-text="否"
                                :active-value="1"
                                :inactive-value="0"
                            >
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="是否启用" prop="ENABLE">
                            <el-switch v-model="serveForm.ENABLE" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="是否支持开挖" prop="ISDIG">
                            <el-switch v-model="serveForm.ISDIG" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </el-col>

                    <el-col :span="5">
                        <el-form-item label="是否压盖" prop="ISCOVER">
                            <el-switch
                                v-model="serveForm.ISCOVER"
                                active-text="是"
                                inactive-text="否"
                                :active-value="1"
                                :inactive-value="0"
                            >
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="叠加层级排序" prop="LEVELORDER">
                            <el-input-number v-model.number="serveForm.LEVELORDER" type="number" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="排序" prop="ORDERNUM">
                            <el-input-number
                                v-model.number="serveForm.ORDERNUM"
                                placeholder="请输入排序"
                                type="number"
                                :min="0"
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="图标" prop="ICONURL">
                            <el-upload
                                ref="iconUpload"
                                action="#"
                                list-type="picture-card"
                                :file-list="fileList"
                                :auto-upload="false"
                                :limit="1"
                                :on-change="handleChange"
                                :on-exceed="beforeAddIcon"
                                accept=".jpg,.png"
                            >
                                <i slot="default" class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{ file }">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                            <i class="el-icon-zoom-in"></i>
                                        </span>
                                        <!--                                <span v-if='!disabled' class='el-upload-list__item-delete'-->
                                        <!--                                      @click='handleDownload(file)'>-->
                                        <!--                                    <i class='el-icon-download'></i>-->
                                        <!--                                </span>-->
                                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveServeDialog">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>

        <el-dialog
            title="属性绑定列表"
            :visible.sync="propertyDataFlag"
            width="40%"
            :close-on-click-modal="false"
            custom-class="set-dialog"

            :before-close="closeProperty"
        >
            <div>
                <el-button type="primary" size="small" @click="handlePropertyAdd()">添加属性字段</el-button>
            </div>

            <div class="my-dialog-content">
                <el-table
                    style="font-size: 15px; margin-top: 10px"
                    :data="propertyDataTable"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                >
                    <el-table-column prop="propertyField" label="属性字段名称" align="center"></el-table-column>
                    <el-table-column prop="propertyFieldAlias" label="属性字段别名" align="center"></el-table-column>
                    <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" class="blue" icon="el-icon-edit" confirm @click="handlePropertyEdit(scope.row)">
                                编辑
                            </el-button>
                            <el-button type="text" class="red" icon="el-icon-delete" confirm @click="delProperty(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="propertyDataFlag = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog
            style="margin-top: 40px"
            :title="addPropertyTitle"
            custom-class="my-dialog"
            :visible.sync="propertyDataAddFlag"
            width="30%"
            :close-on-click-modal="false"
            :before-close="closeProperty"
        >
            <el-form ref="propertyDataRef" :model="propertyData" label-width="auto" :rules="propertyDataRules">
                <el-form-item label="属性字段名称：" prop="propertyField">
                    <el-input v-model.trim="propertyData.propertyField" placeholder="请输入服务属性字段名称"></el-input>
                </el-form-item>
                <el-form-item label="属性字段别名：" prop="propertyFieldAlias">
                    <el-input v-model.trim="propertyData.propertyFieldAlias" placeholder="请输入服务属性字段别名"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                    <el-input-number v-model="propertyData.sort" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="propertyDataAddFlag = false">关 闭</el-button>
                <el-button type="primary" @click="addPropertyData()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getTreeGroups,
    getWebGisLayers,
    saveGroup,
    delGroup,
    getServers,
    getServeName,
    getServeType,
    getDataResource,
    saveMapServe,
    delMapServer,
    initPhysicalDataBase,
    getPropertyList,
    saveOrEditProperty,
    delProperty
} from '@/api/mapservice-api';
import { saveMetaDataApi, metaDataDetail } from '@/api/LayerMetaData-api';
import { getTreeApi, uploadDocumentApi, addNodeApi, downloadDocumentApi, delApi } from '@/api/LayerImgText-api';

export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            treeDataObj: {},
            isAdmin: false,
            setServerDialogName: '添加服务',
            treeData: [],
            treeProps: {
                children: 'CHILDREN',
                label: 'SNAME'
            },
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            groupID: 0,
            searchTXT: '',
            setVisible: false,
            setForm: {},
            setFormRules: {},
            physicalDataBaseList: [],

            resourceUrl: window.resourceUrl,
            fileList: [],
            disabled: false,
            dialogImageUrl: '',
            dialogVisible: false,

            groupVisible: false,
            groupTitle: '',
            groupForm: {
                SNAME: '',
                DESCRIPTION: '',
                CODE: '',
                SERIAL: null,
                GROUPTYPE: 1
            },
            groupFormRules: {
                SNAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                DESCRIPTION: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
                CODE: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
                SERIAL: [{ required: true, message: '序号不能为空', trigger: 'blur' }]
            },
            serveVisible: false,
            serveForm: {
                PID: 0,
                NAME: '',
                URL: '',
                OPACITY: 100,
                VISIBLE: false,
                ENABLE: false,
                ISTIANDI: 0,
                KIND: '',
                ORDERNUM: 0,
                GROUPID: '',
                LEVELORDER: 0,
                MAPTYPE: '',
                ISDIG: false,
                PRJTYPE: '',
                TILEINFO: '',
                RANGE: '',
                ICONURL: '',
                FACTOR: '',
                PHYSICALDATABASE: '',
                DATATABLE: '',
                ISCOVER: false,
                ISINCLINE: 0
            },
            dataServers: [],
            serverNameList: [],
            // 服务选择
            serveUrl: '',
            mapTypeList: [
                {
                    intnum: 1,
                    name: '⼆维',
                    stringnum: 1
                },
                {
                    intnum: 2,
                    name: '三维',
                    stringnum: 2
                }
            ],
            prjtypeList: [
                {
                    intnum: 1,
                    name: 'arcgis',
                    stringnum: 1
                },
                {
                    intnum: 2,
                    name: 'cesium',
                    stringnum: 2
                },
                {
                    intnum: 3,
                    name: '全部',
                    stringnum: 3
                }
            ],
            serveTypeList: [],
            dataSourceList: [],
            serveFormRules: {
                GROUPID: [{ required: true, message: '服务组不能为空', trigger: 'change' }],
                DATASOURCE: [{ required: true, message: '数据来源不能为空', trigger: 'change' }],
                URL: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }],
                NAME: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
                KIND: [{ required: true, message: '服务类型不能为空', trigger: 'change' }],
                LEVELORDER: [{ required: true, message: '叠加层级排序不能为空', trigger: 'change' }],
                OPACITY: [{ required: true, message: '透明度不能为空', trigger: 'blur' }],
                MAPTYPE: [{ required: true, message: '地图服务类型不能为空', trigger: 'blur' }],
                PRJTYPE: [{ required: true, message: '项目类型不能为空', trigger: 'blur' }],
                TILEINFO: [{ required: true, message: '平铺信息不能为空', trigger: 'blur' }]
            },
            addPropertyTitle: '新增属性字段',
            propertyDataAddFlag: false,
            propertyDataFlag: false,
            propertyDataTable: [],
            propertyData: {
                pid: undefined,
                layerId: undefined,
                propertyField: undefined,
                propertyFieldAlias: undefined,
                sort: 0
            },
            propertyDataRules: {
                propertyField: [{ required: true, message: '属性字段不能为空', trigger: 'blur' }],
                propertyFieldAlias: [{ required: true, message: '属性别名不能为空', trigger: 'blur' }],
                sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
            },
            metaDataFlag: false,
            metaData: {
                productName: undefined,
                productLevel: undefined,
                makeDate: undefined,
                productBrief: undefined,
                type: undefined,
                productTiming: undefined,
                dataQuality: undefined,
                locationSystem: undefined,
                gaocheng: undefined,
                resolution: undefined,
                productionUnitName: undefined,
                productionUnitPhoneNum: undefined,
                productionUnitAddress: undefined,
                checkUnitName: undefined,
                confidentialLevel: undefined,
                subscriptionMessage: undefined,
                dataCreateTime: undefined
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
            ],
            metaDataSaveFlag: false,
            imgText: false,
            imgTextData: {
                pid: undefined,
                field: undefined,
                url: undefined
            },
            imgTextDataRules: {
                // field: [{ required: true, message: '关联字段不能为空', trigger: 'blur' }],
                // url: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
            },
            nodeData: {},
            defaultProps: {
                children: 'childList',
                label: 'name'
            },
            fileTreeData: [],
            addChildNodeFlag: false,
            addChildData: {
                parentId: undefined,
                name: undefined
            },
            addChildDataRules: {
                name: [{ required: true, message: '子节点名称不能为空', trigger: 'blur' }]
            },
            uploadDocumentUrl: '',
            documentFileList: [],
            documentFileDisable: true
        };
    },
    computed: {
        // ...mapState(['isAdmin'])
        // 上传时需要的请求头
        headers() {
            const token = sessionStorage.getItem('token');
            return {
                Authorization: token,
                loginType: 'system'
            };
        }
    },
    watch: {
        $route: {
            handler(val) {
                this.groupForm.GROUPTYPE = this.$route.query.type;
                if (this.$route.query.type == undefined || this.$route.query.type == '') {
                    this.groupForm.GROUPTYPE = 1;
                }
                this.getTreeData(this.groupForm.GROUPTYPE);
            }
        },
        serveVisible(boo) {
            if (boo) {
                this.getDataServers();
                this.getServeTypeList();
                this.getSource();
            }
        },
        'serveForm.IP': {
            async handler(val) {
                console.log(val, 'serveForm.IP');
                if (Boolean(val)) {
                    await this.getDataServers();
                    await this.changeIP(val);
                }
            }
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.groupForm.GROUPTYPE = this.$route.query.type;
        if (this.$route.query.type == undefined || this.$route.query.type == '') {
            this.groupForm.GROUPTYPE = 0;
        }
        this.initPhysicalDataBaseList();
        this.getTreeData(this.groupForm.GROUPTYPE);
    },
    methods: {
        addPropertyData() {
            this.$refs.propertyDataRef.validate(async (valid) => {
                if (!valid) return this.$message.error('请输入必填项');
                saveOrEditProperty(this.propertyData).then((res) => {
                    if (res.code == 200) {
                        this.$message.success('操作成功！');
                        this.propertyDataAddFlag = false;
                        this.queryPropertyList(this.propertyData.layerId);
                    }
                });
            });
        },
        delProperty(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    delProperty(row.pid).then((res) => {
                        if (res.code == 200) {
                            this.$message.success('删除成功！');
                            this.queryPropertyList(row.layerId);
                        }
                    });
                })
                .catch(() => {});
        },
        handlePropertyEdit(row) {
            this.addPropertyTitle = '编辑属性字段';
            this.propertyDataAddFlag = true;
            Object.assign(this.propertyData, row);
        },
        handlePropertyAdd() {
            this.addPropertyTitle = '新增属性字段';
            this.propertyDataAddFlag = true;
            this.propertyData.pid = undefined;
            this.propertyData.propertyField = undefined;
            this.propertyData.propertyFieldAlias = undefined;
            this.propertyData.sort = 0;
        },
        handleProperty(row) {
            this.propertyDataFlag = true;
            this.propertyData.layerId = row.PID;
            this.queryPropertyList(row.PID);
        },
        queryPropertyList(pid) {
            // 初始化数据
            getPropertyList({ layerId: pid }).then((res) => {
                if (res.code == 200) {
                    this.propertyDataTable = res.data;
                }
            });
        },
        closeProperty(done) {
            done();
        },
        downloadDocument() {
            if (this.nodeData.pid == null || this.nodeData.pid == undefined) {
                this.$message.warning('请先选择文档后再点击下载');
                return;
            }
            if (this.nodeData.path == null || this.nodeData.path == undefined || this.nodeData.path == '') {
                this.$message.warning('请选择文档进行下载！');
                return;
            }
            downloadDocumentApi({ pid: this.nodeData.pid }, sessionStorage.getItem('token'), this.nodeData.name);
        },
        delNode() {
            if (this.nodeData.childList.length > 0) {
                this.$message.warning('当前节点下仍有数据，请先删除节点下的文档或节点后再删除！');
                return;
            }
            delApi(this.nodeData.pid).then((res) => {
                if (res.code == 200) {
                    this.$message.success('删除成功！');
                    this.initTree(this.nodeData.layerId);
                }
            });
        },
        uploadDocumentCheck() {
            this.documentFileDisable = true;
            // 判断是否为父节点
            if (this.nodeData.pid == null || this.nodeData.pid == undefined) {
                this.$message.warning('请先选择节点后再增加上传文档!');
                return;
            }
            if (this.nodeData.path != null && this.nodeData.path != undefined && this.nodeData.path != '') {
                this.$message.warning('文档只能添加在节点下！');
                return;
            }
            this.documentFileDisable = false;
        },
        uploadDocumentChange(file) {
            this.documentFileList = [];
            this.documentFileList.push(file);
            this.submitUploadDocument();
        },
        submitUploadDocument() {
            const formData = new FormData();
            formData.append('file', this.documentFileList[0].raw);
            formData.append('pid', this.nodeData.pid);
            uploadDocumentApi(formData).then((res) => {
                if (res.code == 200) {
                    this.$message.success('上传成功');
                    // 关闭对话框，刷新列表
                    this.initTree(this.nodeData.layerId);
                }
                this.documentFileList = [];
            });
        },
        uploadDocumentOnSuccess(response, file, fileList) {
            if (response.code == 200) {
                this.$message.success(response.msg);
                // 关闭对话框，刷新列表
                this.initTree(this.nodeData.layerId);
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
        uploadDocumentHandleExceed(files, fileList) {
            this.$message.warning(
                `当前限制单次上传 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        uploadDocumentBeforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}?`);
        },
        uploadDocumentHandleRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}?`);
        },
        uploadDocumentHandlePreview() {},
        saveMetaData() {
            this.$refs.metaDataRef.validate(async (valid) => {
                if (!valid) return this.$message.error('请输入必填项');
                if (this.metaDataSaveFlag) {
                    this.$message.warning('请勿重复点击！');
                    return;
                }
                this.metaDataSaveFlag = true;
                saveMetaDataApi(this.metaData).then((res) => {
                    if (res.code == 200) {
                        this.$message.success('操作成功');
                        this.metaDataFlag = false;
                    }
                    this.metaDataSaveFlag = false;
                });
            });
        },
        handleNodeClickTest(data) {
            this.nodeData = data;
        },
        closeImgText() {
            this.imgText = false;
            this.$refs.imgTextRef.resetFields();
            this.nodeData = {};
        },
        closeAddChildNode() {
            this.addChildData.name = undefined;
            this.addChildData.parentId = undefined;
            this.addChildNodeFlag = false;
        },
        pictureConfirm() {
            const formData = new FormData();
            formData.append('DELFILE', 1);
            formData.append('PID', this.imgTextData.pid);
            formData.append('ASSOCIATIONFIELD', this.imgTextData.field);
            formData.append('ASSOCIATIONURL', this.imgTextData.url);

            saveMapServe(formData).then((res) => {
                if (res.code == 200) {
                    this.$message.success('修改成功');
                    this.imgText = false;
                    this.getTableData();
                }
            });
        },
        handleImgText(row) {
            this.imgTextData.field = row.ASSOCIATIONFIELD;
            this.imgTextData.url = row.ASSOCIATIONURL;
            this.imgTextData.pid = row.PID;
            // 查询图文关联文件树
            this.initTree(row.PID);
            this.imgText = true;
        },
        initTree(pid) {
            getTreeApi({ layerId: pid }).then((res) => {
                if (res.code == 200) {
                    this.fileTreeData = res.data;
                }
            });
        },
        closeMetaData() {
            this.metaDataFlag = false;
            this.$refs.metaDataRef.resetFields();
        },
        handleMetaData(row) {
            this.metaDataFlag = true;
            this.metaData.layerId = row.PID;

            // 查询当前数据的元数据信息进行回显
            metaDataDetail({ id: this.metaData.layerId }).then((res) => {
                if (res.code == 200) {
                    if (res.data != '') {
                        this.metaData = res.data;
                    }
                }
            });
        },
        // 初始化物理数据库下拉框
        initPhysicalDataBaseList() {
            let params = {
                code: '物理数据库'
            };
            initPhysicalDataBase(params).then((res) => {
                if (res.code == 200) {
                    this.physicalDataBaseList = res.data;
                }
            });
        },
        // 获取树级列表
        async getTreeData(type) {
            const res = await getTreeGroups({ type });
            if (res.code === 200) {
                this.treeData = res.data;
            }
        },

        // 树级节点点击
        async handleNodeClick(obj, node, el) {
            this.treeDataObj = obj;
            this.groupID = obj.PID;
            this.currentPage = 1;
            let params = {
                groupid: obj.PID
            };
            this.getTableData(params);
            this.serveForm.GROUPID = obj.PID;
        },

        handleRemove(file) {
            this.$refs.iconUpload.clearFiles();
            this.serveForm.ICONURL = '';
            this.fileList = [];
        },
        handleDownload(file) {},
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
                this.serveForm.ICONURL = '1';
            } else {
                this.serveForm.ICONURL = '';
                this.fileList = [];
            }
        },

        // 新增
        handleAdd() {
            this.serveForm.PID = 0;
            this.serveVisible = true;
        },

        // 搜索
        handleSearch() {
            this.currentPage = 1;
            let params = {
                keyword: this.searchTXT
            };
            this.getTableData(params);
        },

        // 获取表格数据
        async getTableData(form) {
            let params = {
                groupid: this.groupID,
                keyword: '',
                currentpage: this.currentPage,
                pagesize: 10,
                kind: 0,
                datasource: 0
            };
            if (form?.groupid) {
                Object.assign(params, form);
            }
            if (form?.keyword) {
                Object.assign(params, form);
            }
            const res = await getWebGisLayers(params);
            if (res.code === 200) {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            }
        },

        // 页数点击
        handlePageChange(val) {
            this.currentPage = val;
            this.getTableData();
        },

        // 新增图层组
        addService() {
            this.groupVisible = true;
            this.groupTitle = '新增根目录';
            Object.assign(this.groupForm, { PID: 0, PARENTID: 0 });
        },

        // 新增子节点
        addChildNode() {
            if (this.nodeData.pid == null || this.nodeData.pid == undefined) {
                this.$message.warning('请先选择节点后再增加子节点!');
                return;
            }
            if (this.nodeData.path != null && this.nodeData.path != undefined && this.nodeData.path != '') {
                this.$message.warning('文档不能添加子节点！');
                return;
            }
            this.addChildNodeFlag = true;
        },
        // 添加子节点
        saveChildNode() {
            this.$refs.addChildDataRef.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                this.addChildData.parentId = this.nodeData.pid;
                this.addChildData.layerId = this.nodeData.layerId;
                addNodeApi(this.addChildData).then((res) => {
                    if (res.code == 200) {
                        this.$message.success('添加成功');
                        this.initTree(this.nodeData.layerId);
                        this.addChildNodeFlag = false;
                        this.$refs.addChildDataRef.resetFields();
                    }
                });
            });
        },
        // 保存图层组
        saveGroupDialog() {
            this.$refs.groupForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请输入必填项');
                const res = await saveGroup(this.groupForm);
                if (res.code === 200) {
                    this.$message.success('成功');
                    this.groupVisible = false;
                    this.getTreeData(this.groupForm.GROUPTYPE);
                }
            });
        },
        // 添加图层
        addLayer() {
            if (this.treeDataObj.PID == null || this.treeDataObj.PID == undefined) {
                this.$message.warning('请先选择根目录！');
                return;
            }
            if (this.groupID == null || this.groupID == 0) {
                this.$message.warning('请先选择根目录！');
                return;
            }
            if (this.treeDataObj.PARENTID != 0) {
                this.$message.warning('子节点下不能再次新增子节点！');
                return;
            }
            this.groupTitle = '新增子节点';
            this.groupVisible = true;
            Object.assign(this.groupForm, { PARENTID: this.groupID, PID: 0 });
        },

        // 图层弹窗关闭
        closedGroup() {
            this.$refs.groupForm.resetFields();
        },

        // 编辑树分组
        editTree() {
            this.groupVisible = true;
            this.groupTitle = '编辑图层组';
            if (this.treeDataObj.PID == null || this.treeDataObj.PID == undefined) {
                this.$message.warning('请先选择根目录！');
                return;
            }
            if (this.groupID == null || this.groupID == 0) {
                this.$message.warning('请先选择根目录！');
                return;
            }
            Object.assign(this.groupForm, this.treeDataObj);
        },

        // 删除树分组
        async delTree() {
            //询问是否删除
            this.$confirm('此操作将永久删除该图层组, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    if (this.treeDataObj.PID == null || this.treeDataObj.PID == undefined) {
                        this.$message.warning('请先选择图层！');
                        return;
                    }
                    const res = await delGroup({ pid: this.treeDataObj.PID });
                    if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.getTreeData(this.groupForm.GROUPTYPE);
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },

        // 获取服务器列表
        async getDataServers() {
            const res = await getServers();
            if (res.code === 200) {
                this.dataServers = res.data;
            }
        },

        // 服务器列表选择
        async changeIP(obj) {
            console.log(this.dataServers, 'dataServers');
            let data = this.dataServers.filter((item) => {
                return obj == item.IP;
            });
            console.log(data, 'data');
            if (data.length > 0) {
                this.serveUrl = '';
                //this.serveForm.URL = '';
                let params = {
                    serverpid: data[0].PID
                };
                // 服务名称列表
                const res = await getServeName(params);
                if (res.code === 200) {
                    this.serverNameList = res.data;
                    console.log(res.data, 'serverNameList');
                    this.serveUrl = this.serveForm.URL;
                }
            }
        },

        // 服务类型
        async getServeTypeList() {
            const res = await getServeType();
            if (res.code === 200) {
                this.serveTypeList = res.data;
            }
        },

        // 获取数据来源
        async getSource() {
            const res = await getDataResource();
            if (res.code === 200) {
                this.dataSourceList = res.data;
            }
        },

        // 获取服务名称列表
        getServerNameList() {
            let data = this.dataServers.filter((item) => {
                return this.serveForm.IP == item.IP;
            });
        },

        // 保存服务弹窗
        saveServeDialog() {
            this.$refs.serveForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');

                // 改为formdata类型
                const formData = new FormData();
                if (this.fileList.length > 0) {
                    formData.append('file', this.fileList[0].raw);
                }
                if (this.serveForm.ICONURL == '') {
                    formData.append('DELFILE', 1);
                }
                if (this.serveForm.KIND != 16) {
                    this.serveForm.ISINCLINE = 0;
                }
                formData.append('PID', this.serveForm.PID);
                formData.append('NAME', this.serveForm.NAME);
                formData.append('URL', this.serveForm.URL);
                formData.append('OPACITY', this.serveForm.OPACITY);
                formData.append('VISIBLE', this.serveForm.VISIBLE);
                formData.append('ENABLE', this.serveForm.ENABLE);
                formData.append('ISTIANDI', this.serveForm.ISTIANDI);
                formData.append('KIND', this.serveForm.KIND);
                formData.append('ORDERNUM', this.serveForm.ORDERNUM);
                formData.append('GROUPID', this.serveForm.GROUPID);
                formData.append('LEVELORDER', this.serveForm.LEVELORDER);
                formData.append('MAPTYPE', this.serveForm.MAPTYPE);
                formData.append('ISDIG', this.serveForm.ISDIG);
                formData.append('ISCOVER', this.serveForm.ISCOVER);
                formData.append('PRJTYPE', this.serveForm.PRJTYPE);
                formData.append('TILEINFO', this.serveForm.TILEINFO);
                formData.append('RANGE', this.serveForm.RANGE);
                formData.append('FACTOR', this.serveForm.FACTOR);
                formData.append('PHYSICALDATABASE', this.serveForm.PHYSICALDATABASE);
                formData.append('DATATABLE', this.serveForm.DATATABLE);
                formData.append('ISINCLINE', this.serveForm.ISINCLINE);

                const res = await saveMapServe(formData);
                if (res.code == 200) {
                    this.$message.success('保存成功');
                    this.serveVisible = false;
                    this.getTableData();
                }
            });
        },

        // 关闭服务弹窗
        closeServeDialog() {
            this.$refs.serveForm.resetFields();
            this.serveUrl = '';
            this.serverNameList = [];
        },

        // 删除服务
        async handleDelete(row) {
            this.$confirm('此操作将永久删除该服务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    const res = await delMapServer({ pid: row.PID });
                    if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.getTableData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },

        // 编辑服务
        handleEdit(row) {
            this.fileList = [];
            if (row.ICONURL != null && row.ICONURL != '') {
                let file = {
                    name: row.name,
                    url: this.resourceUrl + row.ICONURL
                };
                this.fileList.push(file);
            }
            this.setServerDialogName = this.isAdmin == 'true' ? '编辑服务' : '查看服务';
            this.serveVisible = true;
            this.$nextTick(() => {
                this.serveForm.GROUPID = Number(row.GROUPID);
                this.serveForm.URL = row.URL;
                this.serveForm.NAME = row.NAME;
                this.serveForm.KIND = String(row.KIND);
                this.serveForm.VISIBLE = row.VISIBLE;
                this.serveForm.ENABLE = row.ENABLE;
                this.serveForm.ORDERNUM = row.ORDERNUM;
                this.serveForm.OPACITY = Number(row.OPACITY);
                this.serveForm.PID = row.PID;
                this.serveForm.LEVELORDER = row.LEVELORDER;
                this.serveForm.MAPTYPE = row.MAPTYPE;
                this.serveForm.ISDIG = row.ISDIG;
                this.serveForm.ISCOVER = row.ISCOVER;
                this.serveForm.ISTIANDI = row.ISTIANDI;
                this.serveForm.PRJTYPE = row.PRJTYPE;
                this.serveForm.TILEINFO = row.TILEINFO;
                this.serveForm.RANGE = row.RANGE;
                this.serveForm.PHYSICALDATABASE = row.PHYSICALDATABASE;
                this.serveForm.DATATABLE = row.DATATABLE;
                this.serveForm.FACTOR = row.FACTOR;
                this.serveForm.ICONURL = row.ICONURL;
                this.serveForm.ISINCLINE = row.ISINCLINE;
            });
        }
    }
};
</script>
<style scoped lang="scss">
@import '@/assets/scss/common.scss';

.el-row {
    margin-bottom: 5px;
    margin-top: 20px;

    &:last-child {
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

.button-container {
    display: flex;
    justify-content: space-between; /* 水平方向上平均分布 */
    align-items: center; /* 垂直方向上居中对齐 */
}

.fileTree {
    margin-top: 10px;
    border: 1px solid black;
    height: 200px;
}

.container {
    display: flex;
    min-height: 81vh;

    .service-aside {
        width: 385px;
        border: 1px solid #dcdfe6;
        margin-right: 10px;
        padding: 0 2px;
    }

    .service-main {
        flex: 1;
        position: relative;
        overflow-x: auto;
        .el-table {
            width: 100%;
        }
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
        font-size: 16px;
        padding: 2px 0;
    }

    .add-service-button {
        margin-left: 5px;
        margin-top: 8px;
    }

    .el-select,
    .el-cascader {
        width: 100%;
    }
}

.el-tree {
    min-width: 100%;
    display: inline-block;
}

.my-dialog-content {
    max-height: 500px; /* 对话框最大高度 */
    overflow-y: auto; /* 内容过长时添加滑轮滚动 */
}

.tree {
    overflow: auto;
    max-height: 200px;
}
.form-item-box {
    display: flex;
    .el-input {
        flex: 1;
    }
    .icon-shuxing {
        margin-left: 5px;
        cursor: pointer;
        color: #f56c6c;
    }
}
</style>
