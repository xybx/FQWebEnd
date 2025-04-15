import request from '@/utils/request';

// 根据筛选条件获取功能菜单排名柱状图
export const queryUseRank = (params) => {
    return request({
        method: 'GET',
        url: '/log/function/manage/useRank',
        params
    });
};
