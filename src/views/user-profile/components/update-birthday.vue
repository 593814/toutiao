<template>
    <div class="updateBirthday">
        <!-- 
            currentDate:双向绑定了日期选择器
            设置日期选择器的默认值
            同步日期选择器选择的日期
            :min-date：可选的最小日期
            :max-date:可选的最大日期
         -->
        <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
            @cancel="$emit('close')" @confirm="onConfirm" />
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
    name: 'UpdateBirthday',
    props: {
        value: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            minDate: new Date(1970, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(this.value),//将this.value字符串转换为日期对象
            loaclBirthday: this.value
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
                const currentDate = dayjs(this.currentDate).format('YYYY - MM - DD')
                await updateUserProfile({
                    birthday: currentDate
                })
                //更新视图
                this.$emit('input', currentDate)
                //关闭弹层
                this.$emit('close')
                //提示成功
                this.$toast.success('更新成功')
            } catch {
                this.$toast('获取数据失败')
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>