/*
 * @Author: WCL
 * @Date: 2021-12-06 15:59:37
 * @LastEditors: ssq
 * @LastEditTime: 2023-01-03 13:40:35
 * @FilePath: \3d-web\src\router\index.js
 * @Description: 请填写描述
 */
import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        component: () => import('../layout/Home.vue'),
        meta: { title: '首页' },
        children: [
            {
                path: '/mapservice',
                component: () => import('../views/dataresource/MapService.vue'),
                meta: {
                    title: '地图服务'
                }
            },
            {
                path: '/metaData',
                component: () => import('../views/dataresource/MetaData'),
                meta: {
                    title: '元数据'
                }
            },
            {
                path: '/serviceApply',
                component: () => import('../views/dataresource/ServiceApply'),
                meta: {
                    title: '服务申请'
                }
            },
            {
                path: '/serverMonitor',
                component: () => import('../views/monitor/ServerMonitor'),
                meta: {
                    title: '服务监控'
                }
            },
            {
                path: '/serviceMonitor',
                component: () => import('../views/monitor/ServiceMonitor'),
                meta: {
                    title: '服务器监控'
                }
            },
            {
                path: '/specialTopicLog',
                component: () => import('../views/log/SpecialTopicVisitLog'),
                meta: {
                    title: '专题访问日志'
                }
            },
            {
                path: '/systemOnlineLog',
                component: () => import('../views/log/SystemOnlineLog'),
                meta: {
                    title: '系统在线日志'
                }
            },
            {
                path: '/systemVisitLog',
                component: () => import('../views/log/SystemVisitLog'),
                meta: {
                    title: '系统访问日志'
                }
            },
            {
                path: '/functionMenuLog',
                component: () => import('../views/log/FunctionMenuLog'),
                meta: {
                    title: '功能菜单访问日志'
                }
            },
            {
                path: '/historyprj',
                component: () => import('../views/historyprj/historyprj.vue'),
                meta: {
                    title: '历史项目数据'
                }
            },
            {
                path: '/indexFunctionMenu',
                component: () => import('../views/basicconfig/onemapmenu/IndexFunctionMenu.vue'),
                meta: {
                    title: '首页功能菜单'
                }
            },
            {
                path: '/iconManager',
                component: () => import('../views/basicconfig/IconManage.vue'),
                meta: {
                    title: '图标管理'
                }
            },
            {
                path: '/sceneRoaming',
                component: () => import('../views/functionApplication/SceneRoaming.vue'),
                meta: {
                    title: '场景漫游'
                }
            },
            {
                path: '/sceneBookMark',
                component: () => import('../views/functionApplication/SceneBookMark.vue'),
                meta: {
                    title: '场景书签'
                }
            },
            {
                path: '/drawIcon',
                component: () => import('../views/functionApplication/DrawIcon.vue'),
                meta: {
                    title: '图标绘制'
                }
            },
            {
                path: '/markCoordinate',
                component: () => import('../views/functionApplication/MarkCoordinate'),
                meta: {
                    title: '标注坐标'
                }
            },
            {
                path: '/highQuality',
                component: () => import('../views/highQuality/highQuality.vue'),
                meta: {
                    title: '高质量发展'
                }
            },
            {
                path: '/mapservice_szxc',
                component: () => import('../views/dataresource/MapService.vue'),
                meta: {
                    title: '数字乡村地图服务'
                }
            },
            {
                path: '/spacecalc',
                component: () => import('../views/basicconfig/SpaceCalc.vue'),
                meta: {
                    title: '空间计算引擎'
                }
            },
            {
                path: '/geoserver',
                component: () => import('../views/basicconfig/GeoServer.vue'),
                meta: {
                    title: '地图服务器'
                }
            },
            {
                path: '/basicInfo',
                component: () => import('../views/basicconfig/basicInfo.vue'),
                meta: {
                    title: '三维基础信息'
                }
            },
            {
                path: '/basemapInit',
                component: () => import('../views/basicconfig/BasemapInit.vue'),
                meta: {
                    title: '初始化底图'
                }
            },
            {
                path: '/sdedatabase',
                component: () => import('../views/basicconfig/SdeDatabase.vue'),
                meta: {
                    title: '空间数据库'
                }
            },
            {
                path: '/basemapconfig',
                component: () => import('../views/basicconfig/BasemapConfig.vue'),
                meta: {
                    title: '底图配置'
                }
            },
            {
                path: '/condition',
                component: () => import('../views/onemap/Condition.vue'),
                meta: {
                    title: '条件查询'
                }
            },
            {
                path: '/hxdownload',
                component: () => import('../views/onemap/HxDownload.vue'),
                meta: {
                    title: '红线下载'
                }
            },
            {
                path: '/locate',
                component: () => import('../views/onemap/QueryLocate.vue'),
                meta: {
                    title: '查询定位'
                }
            },
            {
                path: '/locate_szxc',
                component: () => import('../views/onemap/QueryLocate.vue'),
                meta: {
                    title: '查询定位'
                }
            },
            {
                path: '/analysisServe',
                component: () => import('../views/functionApplication/AnalysisServe.vue'),
                meta: {
                    title: '分析服务'
                }
            },
            {
                path: '/cityDesign',
                component: () => import('../views/functionApplication/CityDesign.vue'),
                meta: {
                    title: '城市设计'
                }
            },
            {
                path: '/locatechild',
                component: () => import('../views/onemap/LocateChild.vue'),
                meta: {
                    title: '定位-子图层'
                }
            },
            {
                path: '/departadmin',
                component: () => import('../views/safemanage/DepartAdmin.vue'),
                meta: {
                    title: '部门管理'
                }
            },
            {
                path: '/roleadmin',
                component: () => import('../views/safemanage/RoleAdmin.vue'),
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: '/setroleauth',
                name: 'setroleauth',
                component: () => import('../views/safemanage/SetRoleAuth2.vue'),
                meta: {
                    title: '角色权限配置'
                }
            },
            {
                path: '/setroleedit',
                name: 'setroleedit',
                component: () => import('../views/safemanage/RoleEdit.vue'),
                meta: {
                    title: '角色信息权限设置'
                }
            },
            {
                path: '/peopleadmin',
                component: () => import('../views/safemanage/PeopleAdmin.vue'),
                meta: {
                    title: '人员管理'
                }
            },
            {
                path: '/dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: { title: '系统首页' }
            },
            {
                path: '/citymanage',
                component: () => import('../views/onemap/citymanage/citymanage.vue'),
                meta: { title: '城市经营' }
            },
            {
                path: '/review',
                component: () => import('../views/onemap/review/review.vue'),
                meta: { title: '合规审查' }
            },
            {
                path: '/area',
                component: () => import('../views/onemap/City.vue'),
                meta: { title: '行政区划' }
            },
            {
                path: '/onemapmenu',
                component: () => import('../views/basicconfig/onemapmenu/onemapmenu.vue'),
                meta: { title: '菜单管理' }
            },
            {
                path: '/onemapmenuauth',
                component: () => import('../views/basicconfig/onemapmenu/onemapmenuauth.vue'),
                meta: { title: '菜单权限列表' }
            },
            {
                path: '/menuchild',
                component: () => import('../views/basicconfig/onemapmenu/addsecondeList.vue'),
                meta: { title: '二级子菜单' }
            },
            {
                path: '/menusecondchild',
                component: () => import('../views/basicconfig/onemapmenu/addThridList .vue'),
                meta: { title: '三级子菜单' }
            },
            {
                path: '/systemmenu',
                component: () => import('../views/systemconfig/SystemMenuMange/SystemMenuMange.vue'),
                meta: { title: '系统菜单管理' }
            },
            {
                path: '/sonmenu',
                component: () => import('../views/systemconfig/SystemMenuMange/SonMenu.vue'),
                meta: {
                    title: '系统子菜单'
                }
            },
            {
                path: '/evaluation',
                component: () => import('../views/evaluation/evaluation.vue'),
                meta: { title: '分析评价' }
            },
            {
                path: '/topicmap',
                component: () => import('../views/onemap/topicmap/topicmap.vue'),
                meta: { title: '专题图' }
            },
            {
                path: '/404',
                component: () => import('../views/404.vue'),
                meta: { title: '404' }
            },
            {
                path: '/wiki',
                component: () => import('../views/onemap/Knowledge.vue'),
                meta: {
                    title: '知识库'
                }
            },
            {
                path: '/wiki_szxc',
                component: () => import('../views/onemap/Knowledge.vue'),
                meta: {
                    title: '知识库'
                }
            },
            {
                path: '/wikifile',
                component: () => import('../views/onemap/KnowledgeFile.vue'),
                meta: {
                    title: '知识库文件'
                }
            },
            {
                path: '/landanaly',
                component: () => import('../views/onemap/ProjectCheck.vue'),
                meta: {
                    title: '项目核查'
                }
            },
            {
                path: '/dictconfig',
                component: () => import('../views/basicconfig/dictconfig.vue'),
                meta: {
                    title: '系统字典配置'
                }
            },
            {
                path: '/dynamicmonitor',
                component: () => import('../views/monitor/DynamicMonitor.vue'),
                meta: {
                    title: '动态监测'
                }
            },
            {
                path: '/regularassess',
                component: () => import('../views/monitor/RegularAssess.vue'),
                meta: {
                    title: '定期评估'
                }
            },
            {
                path: '/assesslist',
                component: () => import('../views/monitor/AssessList.vue'),
                meta: {
                    title: '指标列表项'
                }
            },
            {
                path: '/test',
                component: () => import('../views/test.vue'),
                meta: {
                    title: '文件上传'
                }
            },
            {
                path: '/ledger',
                component: () => import('../views/onemap/ledger/ledger.vue'),
                meta: {
                    title: '统计台账'
                }
            },
            {
                path: '/ledgerChild',
                component: () => import('../views/onemap/ledger/ledgerChild.vue'),
                meta: {
                    title: '统计台账子菜单'
                }
            },
            {
                path: '/plan',
                component: () => import('../views/planreview/planresultsdatas.vue'),
                meta: {
                    title: '成果数据管理'
                }
            },
            {
                path: '/opinionlist',
                component: () => import('../views/pulicservice/Idea.vue'),
                meta: {
                    title: '意见征集'
                }
            },
            {
                path: '/wfjblist',
                component: () => import('../views/pulicservice/Illegal.vue'),
                meta: {
                    title: '违法举报'
                }
            },
            {
                path: '/gkgslist',
                component: () => import('../views/pulicservice/Publicity.vue'),
                meta: {
                    title: '公开公示'
                }
            },
            {
                path: '/setPublicityLayers',
                component: () => import('../views/pulicservice/PublicityLayers.vue'),
                meta: { title: '公开公示地图服务列表' }
            },
            {
                path: '/typelist',
                component: () => import('../views/pulicservice/Typelist.vue'),
                meta: {
                    title: '公众服务类型管理'
                }
            },
            {
                path: '/logmanage',
                component: () => import('../views/logmanage/logmanage.vue'),
                meta: {
                    title: '日志列表'
                }
            },
            {
                path: '/hiddenProject',
                component: () => import('../views/projectManage/hiddenProject.vue'),
                meta: {
                    title: '隐藏项目'
                }
            },
            {
                path: '/discussing',
                component: () => import('../views/projectManage/discussing.vue'),
                meta: {
                    title: '正在会商'
                }
            },
            {
                path: '/hasDiscussed',
                component: () => import('../views/projectManage/hasDiscussed.vue'),
                meta: {
                    title: '已会商'
                }
            },
            {
                path: '/waitDiscussed',
                component: () => import('../views/projectManage/waitDiscussed.vue'),
                meta: {
                    title: '待会商'
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/tokenlogin',
        component: () => import('../views/TokenLogin.vue'),
        meta: {
            title: '权限登录'
        }
    },
    {
        path: '*',
        redirect: '/404'
    }
];

const skipAxios = axios.create({
    baseURL: window.apiURL,
    timeout: 3000
});

const router = new Router({
    routes
});
router.beforeEach((to, from, next) => {
    let hastoken = sessionStorage.getItem('token');
    if (to.path == '/home') {
        // 可能是跳转过来的，判断是否存在token，如果存在就不拦截
        if (hastoken) {

            next();

        } else {
            // 不存在，进行token拦截校验
            let token = to.query.token;
            if (token == undefined) {
                this.$router.push('/login');
            } else {
                // 通过token获取后台登录信息，
                let config = {
                    headers: {
                        'Authorization': token
                    }
                };
                debugger;
                skipAxios.get('/login/skip', config).then(res => {
                    if (res.data.code == 200) {
                        sessionStorage.setItem('user', JSON.stringify(res.data.data));
                        sessionStorage.setItem('token', res.data.data.token);
                        sessionStorage.setItem('isadmin', 'true');
                        hastoken = res.data.data.token;
                        next({ path: '/home' });
                    } else {
                        next({ path: '/login' });
                    }
                });
            }
        }
    } else {
        if (hastoken) {
            if (to.path === '/login') {
                next({ path: '/home' });
            } else next();
        } else {
            if (to.path === '/login') {
                // 判断路由是否存在福清token
                if (to.query.token != null) {
                    // 调用接口判断token是否合法
                    // 通过token获取后台登录信息，
                    let config = {
                        headers: {
                            'Authorization': to.query.token
                        }
                    };
                    skipAxios.get('/login/fuqing/auth/manage', config).then(res => {
                        if (res.data.code == 200) {
                            sessionStorage.setItem('user', JSON.stringify(res.data.data));
                            sessionStorage.setItem('token', res.data.data.token);
                            sessionStorage.setItem('isadmin', 'true');
                            hastoken = res.data.data.token;
                            next({ path: '/home' });
                        } else {
                            next({ path: '/login' });
                        }
                    });
                }
            }
            next();
        }
    }

});
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch((err) => err);
};
export default router;
