import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List, Avatar, Toast } from 'antd-mobile';
import Cashier from '@cashier/web';
import Container from '../components/container'
import styles from './account.module.scss';


const appId = 'CHQZ'
const appToken = 'vNZeNQbFnL5EJx72Y37VQkem'

export default function Account(props: any) {
    const [loginState, setLoginState] = useState(null);

    const sdkInsta = useMemo(() => {
        return new Cashier({
            // 应用 ID
            appId,
            appToken,
            // domain: 'https://test-sdk-api.my.webinfra.cloud'
        });
    }, []);
    /**
     * 获取用户的登录状态
     */
    const getLoginState = useCallback(async () => {
        const state = await sdkInsta.getUserInfo({
            refresh: true,
        });
        console.log('get loginState: ', state)
        setLoginState(state);
    }, [sdkInsta]);

    const login = useCallback((e: any) => {
        e.preventDefault();
        sdkInsta.login()
            .then(info => {
                console.log('login success: ', info);
                setLoginState(info);
            })
    }, [sdkInsta])

    useEffect(() => {
        if (sdkInsta) {
            sdkInsta.init()
                .then(() => {
                    return getLoginState()
                })
        }
    }, [sdkInsta])

    const handleHelpClick = (e) => {
        e.preventDefault();
        Toast.show({
            content: '微信公众号 (webinfra) 中，发送消息联系客服',
        })
    }
    const handleMemberClick = useCallback((e) => {
        e.preventDefault();
        if (loginState?.profile?.plan > 1) {
            Toast.show({
                content: '微信公众号 (webinfra) 中，发送消息联系客服',
            })
            return;
        }
        console.log('purchase...');
        sdkInsta.purchase({})
            .then((resp) => {
                console.log('purchase resp: ', resp)
                window?.location?.reload();
            })
    }, [sdkInsta]);

    const dumbClick = e => {
        e.preventDefault();
    }

    const clearUserAuth = (e: any) => {
        e.preventDefault();
        sdkInsta.logout().then(() => {
            Toast.show({ content: '清除登录信息' })
            window?.location?.reload();
        })
    }

    const getPlanDescriptor = useCallback((plan) => {
        console.log('plan - ', plan);
        if (typeof plan !== 'number') {
            return '未开通'
        }
        if (plan === 1) {
            return 'Basic'
        }
        if (plan === 2) {
            return 'Pro'
        }
    }, [loginState]);

    return <div className="min-h-screen" style={{ height: '100%' }}>
        <div className={styles['main']}>
            <Container>
                <div className={styles['account-container']}>
                    <List header='用户信息' mode='card'>
                        <List.Item
                            onClick={loginState ? null : login}
                            prefix={<Avatar src={loginState?.avatar || loginState?.weixinProfile?.headimgurl} />}
                            description={loginState?.email || loginState?.weixinProfile?.loginOpenid || '尚未添加个人介绍'}
                        >
                            {loginState ? (loginState.weixinProfile?.nickname || loginState?.name || loginState?.email || loginState?.id).slice(0, 13) : '未登录'}
                        </List.Item>
                        <List.Item extra={getPlanDescriptor(loginState?.profile?.plan)} onClick={handleMemberClick}>
                            会员等级
                        </List.Item>
                        <List.Item extra={loginState?.profile?.amount || 0} onClick={handleMemberClick}>
                            专属额度
                        </List.Item>
                        <List.Item extra={loginState?.profile?.expireAt ? new Date(loginState?.profile?.expireAt).toLocaleDateString() : ' / '}>
                            有效期
                        </List.Item>
                        <List.Item onClick={handleHelpClick}>联系客服</List.Item>
                        <List.Item onClick={loginState ? clearUserAuth : login}>
                            {(!loginState ? '点击登录' : "退出登录")}
                        </List.Item>
                    </List>
                </div>
            </Container>
        </div>
    </div>
}