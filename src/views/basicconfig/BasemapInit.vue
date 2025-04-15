<!--
 * @Author: WCL
 * @Date: 2022-02-09 10:15:49
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-30 13:59:16
 * @FilePath: \3d-web\src\views\basicconfig\BasemapInit.vue
 * @Description: 底图初始化
-->
<template>
    <div class="container">

        <el-tabs v-model="type" @tab-click="handleClick">
            <el-tab-pane label="高程数据" name="gaochengdata">
            </el-tab-pane>
            <el-tab-pane label="底图配置" name="basemap">
            </el-tab-pane>
            <el-tab-pane label="初始化底图参数" name="init">
            </el-tab-pane>
        </el-tabs>

        <!-- 高程数据维护页面 -->
        <div class="main" v-if="type == 'gaochengdata'">
            <!-- 顶部表单 -->
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="gaochengAddType"
                    v-if="isAdmin == 'true'">新增</el-button>
            </div>
            
            <el-table style="font-size:15px" :data="gaochengTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="pid" label="PID" width="80" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"> </el-table-column>
                <el-table-column prop="url" label="服务地址" align="center"> </el-table-column>
                <el-table-column prop="iconUrl" label="图标" align="center" height="150" width="150">
                <template slot-scope="scope">
                    <el-image :src="resourceUrl + scope.row.iconUrl" :preview-src-list="[resourceUrl + scope.row.iconUrl]" min-width="50" height="50" />
                </template>
            </el-table-column>
                <el-table-column prop="prjtype" label="项目类型" align="center" width="100">
                    <template v-slot="scope">
                        {{ scope.row.prjtype === 1 ? 'arcgis' : scope.row.prjtype === 2 ? 'cesium' : '全部' }}
                    </template>
                </el-table-column>
              <el-table-column prop="load" label="是否加载" align="center" width="100">
                <template v-slot="scope">
                  {{ scope.row.load === 1 ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column prop="enable" label="是否启用" align="center" width="100">
                <template v-slot="scope">
                  {{ scope.row.enable === 1 ? '是' : '否' }}
                </template>
              </el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="isAdmin == 'true'">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="gaochengHandleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="gaochengHandleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next, jumper" :current-page="gaochengCurrentPage"
                    :page-size="gaochengPageSize" :total="gaochengPageTotal" @current-change="handlePageChange"></el-pagination>
            </div>

            <!-- 新增/编辑弹窗 -->
            <el-dialog :title="gaochengSetTitle" :visible.sync="gaochengSetVisible" width="30%" custom-class="set-dialog" @close="closedSetDialog"
                :close-on-click-modal="false">
                <el-form ref="gaochengSetFormRef" :model="gaochengSetForm" label-width="auto" class="set-form" :rules="gaochengSetFormRules">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model.trim="gaochengSetForm.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="URL" prop="url">
                        <el-input v-model.trim="gaochengSetForm.url" placeholder="请输入URL"></el-input>
                    </el-form-item>
                    <el-form-item label="项目类型" prop="prjtype">
                        <el-select v-model="gaochengSetForm.prjtype" placeholder="请选择">
                            <el-option v-for="item in basemapPrjtypeList" :key="item.intnum" :label="item.name"
                                :value="item.stringnum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单图标：" prop="iconUrl">
                      <el-upload ref="gaochengUpload" action="#" list-type="picture-card" :file-list="gaochengFileList" :auto-upload="false"
                          :limit="1" :on-change="gaochengHandleChange" :on-exceed="gaochengBeforeAddIcon" accept=".jpg,.png">
                          <i slot="default" class="el-icon-plus"></i>
                          <div slot="file" slot-scope="{file}">
                              <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                              <span class="el-upload-list__item-actions">
                                  <span class="el-upload-list__item-preview" @click="gaochengHandlePictureCardPreview(file)">
                                      <i class="el-icon-zoom-in"></i>
                                  </span>
                                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="gaochengHandleDownload(file)">
                                      <i class="el-icon-download"></i>
                                  </span>
                                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="gaochengHandleRemove(file)">
                                      <i class="el-icon-delete"></i>
                                  </span>
                              </span>
                          </div>
                      </el-upload>
                    </el-form-item>
                  <el-form-item label="是否加载：" prop="load">
                    <el-switch v-model="gaochengSetForm.load" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="是否启用：" prop="enable">
                    <el-switch v-model="gaochengSetForm.enable" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0">
                    </el-switch>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="gaochengSetVisible = false">取 消</el-button>
                    <el-button type="primary" @click="gaochengSaveAdd">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        
        <!-- 底图配置 -->
        <div class="main" v-if="type == 'basemap'">
            <div class="handle-box">
                <el-button type="primary" size="small" @click="basemapHandleAdd">新增服务</el-button>
            </div>
            <el-table style="font-size:15px" :data="basemapTableData" border stripe>
                <el-table-column prop="pid" label="id" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="url" label="url" align="center"></el-table-column>
                <el-table-column prop="iconUrl" label="图标" align="center" height="150" width="150">
                  <template slot-scope="scope">
                      <el-image :src="resourceUrl + scope.row.iconUrl" :preview-src-list="[resourceUrl + scope.row.iconUrl]" min-width="50" height="50" />
                  </template>
                </el-table-column>
                <el-table-column prop="prjtype" label="项目类型" align="center">
                    <template v-slot="scope">
                        {{ scope.row.prjtype === 1 ? 'arcgis' : scope.row.prjtype === 2 ? 'cesium' : '全部' }}
                    </template>
                </el-table-column>
                <el-table-column prop="visible" label="是否可见" align="center">
                    <template v-slot="scope">
                        {{ scope.row.visible === 0 ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="enable" label="是否启用" align="center">
                    <template v-slot="scope">
                        {{ scope.row.enable === 0 ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="ordernum" label="排序" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" class="blue"
                            @click="basemapHandleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" class="red"
                            @click="basemapHandleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next, jumper" :current-page="basemapCurrentPage"
                    :page-size="basemapPageSize" :total="basemapPageTotal" @current-change="basemapHandlePageChange"></el-pagination>
            </div>

            <!-- 服务弹窗 -->
            <el-dialog :title="basemapSetServerDialogName" :visible.sync="basemapServeVisible" width="30%" @close="basemapCloseServeDialog"
                custom-class="set-dialog" :close-on-click-modal="false">
                <el-form ref="basemapServeForm" :model="basemapServeForm" label-width="auto" :rules="basemapServeFormRules">
                    <el-form-item label="地图服务地址" prop="url">
                        <el-input v-model="basemapServeForm.url" placeholder="请输入地图服务地址"></el-input>
                    </el-form-item>
                    <el-form-item label="地图类型" prop="kind">
                        <el-select v-model="basemapServeForm.kind" placeholder="请选择">
                            <el-option v-for="item in basemapServeTypeList" :key="item.intnum" :label="item.name"
                                :value="item.stringnum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="basemapServeForm.kind == 5" label="是否天地图" prop="isTiandi">
                        <el-switch v-model="basemapServeForm.isTiandi" active-text="是" inactive-text="否" :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item v-if="basemapServeForm.kind == 5" label="平铺信息" prop="tileinfo">
                        <el-input v-model="basemapServeForm.tileinfo" placeholder="请输入平铺信息"></el-input>
                    </el-form-item>
                    <el-form-item label="地图服务类型" prop="maptype">
                        <el-select v-model="basemapServeForm.maptype" placeholder="请选择">
                            <el-option v-for="item in mapMapTypeList" :key="item.intnum" :label="item.name"
                                :value="item.stringnum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="底图类型" prop="basemapType">
                        <el-select v-model="basemapServeForm.basemapType" placeholder="请选择">
                            <el-option v-for="item in basemapMapTypeList" :key="item.intnum" :label="item.name"
                                :value="item.stringnum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目类型" prop="prjtype">
                        <el-select v-model="basemapServeForm.prjtype" placeholder="请选择">
                            <el-option v-for="item in basemapPrjtypeList" :key="item.intnum" :label="item.name"
                                :value="item.stringnum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="叠加层级排序" prop="levelOrder">
                        <el-input-number v-model.number="basemapServeForm.levelOrder" type="number" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="服务名称" prop="name">
                        <el-input v-model="basemapServeForm.name" placeholder="请输入服务名称"></el-input>
                    </el-form-item>
                    <el-form-item label="透明度" prop="opacity">
                        <el-slider v-model="basemapServeForm.opacity"></el-slider>
                    </el-form-item>
                    <el-form-item label="是否可见" prop="visible">
                        <el-switch v-model="basemapServeForm.visible" active-text="是" inactive-text="否" :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="enable">
                        <el-switch v-model="basemapServeForm.enable" active-text="是" inactive-text="否" :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="是否支持开挖" prop="isdig">
                        <el-switch v-model="basemapServeForm.isdig" active-text="是" inactive-text="否" :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="排序" prop="ordernum">
                        <el-input-number v-model.number="basemapServeForm.ordernum" placeholder="请输入排序" type="number"
                            :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="图标：" prop="iconUrl">
                      <el-upload ref="basemapUpload" action="#" list-type="picture-card" :file-list="basemapFileList" :auto-upload="false" :limit="1" :on-change="basemapHandleChange" :on-exceed="basemapBeforeAddIcon" accept=".jpg,.png">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="basemapHandlePictureCardPreview(file)">
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="basemapHandleDownload(file)">
                                    <i class="el-icon-download"></i>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="basemapHandleRemove(file)">
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </div>
                    </el-upload>
                </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="basemapServeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="basemapSaveServeDialog">确 定</el-button>
                </span>
            </el-dialog>
        </div>

        <div class="main" v-if="type == 'init'">
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="限制地下显示" prop="naviconstraint">
                    <el-switch v-model="setForm.naviconstraint" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="透明度" prop="opacity">
                    <el-slider style="width: 20%" v-model="setForm.opacity"></el-slider>
                </el-form-item>
                <el-form-item label="地表空白处色值" prop="color">
                    <el-input v-model.trim="setForm.color" style="width: 20%" placeholder="请输入地表空白处色值"></el-input>
                </el-form-item>
                <el-form-item label="中心点X值" prop="x">
                    <el-input-number v-model.trim="setForm.x" style="width: 20%" placeholder="请输入中心点X值"></el-input-number>
                </el-form-item>
                <el-form-item label="中心点Y值" prop="y">
                    <el-input-number v-model.trim="setForm.y" style="width: 20%" placeholder="请输入中心点Y值"></el-input-number>
                </el-form-item>
                <el-form-item label="中心点比例" prop="scale">
                    <el-input v-model.trim="setForm.scale" style="width: 20%" placeholder="请输入中心点比例"></el-input>
                </el-form-item>
                <el-form-item label="坐标系ID" prop="wkid">
                    <el-input v-model.trim="setForm.wkid" style="width: 20%" placeholder="请输入坐标系ID"></el-input>
                </el-form-item>
                <el-form-item label="地图初始化经度" prop="longitude">
                    <el-input-number v-model.trim="setForm.longitude" style="width: 20%" placeholder="请输入地图初始化经度"></el-input-number>
                </el-form-item>
                <el-form-item label="地图初始化维度" prop="latitude">
                    <el-input-number v-model.trim="setForm.latitude" style="width: 20%" placeholder="请输入地图初始化维度"></el-input-number>
                </el-form-item>
                <el-form-item label="地图初始化海拔高度" prop="altitude">
                    <el-input-number v-model.trim="setForm.altitude" style="width: 20%" placeholder="请输入地图初始化海拔高度"></el-input-number>
                </el-form-item>
                <el-form-item label="地图初始化方位角" prop="azimuth">
                    <el-input-number v-model.trim="setForm.azimuth" style="width: 20%" placeholder="请输入地图初始化方位角"></el-input-number>
                </el-form-item>
                <el-form-item label="地图初始化俯仰角" prop="pitchangle">
                    <el-input-number v-model.trim="setForm.pitchangle" style="width: 20%" placeholder="请输入地图初始化俯仰角"></el-input-number>
                </el-form-item>
                <el-form-item label="地图初始化视点高" prop="viewpointheight">
                    <el-input-number v-model.trim="setForm.viewpointheight" style="width: 20%" placeholder="请输入地图初始化视点高"></el-input-number>
                </el-form-item>
                <el-form-item label="地图初始化范围 ymax" prop="fourScopeYmax">
                    <el-input-number v-model.trim="setForm.fourScopeYmax" style="width: 20%" placeholder="请输入地图初始化范围 ymax"></el-input-number>
                </el-form-item>
                <el-form-item label="地图四至范围xmin" prop="fourScopeXmin">
                    <el-input-number v-model.trim="setForm.fourScopeXmin" style="width: 20%" placeholder="请输入地图四至范围xmin"></el-input-number>
                </el-form-item>
                <el-form-item label="地图的四至范围xmax" prop="fourScopeXmax">
                    <el-input-number v-model.trim="setForm.fourScopeXmax" style="width: 20%" placeholder="请输入地图的四至范围xmax"></el-input-number>
                </el-form-item>
                <el-form-item label="地图的四至范围ymin" prop="fourScopeYmin">
                    <el-input-number v-model.trim="setForm.fourScopeYmin" style="width: 20%" placeholder="请输入地图的四至范围ymin"></el-input-number>
                </el-form-item>
            </el-form>
            <span style="margin-left: 20%" slot="footer" class="dialog-footer">
                <el-button type="primary" @click="initSaveAdd">确 定</el-button>
            </span>
        </div>

    </div>
</template>

<script>
import { basemapGetList, basemapSaveMapServe, basemapDelBaseMap, basemapGetType, basemapGetGaochengData, basemapGetBasemap, initSaveOrEdit, getInitParams } from '@/api/basemapInit-api';
import { gaochengGetList, gaochengSaveServer, gaochengDelServer } from '@/api/gaochengData-api';
import {
    getServeType,
} from '@/api/mapservice-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin: false,
            resourceUrl: window.resourceUrl,
            type: 'gaochengdata',
            // 查询关键字
            gaochengQueryname: '',
            gaochengTableData: [],
            gaochengCurrentPage: 1,
            gaochengPageSize: 10,
            gaochengPageTotal: 0,
            gaochengSetForm: {
                pid: 0,
                name: '',
                url: '',
                prjtype: '',
                iconUrl: '',
                load: 0,
                enable: 0
            },
            gaochengSetFormRules: {
                name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                url: [{ required: true, message: 'url不能为空', trigger: 'blur' }],
                prjtype: [{ required: true, message: '项目类型不能为空', trigger: 'blur' }],
                iconUrl: [{ required: true, message: '图标不能为空', trigger: 'blur' }]
            },
            gaochengFileList: [],
            gaochengDialogImageUrl: '',
            gaochengDialogVisible: false,
            gaochengSetTitle: '',
            gaochengSetVisible: false,

            basemapSetServerDialogName: '添加服务',
            basemapTreeData: [],
            basemapTreeProps: {
                children: 'CHILDREN',
                label: 'SNAME'
            },
            basemapFileList: [],
            basemapDialogImageUrl: '',
            basemapDialogVisible: false,

            basemapTableData: [],
            basemapCurrentPage: 1,
            basemapPageSize: 10,
            basemapPageTotal: 0,
            basemapGroupID: 0,
            basemapSearchTXT: '',
            basemapSetVisible: false,
            basemapSetForm: {},
            basemapSetFormRules: {},
            basemapGroupVisible: false,
            basemapGroupTitle: '',
            basemapGroupForm: {
                SNAME: '',
                SERIAL: null,
                GROUPTYPE: 1
            },
            basemapGroupFormRules: {
                SNAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                SERIAL: [{ required: true, message: '序号不能为空', trigger: 'blur' }]
            },
            basemapServeVisible: false,
            basemapServeForm: {
                pid: 0,
                name: '',
                url: '',
                opacity: 100,
                visible: false,
                enable: false,
                isTiandi: 0,
                kind: '',
                ordernum: 0,
                levelOrder: 0,
                maptype: '',
                isdig: false,
                prjtype: '',
                tileinfo: '',
                basemapType: '',
                iconUrl: ''
            },
            basemapDataServers: [],
            basemapServerNameList: [],
            // 服务选择
            basemapServeUrl: '',
            mapMapTypeList: [{
                intnum: 1,
                name: "⼆维",
                stringnum: 1
            }, {
                intnum: 2,
                name: "三维",
                stringnum: 2
                }],
            basemapMapTypeList: [{
                intnum: 1,
                name: "电子",
                stringnum: 1
            }, {
                intnum: 2,
                name: "影像",
                stringnum: 2
            }],
            basemapPrjtypeList: [{
                intnum: 1,
                name: "arcgis",
                stringnum: 1
            }, {
                intnum: 2,
                name: "cesium",
                stringnum: 2
            }, {
                intnum: 3,
                name: "全部",
                stringnum: 3
            }],
            basemapServeTypeList: [],
            basemapDataSourceList: [],
            basemapServeFormRules: {
                url: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }],
                name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
                kind: [{ required: true, message: '服务类型不能为空', trigger: 'change' }],
                levelOrder: [{ required: true, message: '叠加层级排序不能为空', trigger: 'change' }],
                opacity: [{ required: true, message: '透明度不能为空', trigger: 'blur' }],
                maptype: [{ required: true, message: '地图服务类型不能为空', trigger: 'blur' }],
                basemapType: [{ required: true, message: '底图类型不能为空', trigger: 'blur' }],
                prjtype: [{ required: true, message: '项目类型不能为空', trigger: 'blur' }],
                tileinfo: [{ required: true, message: '平铺信息不能为空', trigger: 'blur' }],
                iconUrl: [{ required: true, message: '图标不能为空', trigger: 'blur' }]
            },

            queryname: '',
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            setForm: {
                pid: 0,
                naviconstraint: false,
                opacity: 100,
                color: '',
                x: '',
                y: '',
                scale: '',
                wkid: '',
                longitude: '',
                latitude: '',
                altitude: '',
                azimuth: '',
                pitchangle: '',
                viewpointheight: '',
                fourScopeYmax: '',
                fourScopeXmin: '',
                fourScopeXmax: '',
                fourScopeYmin: '',
            },
            elevDataList: [],
            baseDataList: [],
            setFormRules: {
                x: [{ required: true, message: '类型不能为空', trigger: 'change' }],
                y: [{ required: true, message: '坐标系WKID不能为空', trigger: 'blur' }],
                scale: [{ required: true, message: 'XMIN不能为空', trigger: 'blur' }],
                wkid: [{ required: true, message: 'YMIN不能为空', trigger: 'blur' }],
            },
            setTitle: '',
            setVisible: false,
            typeList: [
                { label: 'Tile', value: 'Tile' },
                { label: 'Image', value: 'Image' }
            ]
        };
    },
    computed: {},
    watch: {
        setVisible: {
            handler(boo) {
                if (boo) {
                    this.getLayerType();
                }
            }
        }
    },
    created() { },
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.gaochengGetData();
        this.initGaochengData();
        this.initBasemap();
    },
    methods: {
      basemapHandleRemove(file) {
            this.$refs.basemapUpload.clearFiles()
            this.basemapServeForm.iconUrl = '';
            this.basemapFileList = [];
        },
        basemapHandleDownload(file) {
            console.log(file);
        },
        basemapHandlePictureCardPreview(file) {
            this.basemapDialogImageUrl = file.url;
            this.basemapDialogVisible = true;
        },
      basemapBeforeAddIcon(files, fileList) { 
            this.$message.warning(`当前限制单次上传 1 个图标，请先移除后上传`);
        },
      basemapHandleChange(file, fileList) {
            
            if (fileList.length > 0) {
                this.basemapFileList = fileList;
                this.basemapServeForm.iconUrl = '1';
            } else { 
                this.basemapServeForm.iconUrl = '';
                this.basemapFileList = [];
            }
        },
      gaochengHandleRemove(file) {
            this.$refs.gaochengUpload.clearFiles()
            this.gaochengSetForm.iconUrl = '';
            this.gaochengFileList = [];
        },
        gaochengHandleDownload(file) {
            console.log(file);
        },
      gaochengHandlePictureCardPreview(file) {
            this.gaochengDialogImageUrl = file.url;
            this.gaochengDialogVisible = true;
        },
      gaochengBeforeAddIcon(files, fileList) { 
            this.$message.warning(`当前限制单次上传 1 个图标，请先移除后上传`);
        },
      gaochengHandleChange(file, fileList) {
            
            if (fileList.length > 0) {
                this.gaochengFileList = fileList;
                this.gaochengSetForm.iconUrl = '1';
            } else { 
                this.gaochengSetForm.iconUrl = '';
                this.gaochengFileList = [];
            }
        },
        // 编辑服务
        basemapHandleEdit(row) {
            console.log(row);
            this.basemapSetServerDialogName = '编辑服务';
            this.basemapServeVisible = true;
            this.$nextTick(() => {
                this.basemapServeForm.url = row.url;
                this.basemapServeForm.name = row.name;
                this.basemapServeForm.kind = String(row.kind);
                this.basemapServeForm.visible = row.visible;
                this.basemapServeForm.enable = row.enable;
                this.basemapServeForm.ordernum = row.ordernum;
                this.basemapServeForm.opacity = Number(row.opacity);
                this.basemapServeForm.pid = row.pid;
                this.basemapServeForm.levelOrder = row.levelOrder;
                this.basemapServeForm.maptype = row.maptype;
                this.basemapServeForm.isdig = row.isdig;
                this.basemapServeForm.isTiandi = row.isTiandi;
                this.basemapServeForm.prjtype = row.prjtype;
                this.basemapServeForm.tileinfo = row.tileinfo;
                this.basemapServeForm.basemapType = row.basemapType;
                this.basemapServeForm.iconUrl = row.iconUrl;

                this.basemapFileList = []
                let file = {
                    name: row.name,
                    url: this.resourceUrl + row.iconUrl
                }
                this.basemapFileList.push(file);
            });
        },
        // 保存服务弹窗
        basemapSaveServeDialog() {
            this.$refs.basemapServeForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const formData = new FormData();
                formData.append('file', this.basemapFileList[0].raw);
                formData.append('pid', this.basemapServeForm.pid);
                formData.append('name', this.basemapServeForm.name);
                formData.append('url', this.basemapServeForm.url);
                formData.append('opacity', this.basemapServeForm.opacity);
                formData.append('visible', this.basemapServeForm.visible);
                formData.append('enable', this.basemapServeForm.enable);
                formData.append('isTiandi', this.basemapServeForm.isTiandi);
                formData.append('kind', this.basemapServeForm.kind);
                formData.append('ordernum', this.basemapServeForm.ordernum);
                formData.append('levelOrder', this.basemapServeForm.levelOrder);
                formData.append('maptype', this.basemapServeForm.maptype);
                formData.append('isdig', this.basemapServeForm.isdig);
                formData.append('prjtype', this.basemapServeForm.prjtype);
                formData.append('tileinfo', this.basemapServeForm.tileinfo);
                formData.append('basemapType', this.basemapServeForm.basemapType);


                const res = await basemapSaveMapServe(formData);
                if (res.code == 200) {
                    this.$message.success('保存成功');
                    this.basemapServeVisible = false;
                    this.basemapGetData();
                }
            });
        },
        // 关闭服务弹窗
        basemapCloseServeDialog() {
            this.$refs.basemapServeForm.resetFields();
            this.basemapServeUrl = '';
            this.basemapServerNameList = [];
        },

        // 页数点击
        basemapHandlePageChange(val) {
            this.basemapCurrentPage = val;
            this.basemapGetData();
        },
        basemapHandleAdd() { 
            this.basemapServeForm.pid = 0;
            this.basemapServeVisible = true;
            this.basemapSetServerDialogName = '新增服务';
            this.$nextTick(() => {
              this.$refs.basemapUpload.clearFiles();
          })
        },
        // 弹窗确认
        gaochengSaveAdd() {
            this.$refs.gaochengSetFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');

                const formData = new FormData();
                formData.append('file', this.gaochengFileList[0].raw);
                formData.append('pid', this.gaochengSetForm.pid);
                formData.append('name', this.gaochengSetForm.name);
                formData.append('prjtype', this.gaochengSetForm.prjtype);
                formData.append('url', this.gaochengSetForm.url);
                formData.append('enable', this.gaochengSetForm.enable);
                formData.append('load', this.gaochengSetForm.load);

                const res = await gaochengSaveServer(formData);
                if (res.code === 200) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.gaochengSetVisible = false;
                    this.gaochengGetData();
                }
            });
        },
        // 删除
        async gaochengHandleDelete(row) {
            //询问是否删除
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    const res = await gaochengDelServer(row.pid);
                    if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.gaochengGetData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },
        // 编辑
        gaochengHandleEdit(row) {
            console.log(row);
            this.gaochengSetTitle = '编辑';
            this.gaochengSetVisible = true;
            Object.assign(this.gaochengSetForm, row);
            this.gaochengFileList = []
            let file = {
                    name: row.name,
                    url: this.resourceUrl + row.iconUrl
            }
            this.gaochengFileList.push(file);
        },
        // 新增
        gaochengAddType() {
          this.gaochengSetTitle = '新增';
          this.gaochengSetVisible = true;
          this.gaochengSetForm.name = '';
          this.gaochengSetForm.pid = 0;
          this.gaochengSetForm.url = '';
          this.gaochengSetForm.prjtype = '';
          this.gaochengSetForm.iconUrl = '';
          this.gaochengSetForm.enable = 0;
          this.gaochengSetForm.load = 0;
          this.$nextTick(() => {
            this.$refs.gaochengUpload.clearFiles();
          })    
        },
        // 获取列表数据
        async gaochengGetData(form) {
            let params = {
                keyword: '',
                page: this.gaochengCurrentPage,
                pageSize: this.gaochengPageSize
            };
            if (form?.keyword) {
                Object.assign(params, form);
            }

            const res = await gaochengGetList(params);
            if (res.code === 200) {
                this.gaochengTableData = res.data.records;
                this.gaochengPageTotal = res.data.total;
            }
        },

        initGaochengData() { 
            basemapGetGaochengData().then(res => { 
                if (res.code == 200) { 
                    this.elevDataList = res.data;
                }
            })
        },
        initBasemap() { 
            basemapGetBasemap().then(res => { 
                if (res.code == 200) { 
                    this.basemapBaseDataList = res.data;
                }
            })
        },
        // 获取图层类型
        async getLayerType() {
            const res = await basemapGetType();
            if (res.code === 200) {
                this.basemapTypeList = res.data;
            }
        },

        // 新增
        addType() {
            this.basemapSetTitle = '新增';
            this.basemapSetVisible = true;
        },

        // 搜索
        handleSearch() {
            let form = {
                keyword: this.basemapQueryname
            };
            this.basemapGetData(form);
        },

        // 当前页点击
        handlePageChange(val) {
            this.currentPage = val;
            let form = {
                keyword: this.basemapQueryname
            };
            this.basemapGetData(form);
        },

        // 获取列表数据
        async basemapGetData(form) {
            let params = {
                keyword: '',
                page: this.basemapCurrentPage,
                pageSize: this.basemapPageSize
            };
            if (form?.keyword) {
                Object.assign(params, form);
            }

            const res = await basemapGetList(params);
            if (res.code === 200) {
                this.basemapTableData = res.data.records;
                this.basemapPageTotal = res.data.total;
            }
        },

        // 弹窗确认
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                console.log("添加", this.setForm)
                const res = await basemapSaveBaseMap(this.setForm);
                if (res.code === 200) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.basemapSetVisible = false;
                    this.basemapGetData();
                }
            });
        },

        // 弹窗关闭
        closedSetDialog() {
            this.$refs.gaochengSetForm.resetFields();
            this.$refs.gaochengUpload.clearFiles();
            this.basemapSetForm = this.$options.data().setForm;
        },

        // 编辑
        handleEdit(row) {
            this.basemapSetTitle = '编辑';
            this.basemapSetVisible = true;
            Object.assign(this.basemapSetForm, row);
        },

        // 删除
        async basemapHandleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let params = {
                        pid: row.pid
                    };
                    const res = await basemapDelBaseMap(row.pid);
                    if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.basemapGetData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });


        },

        handleClick() { 
            console.log('hhh')
            if (this.type == 'gaochengdata') {
                this.gaochengGetData();
            } else if (this.type == 'basemap') {
                this.basemapGetData();
                this.basemapGetServeTypeList();
            } else { 
                this.initGetData();
            }
        },
        initGetData() { 
            getInitParams().then(res => { 
                if (res.code == 200) { 
                    Object.assign(this.setForm, res.data);
                }
            })
        },
        initSaveAdd() { 
            initSaveOrEdit(this.setForm).then(res => { 
                if (res.code == 200) {
                    this.$message.success("修改成功")
                }
            })
        },
        // 服务类型
        async basemapGetServeTypeList() {
            const res = await getServeType();
            if (res.code === 200) {
                this.basemapServeTypeList = res.data;
            }
        },
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';

.el-select {
    width: 100%;
}
</style>