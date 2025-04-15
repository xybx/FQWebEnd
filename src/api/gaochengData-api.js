/*
 * @Author: WCL
 * @Date: 2022-02-08 16:10:06
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-22 11:23:56
 * @FilePath: \3d-web\src\api\gaochengData-api.js
 * @Description: 地图服务器API
 */
import request from '@/utils/request';

// 地图服务器分页
export const gaochengGetList = (params) => {
    return request({
        method: 'GET',
        url: '/gaochengData/page',
        params
    });
};

// 地图服务器保存
export const gaochengSaveServer = (data) => {
    return request({
        method: 'POST',
        url: '/gaochengData/saveOrEdit',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    });
};

// 地图服务器删除
export const gaochengDelServer = (params) => {
    return request({
        method: 'POST',
        url: '/gaochengData/' + params
    });
};
