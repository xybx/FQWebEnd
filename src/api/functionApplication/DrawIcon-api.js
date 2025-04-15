import request from '@/utils/request';
import axios from 'axios';

// 获取数据列表
export const getList = (params) => {
    return request({
        method: 'GET',
        url: '/manage/MapDrawicons/list',
        params: params
    });
};

// 删除数据
export const del = (param) => {
    return request({
        method: 'POST',
        url: '/manage/MapDrawicons/del/' + param
    });
}

// 获取数据列表
export const getListIcon = (params) => {
    return request({
        method: 'GET',
        url: '/manage/MapDrawicons/icon/list',
        params: params
    });
};

// 是否存在子数据
export const existChildData = (param) => {
    return request({
        method: 'GET',
        url: '/manage/MapDrawicons/existChildData/' + param
    })
}