/*
 * @Author: ssq
 * @Date: 2023-01-03 13:53:11
 * @LastEditors: ssq
 * @LastEditTime: 2023-01-03 16:59:08
 * @FilePath: \3d-web\src\api\IndexFunctionMenu.js
 * @Description: 
 * 
 * Copyright (c) 2023 by hydp, All Rights Reserved. 
 */
import request from '@/utils/request';

// 查询
export const queryData = () => {
    return request({
        url: '/functionMenu',
        method: 'GET'
    });
};

// 添加或修改
export const saveOrEdit = (data) => {
    return request({
        url: '/functionMenu',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    });
}

// 删除
export const del = (pid) => {
    return request({
        url: '/functionMenu/' + pid,
        method: 'POST'
    });
}