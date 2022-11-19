<template>
    <!-- 列表组件有一个特点:不在可视区域不会触发加载更多的,也就是滚动加载事件不会触发 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <CommentItem v-for="(item, index) in list" :key="index" :coment="item" @liking="item.is_liking = $event">
        </CommentItem>
    </van-list>

</template>

<script>
import { getCommentsparams } from '@/api/comment'
import CommentItem from './comment-Item.vue'
export default {
    name: 'ArticleComment',
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            offset: null,
            limit: 10
        }
    },
    created() {
        this.onLoad()
    },
    props: {
        source: {
            type: [Number, String, Object],
            require: true
        }
    },
    methods: {
        async onLoad() {
            try {
                //1.请求获取数据
                const { data } = await getCommentsparams({
                    type: 'a',//评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
                    source: this.source, //源id，文章id或评论id
                    offset: this.offset,//获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
                    limit: this.limit//获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
                })
                //2.将数据添加到列表中
                const { results } = data.data
                this.list.push(...results)
                //子传父,将评论数量传给父组件进行展示
                this.$emit('onload-success', data.data)
                //3.将loading设置为false
                this.loading = false
                //4.判断是否还有数据
                if (results.length) {
                    //   有就更新获取下一页的数据页码 
                    this.offset = data.data.last_id
                } else {
                    //   没有就将finished设置结束
                    this.finished = true
                }


            } catch {

            }



        }
    },
    components: {
        CommentItem
    }
}
</script>

<style lang="scss" scoped>

</style>