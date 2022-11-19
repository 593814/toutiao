<template>
    <!-- star:填充    star-o:空心(不填充) -->
    <van-icon :color="value ? '#ffa500' : ''" :name="value ? 'star' : 'star-o'" @click="onCollect" :loading="loading">
    </van-icon>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
    name: 'CollectArticle',
    data() {
        return {
            loading: false
        }
    },
    props: {
        value: {
            type: Boolean,
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
                if (this.value) {
                    //已收藏,取消收藏
                    const res = await deleteCollect(this.articleId)
                    console.log(res);
                } else {
                    //未收藏,添加收藏
                    const res = await addCollect(this.articleId)
                    console.log(res);
                }
                this.$emit('input', !this.value)//更新的数据不是立即改变的
                this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
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