<template>
    <div class="search-history">
        <van-cell title="搜索历史">
            <span>全部删除</span>
            <span>完成</span>
            <van-icon name="delete-o" />
        </van-cell>
        <van-cell :title="item" v-for="(item,index) in result" :key="index">
            <van-icon name="close" />
        </van-cell>
    </div>
</template>

<script>
export default {
    name: 'searchHistory',
    props: {
        result: {
            type: Array,
            reuqire: true
        }
    }
}
</script>

<style lang="scss" scoped>

</style>