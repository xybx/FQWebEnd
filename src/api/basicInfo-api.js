/*
 * @Author: ssq
 * @Date: 2022-12-22 11:10:55
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-22 11:20:36
 * @FilePath: \3d-web\src\api\basicInfo-api.js
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
 */
import request from '@/utils/request';
export const queryData = () => {
    return request({
        method: 'GET',
        url: '/basicInfo',
    });
};

export const saveOrEdit = (params) => {
    return request({
        method: 'POST',
        url: '/basicInfo/saveOrEdit',
        data: params
    });
};