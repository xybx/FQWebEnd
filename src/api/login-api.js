/*
 * @Author: WCL
 * @Date: 2022-01-24 10:24:01
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-25 20:42:51
 * @FilePath: \fjsy-hq-web\src\api\login-api.js
 * @Description: 请填写描述
 */
import request from '@/utils/request';

// 获取部门列表
export const getAllDepts = () => {
    return request({
        method: 'GET',
        url: '/login/deptList'
    });
};

// 获取人员列表
export const getAllPersons = (params) => {
    return request({
        method: 'GET',
        url: '/login/userList',
        params
    });
};

// 登录接口
export const login = (data) => {
    return request({
        method: 'POST',
        url: '/login/login/pid',
        data
    });
};

//退出登录
export const logout = () => {
    return request({
        method: 'GET',
        url: '/login/logout',
    });
};

// 获取登录验证码
export const vcCode = (uuid) => {
    return request({
        method: 'GET',
        url: '/login/' + uuid
    })
}