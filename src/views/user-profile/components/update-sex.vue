<template>
    <div class="update-sex">
        <!-- 
            show-toolbar:是否显示顶部栏
            @cancel:取消按钮的事件
            @confirm:完成按钮的事件
         -->
        <van-picker title="标题" :columns="columns" show-toolbar @cancel="$emit('close')" @confirm="onConfirm"
            :default-index="value" @change="onPickerChange" />
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
    name: 'UpdateSex',
    props: {
        value: {
            type: Number,
            require: true
        }
    },
    data() {
        return {
            columns: ['男', '女'],
            loaclSex: this.value
        }
    },
    methods: {
        async onConfirm() {
            //this.$toast.loading:不仅仅给用户视觉上的效果,当触发该效果时,用户就算一直点击完成也不会触发多次请求
            this.$toast.loading({
                message: '保存中...',
                forbidClick: true,//禁止背景点击
                duration: 0//持续展示(默认只展示两秒)
            })

            try {
                const loaclSex = this.loaclSex

                await updateUserProfile({
                    gender: loaclSex
                })
                //更新视图
                this.$emit('input', loaclSex)
                //关闭弹层
                this.$emit('close')
                //提示成功
                this.$toast.success('更新成功')

            } catch {
                this.$toast('获取数据失败')
            }
        },
        onPickerChange(Picker, value, index) {
            // console.log(index);
            this.loaclSex = index
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__content {
    background-color: #fff;
}

/deep/ .van-nav-bar__title {
    color: black;
}
</style>