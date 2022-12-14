import {
    uniNavApiRule,
    reNavMethodRule,
    reNotNavMethodRule,
    Router,
    rewriteMethodToggle,
    uniBackRule,
    uniBackApiRule,
    navtoRule,
    totalNextRoute
} from '../options/base'

import {
    routesForMapRoute,
    getRoutePath,
    getDataType,
    notDeepClearNull,
    resolveAbsolutePath
} from '../helpers/utils'

import {
    warn
} from '../helpers/warn'

import {uniOriginJump} from './uniOrigin'

const rewrite: Array<reNavMethodRule|reNotNavMethodRule> = [
    'navigateTo',
    'redirectTo',
    'reLaunch',
    'switchTab',
    'navigateBack'
];

export function rewriteMethod(
    router:Router
): void {
    if (router.options.keepUniOriginNav === false) {
        rewrite.forEach(name => {
            const oldMethod: Function = uni[name];
            uni[name] = function(
                params:uniNavApiRule|{from:string}|navtoRule,
                originCall:boolean = false,
                callOkCb?:Function,
                forceNav?:boolean
            ):void {
                if (originCall) {
                    uniOriginJump(router, oldMethod, name, (params as uniNavApiRule), callOkCb, forceNav)
                } else {
                    if (router.options.platform === 'app-plus') {
                        if (Object.keys(router.appMain).length === 0) {
                            router.appMain = {
                                NAVTYPE: name,
                                path: (params as uniNavApiRule).url
                            }
                        }
                    }
                    callRouterMethod(params as uniNavApiRule, name, router);
                }
            };
        })
    }
}
function callRouterMethod(
    option: uniNavApiRule|uniBackRule|uniBackApiRule,
    funName:reNavMethodRule|reNotNavMethodRule,
    router:Router
): void {
    if (router.options.platform === 'app-plus') {
        let openType = null;
        if (option) {
            openType = (option as uniNavApiRule).openType;
        }
        if (openType != null && openType === 'appLaunch') {
            funName = 'reLaunch'
        }
    }
    if (funName === 'reLaunch' && JSON.stringify(option) === '{"url":"/"}') {
        warn(
            `uni-app ???????????????reLaunch({url:'/'}) ???????????????????????????????????? this.$Router.replaceAll() ?????? uni.reLaunch({url:'/?xxx=xxx'})`,
            router,
            true
        );
        funName = 'navigateBack';
        option = {
            from: 'backbutton'
        }
    }
    if (funName === 'navigateBack') {
        let level:number = 1;
        if (option == null) {
            option = {delta: 1};
        }
        if (getDataType<number|undefined>((option as uniBackApiRule).delta) === '[object Number]') {
            level = ((option as uniBackApiRule).delta as number);
        }
        router.back(level, (option as uniBackRule|uniBackApiRule));
    } else {
        const routerMethodName = rewriteMethodToggle[(funName as reNavMethodRule)]
        let path = (option as uniNavApiRule).url;
        if (!path.startsWith('/')) {
            const absolutePath = resolveAbsolutePath(path, router);
            path = absolutePath;
            (option as uniNavApiRule).url = absolutePath;
        }
        if (funName === 'switchTab') {
            const route = routesForMapRoute(router, path, ['pathMap', 'finallyPathList'])
            const {finallyPath} = getRoutePath(route, router);
            if (getDataType<string | string[]>(finallyPath) === '[object Array]') {
                warn(
                    `uni-app ??????????????????????????????${path}???????????????tab??????????????????????????? alias ?????????????????????????????????????????????????????????????????????????????????*?????????`,
                    router,
                    true
                );
            }
            if ((finallyPath as string) === '*') {
                warn(
                    `uni-app ??????????????????????????????${path}???????????????????????????????????????????????????????????????????????????*?????????`,
                    router,
                    true
                );
            }
            path = (finallyPath as string);
        }
        const {events, success, fail, complete, animationType, animationDuration} = option as uniNavApiRule;
        const jumpOptions:totalNextRoute = {path, events, success, fail, complete, animationDuration, animationType};
        router[routerMethodName](
            notDeepClearNull<totalNextRoute>(jumpOptions)
        )
    }
}
