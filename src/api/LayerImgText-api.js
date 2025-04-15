import request from '@/utils/request';
import axios from 'axios';

// 获取地图服务的图文关联
export const getTreeApi = (params) => {
    return request({
        method: 'GET',
        url: '/layer/imgTextAssociation/tree',
        params
    });
}

// 上传文档
export const uploadDocumentApi = (data) => {
    return request({
        method: 'POST',
        url: '/layer/imgTextAssociation/upload',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    });
}

// 添加子节点
export const addNodeApi = (data) => {
    return request({
        method: 'POST',
        url: '/layer/imgTextAssociation',
        data
    });
}

// 下载文档
export const downloadDocumentApi = (params, token, fileName) => {

    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: window.apiURL + '/layer/imgTextAssociation/download', // 请求地址
            responseType: 'blob', // 表明返回服务器返回的数据类型
            headers: {
                Authorization: token,
                loginType: 'system'
            },
            params: params
        }).then(
            response => {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(downloadUrl);
            },
            err => {
                reject(err)
            }
        )
    })
}

// 删除选中
export const delApi = (pid) => {
    return request({
        method: 'POST',
        url: '/layer/imgTextAssociation/del/' + pid
    });
}