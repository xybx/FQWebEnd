/*
 * @Author: ssq
 * @Date: 2022-11-11 10:35:42
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-11 10:35:44
 * @FilePath: \fjsy-web\src\api\highQuality-api.js
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
 */
import request from '@/utils/request';

// 删除数据
export const delAll = () => {
    return request({
        method: 'POST',
        url: '/highQuality/del/'
    });
}

// 导入数据地址
export const importDataUrl = () => {
    return request.baseURL + "/highQuality/import";
}