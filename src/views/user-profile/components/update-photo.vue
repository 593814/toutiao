<template>
    <!-- cropperjs:使用这个库,1.图片外面必须包一个块级元素,2.图片必须填充整个元素 max-width:100% -->
    <div class="update-photo">
        <img :src="img" alt="" class="img" ref="img">
        <div class="toolbar">
            <div class="cancel" @click="$emit('close')">取消</div>
            <div class="confirm" @click="onConfirm">完成</div>
        </div>
    </div>

</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
export default {
    name: 'UpdatePhoto',
    props: {
        img: {
            type: [String, Object],
            require: true
        }
    },
    data() {
        return {
            cropper: null
        }
    },
    mounted() {
        const image = this.$refs.img;
        this.cropper = new Cropper(image, {
            //以下为cropperjs库的option(配置项)
            viewMode: 1,//默认是0,0的话选择框可以超出画布,随意裁剪,1的话只能在画布范围内裁剪
            dragMode: 'move',//设置裁截器的拖动模式,默认就是crop
            aspectRatio: 1,//截图的比例:默认是16:9,头像的比例一般是1:1
            autoCropArea: 1,//自动截取的区域,自动会撑满整个画布的大小
            cropBoxMovable: false,//false的话裁剪器设置为不能移动,图片移动,true的话裁剪器动,图片不动
            cropBoxResizable: false,//不让截图器缩放
            background: false,//true会显示默认背景色,false取消
            movable: true//画布是否可以移动,设置为false就不能拖动了,默认是true
        })
        // console.log(cropper);
    },
    methods: {
        onConfirm() {
            // 得用到cropper,因为是通过它调用方法的
            //基于服务端的裁剪:通过cropper身上的getData方法获取裁切参数,将这些数据传给服务端,服务端会对这些参数进行裁剪
            // console.log(this.cropper.getData());//x,y:从哪里开始裁剪  width,height:裁截的宽高是多少

            //基于纯客户端的裁剪:通过cropper身上的getCroppedCanvas方法获取裁切的文件对象
            this.cropper.getCroppedCanvas().toBlob(async (blob) => {
                this.$toast.loading({
                    message: '保存中...',
                    forbidClick: true,//禁止背景点击
                    duration: 0//持续展示(默认只展示两秒)
                })
                try {
                    // console.log(blob); { size: 770931,type: "image/png"}
                    //错误的用法
                    //如果接口要求是Content-Type  application/json
                    //则传递普通的js对象
                    /*  updateUserPhoto({
                         photo:blob
                     }) */
                    //如果接口要求Content-Type 是 multipart/form-data
                    //则你必须传递FormData对象
                    const fd = new FormData()
                    //第一个参数:数据名称,要跟数据接口提供的名字一样
                    fd.append('photo', blob)
                    const { data } = await updateUserPhoto(fd)
                    // console.log(data);//会返回更新过后的头像
                    //关闭弹出层
                    this.$emit('close')
                    //更新视图
                    this.$emit('update-photo', data.data.photo)
                    this.$toast.success('更新成功')
                } catch {
                    this.$toast.fail('更新失败')
                }
            })
        }
    }
}

// 如果是基于服务端的裁切，则使用：[getData](https://github.com/fengyuanchen/cropperjs#getdatarounded) 方法，该方法得到裁切的区域参数。 优点:兼容性好 缺点:前后端配合
// 如果是纯客户端的图片裁切，则使用：[getCroppedCanvas](https://github.com/fengyuanchen/cropperjs#getcroppedcanvasoptions) 方法，该方法得到裁切之后的图片对象（类似于URL.createObjectURL 方法得到的文件对象）。坏处:兼容不太好  好处:不用后端   该方法可以在移动端用用,不要在pc端使用(oc端使用上面那种方法)
</script>

<style lang="less" scoped>
.update-photo {
    height: 100%;
    background-color: #000;

    .toolbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;

        .cancel,
        .confirm {
            width: 45px;
            height: 55px;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
    }
}

.img {
    display: block;
    max-width: 100%;
}
</style>