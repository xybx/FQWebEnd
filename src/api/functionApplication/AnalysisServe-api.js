import request from '@/utils/request';

// 获取数据列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/architecture/analysis/manage/page',
        params: params
    });
};

// 删除数据
export const del = (pid) => {
    return request({
        method: 'POST',
        url: '/architecture/analysis/manage/del/' + pid
    });
}

// 启用或禁用
export const enable = (pid) => {
    return request({
        method: 'POST',
        url: '/architecture/analysis/manage/enable/' + pid,
    });
};

// 新增或修改数据
export const saveOrEdit = (data) => {
    return request({
        method: 'POST',
        url: '/architecture/analysis/manage/saveOrEdit',
        data
    })
}

export const getKindType = () => {
    return request({
        method: 'GET',
        url: '/MapServer/GetMapKinds'
    });
};