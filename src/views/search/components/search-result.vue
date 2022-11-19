<template>
    <div class="search-result">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" error-text="请求失败，点击重新加载"
            :error.sync="error">
            <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
        </van-list>
    </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
    name: 'searchResult',
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            page: 1,//页数
            per_page: 20,//每页数量
            error: false
        }
    },
    props: {
        searchText: {
            type: String,
            require: true
        },
        history: {
            type: String,
            require: true
        }
    },
    methods: {
        async onLoad() {
            try {
                //1.请求获取数据
                const { data } = await getSearchResult({
                    page: this.page,
                    per_page: this.per_page,
                    q: this.searchText
                })
                const { results } = data.data
                //2.将数据添加到数组列表中
                this.list.push(...results)
                //3.将本次加载中的loading关闭
                this.loading = false
                //4.判断是否还有数据
                if (results.length) {
                    //  如果有,则更新获取下一个数据的页码
                    this.page++
                } else {
                    this.finished = true
                    //  如果没有,则将加载状态finished设置为结束
                }
            } catch {
                this.error = true//展示加载失败的提示状态
                this.loading = false//关闭加载状态
            }


        }
    }
}
</script>

<style lang="less" scoped>

</style>