<template>
    <van-button round size="small" v-if="isFollowed" @click="onFollow" :loading="Loading">
        已关注
    </van-button>
    <van-button type="info" color="#3296fa" round size="small" icon="plus" v-else @click="onFollow" :loading="Loading">
        关注
    </van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
    name: 'Followuser',
    methods: {
        async onFollow() {
            //当一点击关注就触发
            //开启关注按钮的loadig状态
            this.Loading = true
            try {
                if (this.isFollowed) {
                    //已关注,取消关注
                    await deleteFollow(this.userId)
                    //更新视图状态
                    //注意:这个不能直接改,porps传过来的属性不能直接改
                    // this.article.is_followed = false

                } else {
                    //没有关注,添加关注
                    await addFollow(this.userId)
                    //更新视图状态
                    // this.article.is_followed = true
                }
                // this.$emit('update-is_followed', !this.value)
                // this.$emit('input', !this.value)
                this.$emit('update-is_followed', !this.isFollowed)
            } catch (err) {
                let message = '操作失败,请重试'
                if (err.response && err.response.status === 400) {
                    message = '你不能关注你自己'
                }
                this.$toast(message)
            }
            //关闭关注按钮的loadig状态
            this.Loading = false
        }
    },
    //可以通过model修改父组件通过v-model 传过来的props数据和自定义事件(通俗来说:自定义v-model的数据名称)
    model: {
        prop: 'isFollowed',  //默认是value
        event: 'update-is_followed' //默认是input
    },
    props: {
        /* isFollowed: {
            type: Boolean,
            require: true
        } */
        isFollowed: {
            type: Boolean,
            require: true
        },
        userId: {
            type: [Number, String, Object],//Object是防止大数字
            require: true
        }
    },
    data() {
        return {
            Loading: false
        }
    }
}
</script>

<style lang="less" scoped>

</style>