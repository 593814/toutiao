<template>
    <div class="update-name">
        <!-- 导航栏 -->
        <!-- @click-left:注册给左侧箭头的点击事件 -->
        <van-nav-bar title="设置昵称" left-text="取消" right-text="完成" @click-left="$emit('close')"
            @click-right="onConfirm" />
        <!-- /导航栏 -->

        <!-- 输入框 -->
        <div class="field-wrap">
            <van-field v-model.trim="localName" rows="2" autosize type="textarea" maxlength="10" placeholder="请输入昵称"
                show-word-limit />
        </div>
        <!-- /输入框 -->
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
    name: 'UpdateName',
    data() {
        return {
            localName: this.value
        }
    },
    props: {
        value: {
            type: String,
            require: true
        }

    },
    /*  created() {
         this.localName = this.value
     } */

    methods: {
        async onConfirm() {
            //this.$toast.loading:不仅仅给用户视觉上的效果,当触发该效果时,用户就算一直点击完成也不会触发多次请求
            this.$toast.loading({
                message: '保存中...',
                forbidClick: true,//禁止背景点击
                duration: 0//持续展示(默认只展示两秒)
            })

            try {
                const localName = this.localName
                if (localName.length) {
                    await updateUserProfile({
                        name: localName
                    })
                    //更新视图
                    this.$emit('input', localName)
                    //关闭弹层
                    this.$emit('close')
                    //提示成功
                    this.$toast.success('更新成功')
                } else {
                    this.$toast('昵称不能为空')
                }
            } catch {
                this.$toast('获取数据失败')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.field-wrap {
    padding: 10px;
}

/deep/ .van-nav-bar__content {
    background-color: #fff;
}

/deep/ .van-nav-bar__title {
    color: black;
}
</style>