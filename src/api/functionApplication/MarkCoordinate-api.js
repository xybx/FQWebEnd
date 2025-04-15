import request from '@/utils/request';

// 获取数据列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/manage/markCoordinate/list',
        params: params
    });
};

// 删除数据
export const del = (param) => {
    return request({
        method: 'POST',
        url: '/manage/markCoordinate/del/' + param
    });
}