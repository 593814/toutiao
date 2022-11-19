<template>
    <div class="article-list">
        <!-- onRefresh:下拉刷新的时候会触发该回调 -->
        <van-pull-refresh v-model="loading" @refresh="onRefresh" :success-text="successText" success-duration="1000">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                error-text="请求失败，点击重新加载" :error.sync="error">
                <ArticleItem v-for="(article, index) in list" :key="index" :article="article"></ArticleItem>
                <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.title" /> -->
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article.item.vue'
/* [List 列表组件](https://youzan.github.io/vant/#/zh-CN/list):瀑布流滚动加载，用于展示长列表。

    List 组件通过 loading 和 finished 两个变量控制加载状态，
    当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
    若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

    - `load 事件`：
    - List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
    - 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
    - `loading 属性`：控制加载中的 loading 状态
    - 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
    - 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
    - `finished 属性`：控制加载结束的状态
    - 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
    - 所有数据加载结束，finished 为 true，此时不会触发 load 事件 */
export default {
    name: 'ArticleList',
    props: {
        channels: {
            type: Object,//类型必须为对象
            required: true//必填
        }
    },
    data() {
        return {
            list: [],//存储列表数据的数组
            loading: false,//控制加载中的状态-只有为false,才会触底后自动触发onload方法
            finished: false,//未加载全部(如果设置为true,底部就不会再次执行onload,代表全部加载完成 )
            timestamp: null,//请求获取下一页数据的时间戳
            error: false,//控制列表加载失败的提示状态
            loading: false,//控制下拉刷新加载的状态
            successText: ''
        }
    },
    methods: {
        async onLoad() {

            // 1.请求获取数据
            try {
                const { data: { data } } = await getArticles({
                    channel_id: this.channels.id,
                    timestamp: Date.now()
                })
                // console.log(data);
                //测试数据加载失败
                // if (Math.random() >= 0.6) {
                //     JSON.parse('sdsdsd')
                // }
                //2.把请求结果数据放到list数组中
                const { results } = data
                this.list.push(...results)
                // 3.加载状态结束
                this.loading = false
                // 4.判断数据是否全部加载完成
                if (results.length) {
                    //更新获取下一页数据的时间戳
                    this.timestamp = data.pre_timestamp
                } else {
                    //没有数据了,将finished设置为true,不再load加载更多了
                    this.finished = true
                }
            } catch (err) {
                //展示错误提示状态
                this.error = true

                //请求失败了,loading也需要失败
                this.loading = false
            }

        },
        /* onLoad() {
            // 1.请求获取数据
            // setTimeout 仅做示例，真实场景中一般为 ajax 请求
            setTimeout(() => {
                //2.把请求结果数据放到list数组中
                for (let i = 0; i < 10; i++) {
                    this.list.push(this.list.length + 1)
                }

                // 3.加载状态结束
                //loading关闭以后才能触发下一次的加载更多
                this.loading = false

                // 4.判断数据是否全部加载完成
                if (this.list.length >= 40) {
                    //如果没有数据了,把finished设置为true,之后不再触发加载更多,会提示'没有更多了'
                    this.finished = true
                }
            }, 1000)
        } */
        //当下拉刷新的时候会触发该回调函数
        async onRefresh() {
            try {
                //1.请求获取数据
                const { data: { data } } = await getArticles({
                    channel_id: this.channels.id,
                    timestamp: Date.now()//下拉刷新,每次请求获取最新数据
                })
                //测试数据加载失败
                // if (Math.random() >= 0.6) {
                //     JSON.parse('sdsdsd')
                // }
                //2.将数据追加到列表的顶部
                this.list.unshift(...data.results)
                //3.关闭下拉刷新的loading状态
                this.loading = false
                //更新下拉刷新成功提示的成本
                this.successText = `刷新成功,更新了${data.results.length}条数据`
            } catch (err) {
                this.loading = false
                this.successText = '刷新失败'
            }



        }
    },
    components: { ArticleItem }
}
</script>

<style lang="less" scoped>
.article-list {
    height: 91vh;
    overflow-y: auto;
}

.van-list {
    margin-top: 86px;
}
</style>