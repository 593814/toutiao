<template>
    <div class="layout-container">
        <!-- 子路由出口 -->
        <router-view></router-view>
        <!-- /子路由出口 -->

        <!-- 标签导航栏 -->
        <!-- route:开启路由模式 配合to -->
        <van-tabbar class="layout-tabbar" route>
            <van-tabbar-item to="/home">
                <i slot="icon" class="iconfont icon-shouye"></i>
                首页
            </van-tabbar-item>
            <van-tabbar-item to="/qa">
                <i slot="icon" class="iconfont icon-wenda"></i>
                问答
            </van-tabbar-item>
            <van-tabbar-item to="/video">
                <i slot="icon" class="iconfont icon-shipin"></i>
                视频
            </van-tabbar-item>
            <van-tabbar-item to="/my">
                <i slot="icon" class="iconfont icon-wode"></i>
                {{ $store.state.user ? '我的' : '未登录' }}
            </van-tabbar-item>
        </van-tabbar>
        <!-- /标签导航栏 -->
    </div>
</template>

<script>
export default {
    name: 'LayoutIndex',
    data() {
        return {

        }
    }
}
</script>

<style lang="less" scoped>
.layout-container {
    .layout-tabbar {
        .iconfont {
            font-size: 20px;
        }
    }
}
</style>