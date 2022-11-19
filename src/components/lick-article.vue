<template>
    <van-icon :color="value === 1 ? '#ef7267' : ''" :name="value === 1 ? 'good-job' : 'good-job-o'" :loading="loading"
        @click="onCollect">
    </van-icon>
</template>

<script>
import { addLick, deleteLick } from '@/api/article'
export default {
    name: 'LickArticle',
    data() {
        return {
            loading: false
        }
    },
    props: {
        value: {
            type: Number,
            require: true
        },
        articleId: {
            type: [Number, String, Object],
            require: true
        }
    },
    methods: {
        async onCollect() {
            this.loading = true
            try {
                let status = -1
                if (this.value === 1) {
                    //已点赞,取消点赞
                    const res = await deleteLick(this.articleId)
                    console.log(res); 
                } else {
                    //未点赞,添加点赞
                    const res = await addLick(this.articleId)
                    status = 1
                    console.log(res);
                }
                this.$emit('input', status)
                this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
            } catch {
                this.$toast.fail('操作失败,请重试!')
            }
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>

</style>