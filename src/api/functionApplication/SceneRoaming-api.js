import request from '@/utils/request';
import axios from 'axios';

// 获取数据列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/manage/sceneRoaming/list',
        params: params
    });
};

// 删除数据
export const del = (param) => {
    return request({
        method: 'POST',
        url: '/manage/sceneRoaming/del/' + param
    });
}