/*
 * @Author: WCL
 * @Date: 2022-02-09 10:24:58
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-21 16:33:57
 * @FilePath: \3d-web\src\api\basemapInit-api.js
 * @Description: 底图配置API
 */
import request from '@/utils/request';

// 获取列表数据
export const basemapGetList = (params) => {
    return request({
        method: 'GET',
        url: '/basemapInit/page',
        params
    });
};

// 新增/编辑数据
export const basemapSaveMapServe = (data) => {
    return request({
        method: 'POST',
        url: '/basemapInit/saveOrEdit',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    });
};

// 删除数据
export const basemapDelBaseMap = (params) => {
    return request({
        method: 'POST',
        url: '/basemapInit/' + params
    });
};

// 类型列表
export const basemapGetType = () => {
    return request({
        method: 'GET',
        url: '/BaseMap/GetServerType'
    });
};

// 获取高程数据列表
export const basemapGetGaochengData = () => {
    return request({
        method: 'GET',
        url: '/gaochengData/list'
    });
};

// 获取底图
export const basemapGetBasemap = () => {
    return request({
        method: 'GET',
        url: '/MapServer/list'
    });
};

// 获取初始化参数
export const getInitParams = () => {
    return request({
        method: 'GET',
        url: '/MapInit/query'
    });
}

// 获取初始化参数
export const initSaveOrEdit = (params) => {
    return request({
        method: 'POST',
        url: '/MapInit/saveOrEdit',
        data: params
    });
}