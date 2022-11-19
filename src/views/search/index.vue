<template>
    <div class="search-container">
        <!-- 搜索栏 -->
        <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
        <!-- show-action:显示取消按钮,默认显示false-->
        <!-- 当点击取消按钮会触发cancel事件 -->
        <!-- 当提交搜索了会触发seach事件(电脑回车提交) -->
        <form action="/" class="search-form">
            <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel"
                background="#3296fa" @focus="isResultShow = false" />
        </form>
        <!-- /搜索栏 -->

        <!-- 注意:只要其中一个判定成功为true,下面就不执行了 -->
        <!-- 搜索结果 -->

        <!-- /搜索结果 -->
        <searchResult v-if="isResultShow" :searchText="searchText"></searchResult>

        <!-- 联想建议 -->
        <searchSuggess v-else-if="searchText" :search-text="searchText" @search="onSearch"></searchSuggess>
        <!-- /联想建议 -->

        <!-- 搜索历史记录 -->
        <searchHistory v-else :result="result"></searchHistory>
        <!-- /搜索历史记录 -->




    </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import searchResult from './components/search-result.vue'
import searchSuggess from './components/search-suggess.vue'
export default {
    name: 'Search',
    data() {
        return {
            searchText: '',
            isResultShow: false,//控制搜索结果的展示
            result: [],
        }
    },
    methods: {
        onSearch(val) {
            // val是文本框输入的内容
            // console.log(val);
            this.searchText = val
            if (this.result.includes(val) === false) {
                this.result.unshift(val)
            }

            this.isResultShow = true
        },
        onCancel() {
            this.$router.back()
        }
    },
    components: {
        searchHistory,
        searchResult,
        searchSuggess
    }
}
</script>

<style lang="less" scoped>
.search-container {
    padding-top: 54px;

    .search-form {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }

    .van-search__action {
        color: #fff;
    }
}
</style>