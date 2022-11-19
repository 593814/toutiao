<template>
    <div>
        <div class="login-container">
            <!-- 导航栏 -->
            <van-nav-bar title="登录">
                <van-icon name="cross" slot="left" @click="$router.back()" />
            </van-nav-bar>
            <!-- /导航栏 -->

            <!-- form表单 -->
            <!-- 
                表单验证:
                1.给van-filed组件配置rules验证规则(当失去焦点的时候会触发,当点击提交按钮时触发)
                参考文档:https://vant-contrib.gitee.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
                2.当表单提交的时候会自动触发表单验证
                如果验证通过,会触发submit事件
                如果验证失败,不会触发submit事件
                number:只能输入数字类型
                maxlength:最大长度
                记住type=number不是vant组件库的功能,因为van-field是对input的二次封装,所以是在设置input的type类型
                html5规定当type值为number:只能输入数字
             -->
            <van-form @submit="onSubmit" ref="loginForm">
                <van-cell-group inset>
                    <!-- 1.手机表单 -->
                    <van-field name="mobile" placeholder="请输入手机号" v-model="user.mobile" :rules="userFormRules.mobile"
                        type="number" maxlength="11">
                        <i slot="left-icon" class="iconfont icon-shouji"></i>
                    </van-field>
                    <!-- 2.验证码表单 -->
                    <van-field name="code" placeholder="请输入验证码" v-model="user.code" :rules="userFormRules.code"
                        type="number" maxlength="6">
                        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
                        <!-- 3发送验证码按钮 -->
                        <template #button>
                            <!-- 
                                倒计时效果
                                time:设置倒计时时间  1000*10:1-10每个数字一秒
                                format:自定义格式  ss代表显示秒  s是自己写的字符串(比如 ss:06s  s就是06后面的s)
                                finish:倒计时结束时触发
                             -->

                            <van-count-down :time="1000 * 10" format="ss s" v-if="isCountDownShow"
                                @finish="isCountDownShow = false" />
                            <!-- 
                                native-type="button"
                            在表单中,除了提交按钮外,可能还有一些其他的功能性按钮,如发送验证码按钮.在使用这些按钮时,要注意将native-type设置为button,否则会触发表单提交
                            这个问题的原因是浏览器中button标签type属性的默认值为submit,导致触发表单提交
                            -->
                            <van-button size="small" type="default" round class="send-sms-btn" @click="onSendSms"
                                native-type="button" v-else>发送验证码
                            </van-button>
                        </template>
                    </van-field>
                </van-cell-group>
                <!-- 4.登录按钮 -->
                <div class="login-btn-wrap">
                    <van-button block type="primary" native-type="submit" class="login-btn">
                        登录
                    </van-button>
                </div>
            </van-form>
            <!-- /form表单 -->
        </div>

    </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
    name: 'LoginPage',
    data() {
        return {
            user: {
                mobile: '',//手机号
                code: ''//验证码
            },
            userFormRules: {
                //校验过程:从上到下依次校验,如果其中有一个校验失败,那么下面的就不执行了
                mobile: [
                    { required: true, message: '手机号不能为空' },
                    //使用pattern验证手机号格式
                    { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
                ],
                code: [
                    { required: true, message: '验证码不能为空' },
                    //使用pattern验证验证码格式
                    { pattern: /^\d{6}$/, message: '验证码格式错误' }
                ]
            },
            isCountDownShow: false//是否展示倒计时效果

        }
    },
    methods: {
        //1.提交表单按钮表单验证
        async onSubmit() {
            //1.获取表单数据
            const user = this.user
            //2.验证表单
            //在组件中必须通过this.$toast来调用Toast组件
            this.$toast.loading({
                message: '登录中...',
                forbidClick: true,//禁用背景点击
                duration: 0//持续时间,默认是2000,如果为0,则持续展示(因为请求时间是不确定的,需要指定时间)
            })
            //3.提交表单请求登录
            try {
                const res = await login(user)
                //将token存入vuex中的state中
                this.$store.commit('setUser', res.data.data)
                //为什么上面一直在持续,而到这里却停了呢
                //因为新的$toast被调用,那么会覆盖旧的(旧的所有功能关闭)
                this.$toast.success('登录成功')
                //登录成功,跳转回原来的页面
                this.$router.back()
            } catch (err) {
                if (err.response.status === 400) {
                    this.$toast.fail('手机号或验证码错误')
                } else {
                    this.$toast.fail('登陆失败,请稍后重试')
                }
            }

            //4.根据请求响应结果处理后续操作
        },
        //2.发送验证码按钮表单验证
        async onSendSms() {
            //1.校验手机号
            //validate:验证表单，支持传入一个或多个 name 来验证单个或部分表单项，不传入 name 时，会验证所有表单项
            //特别注意:validate会返回一个promise,需要用async和await

            try {
                await this.$refs.loginForm.validate('mobile')

            } catch (err) {
                return console.log('验证失败', err)
            }
            // 上方校验成功才会执行以下代码,校验失败直接return出去了
            //2.验证通过,显示倒计时
            this.isCountDownShow = true
            //3.请求发送验证码
            try {
                await sendSms(this.user.mobile)
                this.$toast('发送成功')
            } catch (err) {
                //失败一定要停止定时器,要不然依旧在走(发送失败,关闭定时器)
                this.isCountDownShow = false
                if (err.response.status === 429) {
                    this.$toast('发送太频繁了,请稍后重试')
                } else {
                    this.$toast('发送失败,请稍后重试')
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
    .icon-shouji {
        font-size: 20px;
    }

    .send-sms-btn {
        background-color: #ededed;
        width: 80px;
        height: 22px;
        line-height: 46px;
        font-size: 11px;
        color: #666;
    }

    .login-btn-wrap {
        padding: 23px 18px;

        .login-btn {
            background-color: #6db4fb;
            border: none
        }
    }
}
</style>