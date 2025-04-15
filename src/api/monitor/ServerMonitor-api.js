import request from '@/utils/request';

// 根据筛选条件获取分页列表
export const queryPageApi = (params) => {
    return request({
        method: 'GET',
        url: '/monitor/server/manage/page',
        params
    });
};

// 保存服务器信息
export const saveOrEditApi = (data) => {
    return request({
        method: 'POST',
        url: '/monitor/server/manage',
        data
    });
};

// 删除服务器信息
export const delApi = (pid) => {
    return request({
        method: "POST",
        url: "/monitor/server/manage/" + pid
    })
}