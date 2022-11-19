<template>
    <div class="search-suggess">
        <van-cell icon="search" v-for="(item, index) in suggestions" :key="index" @click="$emit('search', item)">
            <!-- 绑定一个函数,处理字符item加高亮效果 -->
            <div slot="title" v-html="highlight(item)"></div>
        </van-cell>
    </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
//按需加载的好处:只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
    name: 'searchSuggess',
    data() {
        return {
            suggestions: []//联想建议数据列表
        }
    },
    props: {
        searchText: {
            type: String,
            require: true
        }
    },
    watch: {
        searchText: {
            //一定要开启,要不然第一次输入的内容监测不到
            //因为刚开始组件并没有渲染出来,当你输入第一个内容时,该组件才被渲染出来,此时监测才刚出来,故监测不到第一次内容
            immediate: true,//初始化时让handler立即执行
            /* handler(value) {
                this.loadSearchSuggesttions(value)
            } */
            //debounce 函数
            //参数1:一个函数
            //参数2:延迟时间,单位是毫秒
            //返回值:防抖之后的函数
            handler: debounce(function (value) {
                this.loadSearchSuggesttions(value)
            }, 1000)
        }
    },
    methods: {
        async loadSearchSuggesttions(q) {
            try {
                const { data: { data: { options } } } = await getSearchSuggestion(q)
                // console.log(options);
                this.suggestions = options
                // console.log(this.suggestions);
            } catch {
                this.$toast('数据获取失败,请稍后重试')
            }
        },
        highlight(item) {
            const highlighStr = `<span style="color:#3296fa">${this.searchText}</span>`

            //正则表达式://中间的内容都会当做匹配字符来使用,而不是数据变量
            //如果需要根据数据变量动态的创建正则表达式,则需要手动new RegExp
            //RegExp 正则表达式构造函数
            //参数一:匹配模式字符串,它会根据这个字符串创建正则对象(会将this.searchText的值解析出来,解析出来就是字符串,根据这个字符串创建正则对象)
            //参数二:匹配模式,要写到字符串中(g:匹配全部  i:不区分大小写)
            const reg = new RegExp(this.searchText, 'gi')
            return item.replace(reg, highlighStr)//replace不会替换原先的text,会生成新的字符串
        }
    },

}
</script>

<style lang="less" scoped>

</style>