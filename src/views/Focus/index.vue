<template>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
</template>

<script>
import { getuserFocusList } from '@/api/user'
export default {
    name: 'Focus',
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            page: 1,
            per_page: 15
        }
    },
    created() {
        this.getfocus()
    },
    methods: {
        async getfocus() {
            try {
                const res = await getuserFocusList({
                    page: this.page,
                    per_page: this.per_page
                })
                console.log(res);
            } catch {
                this.$toast('获取数据失败!')
            }
        },
        onLoad() {

        }
    }
}
</script>

<style lang="scss" scoped>

</style>