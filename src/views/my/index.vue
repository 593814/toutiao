<template>
    <div class="my-container">
        <!-- 未登录头部 -->
        <div class="header not-login" v-if="!user">
            <div class="login-btn" @click="$router.push('/login').catch(err => { console.log(err) })">
                <img src="~@/assets/mobile.png" alt="" class="mobile-img" />
                <span class="text">登录 / 注册</span>
            </div>
        </div>
        <!-- /未登录头部 -->
        <!-- 已登录头部 -->
        <div class="header user-info" v-else>
            <div class="base-info">
                <div class="left">
                    <van-image :src="userInfo.photo" class="avater" round fit="cover" />
                    <span class="name">{{ userInfo.name }}</span>
                </div>
                <div class="right">
                    <van-button round size="mini" to='/user/profile'>编辑资料</van-button>
                </div>
            </div>
            <div class="data-status">
                <div class="data-item">
                    <span class="count">{{ userInfo.art_count }}</span>
                    <span class="text">头条</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.follow_count }}</span>
                    <span class="text" @click="$router.push('/user/focus')">关注</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.fans_count }}</span>
                    <span class="text">粉丝</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.like_count }}</span>
                    <span class="text">获赞</span>
                </div>
            </div>
        </div>
        <!-- /已登录头部 -->
        <!-- 导航 -->
        <van-grid :column-num="2" class="grid-nav" clickable>
            <van-grid-item class="grid-item">
                <i slot="icon" class="iconfont icon-shoucang"></i>
                <span slot="text">收藏</span>
            </van-grid-item>
            <van-grid-item class="grid-item">
                <i slot="icon" class="iconfont icon-lishi"></i>
                <span slot="text">历史</span>
            </van-grid-item>
        </van-grid>
        <!-- /导航 -->

        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link class="mb-9" />
        <van-cell title="退出登录" class="logout-ceil" v-if="user" @click="onLogout" clickable />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getuserInfo } from '@/api/user'
export default {
    name: 'MyIndex',
    data() {
        return {
            userInfo: {}
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        onLogout() {
            //退出提示
            //在组建中需要使用this.$dialog来调用弹窗组件
            this.$dialog.confirm({
                title: '确认退出吗',
            })
                .then(() => {
                    //确认退出:清除登录状态(容器中的user+本地存储中的user)
                    this.$store.commit('setUser', null)
                    this.$toast.success('退出成功');

                })
                .catch(() => {

                })
        },
        async loadUserInfo() {
            try {
                const { data: { data } } = await getuserInfo()
                this.userInfo = data
                console.log(this.userInfo);
            } catch (err) {
                console.log('获取数据失败');
            }
        }
    },
    created() {
        if (this.user) {
            this.loadUserInfo()
        }
    }
}
</script>

<style lang="less" scoped>
.my-container {
    .header {
        height: 180px;
        // ~@:src根路径
        background: url('~@/assets/banner.png');
        background-size: cover;
    }

    .not-login {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .mobile-img {
            width: 70px;
            height: 70px;
            margin-bottom: 10px;
        }

        .text {
            color: #fff;
            font-size: 16px;
        }
    }

    .user-info {
        .base-info {
            height: 139px;
            padding: 15px 15px 10px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between; //水平撑开
            align-items: center; //垂直居中

            .left {
                display: flex;
                align-items: center;

                .avater {
                    width: 75px;
                    height: 75px;
                    margin-right: 13px;
                    border: 4px solid #fff;
                }

                .name {
                    font-size: 20px;
                    color: #fff;
                }
            }
        }

        .data-status {
            height: 10px;
            display: flex;

            .data-item {
                height: 100%;
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                color: #fff;

                .count {
                    font-size: 21px;
                }

                .text {
                    font-size: 12px;
                }
            }
        }
    }

    .grid-nav {
        margin-bottom: 9px;

        .grid-item {
            height: 65px;

            i.iconfont {
                font-size: 25px;
            }

            .icon-shoucang {
                color: #eb5253;
            }

            .icon-lishi {
                color: #ff9d1d;
            }

            span {
                font-size: 14px;
            }
        }
    }

    .logout-ceil {
        text-align: center;
        color: #d86262;
    }

    .mb-9 {
        margin-bottom: 9px;
    }
}
</style>