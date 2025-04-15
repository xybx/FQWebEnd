import request from '@/utils/request';
export const getTreeData = () => {
    return request({
        method: 'GET',
        url: '/commominfo/iconingroups',
    });
}
export const putTreeGroup = (data) => {
    return request({
        method: 'POST',
        url: '/commomicontype/editicongroup',
        data
    });
}
export const putTreeItem = (data) => {
    return request({
        method: 'POST',
        url: '/commomicontype/editicon',
        data
    });
}
export const delTreeGroup = (params) => {
    return request({
        method: 'GET',
        url: '/commomicontype/delicongroup',
        params
    });
}
export const delTreeItem = (params) => {
    return request({
        method: 'GET',
        url: '/commomicontype/delicon',
        params
    });
}