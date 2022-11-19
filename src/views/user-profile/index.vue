<template>
    <div>
        <!-- 导航栏 -->
        <!-- @click-left:注册给左侧箭头的点击事件 -->
        <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />
        <!-- /导航栏 -->

        <!-- 个人信息 -->
        <!-- 当你选择同一个图片的时候,change事件不会触发 -->
        <input type="file" ref="file" hidden @change="onFileChange">
        <van-cell title="头像" is-link @click="$refs.file.click()">
            <van-image width="30" height="30" round fit="cover" :src="user.photo" />
        </van-cell>
        <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true" />
        <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateSexShow = true" />
        <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />
        <!-- /个人信息 -->

        <!-- 编辑昵称 -->
        <van-popup v-model="isUpdateNameShow" style="height:100%" position="bottom">
            <UpdateName @close="isUpdateNameShow = false" v-model="user.name" v-if="isUpdateNameShow"></UpdateName>
        </van-popup>
        <!-- /编辑昵称 -->

        <!-- 编辑性别 -->
        <van-popup v-model="isUpdateSexShow" position="bottom">
            <UpdateSex @close="isUpdateSexShow = false" v-model="user.gender" v-if="isUpdateSexShow"></UpdateSex>
        </van-popup>
        <!-- /编辑性别 -->

        <!-- 编辑生日 -->
        <van-popup v-model="isUpdateBirthdayShow" position="bottom">
            <UpdateBirthday @close="isUpdateBirthdayShow = false" v-model="user.birthday" v-if="isUpdateBirthdayShow">
            </UpdateBirthday>
        </van-popup>
        <!-- /编辑生日 -->

        <!-- 编辑头像 -->
        <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height:100%">
            <UpdatePhoto :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event"
                v-if="isUpdatePhotoShow"></UpdatePhoto>
        </van-popup>
        <!-- /编辑头像 -->

    </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateSex from './components/update-sex.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
    name: 'UserProfile',
    data() {
        return {
            user: {},//个人信息
            isUpdateNameShow: false,//控制姓名弹出层的显示与隐藏
            isUpdateSexShow: false,//控制年龄弹出层的显示与隐藏
            isUpdateBirthdayShow: false,//控制生日弹出层的显示与隐藏
            isUpdatePhotoShow: false,//控制图片弹出层的显示与隐藏
            img: null//预览的图片
        }
    },
    created() {
        this.loadUserProfile()
    },
    methods: {
        async loadUserProfile() {
            try {
                const res = await getUserProfile()
                // console.log(res);
                this.user = res.data.data
                console.log(this.user);
            } catch {
                this.$toast('数据获取失败')
            }
        },
        onFileChange() {
            //通过文件域的files属性获取FormDate文件
            //1.获取文件对象
            // console.log(this.$refs.file.files[0]);
            let files = this.$refs.file.files[0]
            // console.log(files);
            //2.基于文章对象获取blob数据
            const data = window.URL.createObjectURL(files);
            this.img = data
            // console.log(data); //blob:http://localhost:8080/fee922d2-b234-4ed3-beda-0aa06d68a80a
            //3.展示预览图片弹出层
            this.isUpdatePhotoShow = true
            // console.log(this.$refs.file.value);//C:\fakepath\WIN_20200330_08_15_47_Pro.jpg 
            //file-input如果选了同一个文件,不会触发change事件
            //解决方法:每次选择完毕,清空value即可
            this.$refs.file.value = ''

        }
    },
    components: {
        UpdateName,
        UpdateSex,
        UpdateBirthday,
        UpdatePhoto
    }
}
</script>

<style lang="less" scoped>
.van-popup {
    background-color: #f5f7f9;
}
</style>