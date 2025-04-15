/*
 * @Author: WCL
 * @Date: 2022-01-24 10:31:59
 * @LastEditors: ssq
 * @LastEditTime: 2023-01-03 14:17:54
 * @FilePath: \3d-web\public\index.js
 * @Description: 请填写描述
 */

// ==============本机开发=============
// 接口公共地址
// const apiURL = 'http://192.168.1.137:8098';
//接口请求地址  250版
// const apiURL = 'http://192.168.1.182:8099';
const apiURL = 'http://192.168.1.250:8082/fqapi';
// 运维文件存储路径
const apiURL_file = 'http://192.168.1.182:8090';
// 静态文件访问地址
const resourceUrl = 'http://192.168.1.182/FileResources';

// 跳转设计汇演地址
const designUrl = 'http://192.168.1.186:5173/#/home';

// 服务类型
const mapTypes = [
    {
        pid: 1,
        label: 'ArcGisMapServerImagery/ArcGIS服务',
        kind: 12
    },
    {
        pid: 2,
        label: 'CesiumTerrainProvider/Ceisum标准地形图',
        kind: 13
    },
    {
        pid: 3,
        label: 'GeoJsonDataSource/Geojson服务',
        kind: 14
    },
    {
        pid: 4,
        label: 'KmlDataSource/kml矢量数据',
        kind: 15
    },
    {
        pid: 5,
        label: 'Cesium3DTileset/3DTileset',
        kind: 16
    }
];

// ==========测试环境==============
// // 接口公共地址
// const apiURL = 'http://192.168.1.250/23dapi';
// //运维文件存储路径
// const apiURL_file = 'http://192.168.1.250/23dapi'
// // 静态文件访问地址
// const resourceUrl = 'http://192.168.1.250/FileResources'

// ============生产环境==================
// 接口公共地址
// const apiURL = 'http://8.134.97.129/gzlapi';
//运维文件存储路径
// const apiURL_file = 'http://8.134.97.129/gzlapi'

//公众服务平台的文件地址
// const apiURL_file_PublicService = "http://192.168.1.146/fjsyapi/PublicServiceAPI"
