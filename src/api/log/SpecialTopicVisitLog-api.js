import request from '@/utils/request';

// 根据筛选条件获取分页列表
export const queryPageApi = (params) => {
    return request({
        method: 'GET',
        url: '/log/specialTopic/manage/page',
        params
    });
};
