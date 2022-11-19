<template>
    <div class="home-container">
        <!-- 导航栏 -->
        <!-- fixed:导航栏固定定位,vant组件库提供的 -->
        <van-nav-bar class="page-nav-bar" fixed>
            <template #title>
                <van-button type="info" size="small" round icon="search" class="search-btn" to="/search">搜索</van-button>
            </template>
        </van-nav-bar>
        <!-- /导航栏 -->

        <!-- 频道列表 -->
        <!-- 通过 v-model:active 绑定当前激活标签对应的索引值，默认情况下启用第一个标签 谁被激活,谁有高亮样式。 -->
        <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
        <!-- 通过 swipeable 属性可以开启滑动切换标签页。 注意:这里滑动的区域只有在内容区域才可以滑动 -->
        <van-tabs class="channel-tabs" v-model="active" animated swipeable>
            <van-tab v-for="item in channels" :key="item.id" :title="item.name">
                <ArticleList :channels="item"></ArticleList>
            </van-tab>
            <template #nav-right>
                <div class="k2"></div>
                <div class=" hamburger-btn" @click="show = true">
                    <i class="iconfont icon-gengduo"></i>
                </div>
            </template>
        </van-tabs>
        <!-- /频道列表 -->

        <!-- 频道编辑弹出层 (自身带的功能:点击遮盖区域(即黑色区域)或者x号可以关闭弹出层)-->
        <van-popup v-model="show" closeable position="bottom" :style="{ height: '100%' }"
            close-icon-position="top-left">
            <ChannelEdit :channels="channels" :active="active" @update-active="onUpdateActive"></ChannelEdit>
        </van-popup>
        <!-- /频道编辑弹出层 -->
    </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-deit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
    name: 'HomeIndex',
    data() {
        return {
            active: 0,
            channels: [],//我的频道列表
            show: false,//控制编辑频道弹出层的显示状态
        }
    },
    created() {
        this.loadChannels()
    },
    methods: {
        async loadChannels() {
            try {
                let Channels = []
                //曾经只获取了用户的频道列表,解决还要获取本地存储的频道列表
                // const { data: { data: { channels } } } = await getUserChannels()
                // this.channels = channels
                if (this.user) {
                    //已登录,请求获取用户频道列表
                    const { data: { data: { channels } } } = await getUserChannels()
                    Channels = channels
                } else {
                    //未登录,判断是否有本地的频道列表数据
                    const localchannels = getItem('TOTIAO_CHANNELS')
                    if (localchannels) {
                        //有,拿来使用
                        Channels = localchannels
                    } else {
                        //没有,请求获取默认频道列表
                        const { data: { data: { channels } } } = await getUserChannels()
                        Channels = channels
                    }
                }
                this.channels = Channels
            } catch (err) {
                this.$toast('获取频道数据失败')
            }
        },
        onUpdateActive(index, show = true) {
            //更新激活的频道项
            this.active = index
            //关闭编辑频道弹层
            this.show = show
        }
    },
    computed: {
        ...mapState(['user'])
    },
    components: {
        ArticleList,
        ChannelEdit
    }
}
</script>

<style lang="less" scoped>
.home-container {
    padding-bottom: 50px;

    .van-nav-bar__title {
        max-width: unset;
    }

    .search-btn {
        width: 220px;
        background-color: #5babfb;
        border: none;
        font-size: 18px;

        .van-icon-search {
            color: #fff;
        }
    }

    /deep/ .channel-tabs {
        .van-tabs__wrap {
            height: 38px;
            position: fixed;
            top: 46px;
            z-index: 1;
            left: 0;
            right: 0;
        }

        .van-tabs__nav--line {
            padding-left: 0;
            padding-right: 0;
        }

        .k2 {
            width: 44px;
            height: 37.99px;
            flex-shrink: 0;
        }

        .van-tab {
            width: 111px;
            border-right: 1px solid #edeff3;
            font-size: 16px;
            color: #777777;
        }

        .van-tab--active {
            color: #333333;
        }

        .van-tabs__line {
            width: 15px;
            background-color: #3296fa;
            bottom: 18px;
        }

        .hamburger-btn {
            width: 44px;
            height: 37.99px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            right: 0;
            background-color: #fff;
            opacity: 0.902;

            i.icon-gengduo {
                font-size: 20px;
            }

            &:before {
                content: '';
                position: absolute;
                left: 0;
                width: 1px;
                height: 100%;
                background-image: url(~@/assets/gradient-gray-line.png);
                background-size: contain;
            }
        }
    }
}
</style>