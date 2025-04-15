import request from '@/utils/request';

// 获取数据列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/cityDesign/manage/page',
        params: params
    });
};

// 删除数据
export const del = (pid) => {
    return request({
        method: 'POST',
        url: '/cityDesign/manage/del/' + pid
    });
};

// 新增数据
export const add = (data) => {
    return request({
        method: 'POST',
        url: '/cityDesign/manage/add',
        data
    });
};

// 修改数据
export const edit = (data) => {
    return request({
        method: 'POST',
        url: '/cityDesign/manage/edit',
        data
    });
};

// 获取三维服务数据列表
export const queryThreeDimensionalityServer = () => {
    return request({
        method: 'GET',
        url: '/MapServer/three'
    })
};