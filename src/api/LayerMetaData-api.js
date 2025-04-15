import request from '@/utils/request';

// 保存元数据
export const saveMetaDataApi = (data) => {
    return request({
        method: 'POST',
        url: '/layer/metaData',
        data
    });
}

// 获取元数据详情
export const metaDataDetail = (params) => {
    return request({
        method: 'GET',
        url: '/layer/metaData',
        params
    });
}

// 获取元数据列表
export const metaDataList = (params) => {
    return request({
        method: 'GET',
        url: '/layer/metaData/page',
        params
    });
}

export const initClassList = (params) => {
    return request({
        method: 'GET',
        url: '/layer/metaData/classList',
        params
    });
}