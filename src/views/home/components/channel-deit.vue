<template>
    <div class="channel-edit">
        <!-- 我的频道 -->
        <van-cell>
            <template #title>
                <div class="title-text">我的频道</div>
            </template>
            <!-- 默认插槽会插入到右边的位置 -->
            <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit = !isEdit">
                {{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10" :border="false" class="my-grid">
            <van-grid-item v-for="(item, index) in channels" :key="index" class="grid-item"
                @click="onMyChannelClick(item, index)">
                <!-- v-bind:class语法
                对象写法:对象中的key表示要作用的css类名
                对象中的value要计算出布尔值
                true:应用此类名
                false:不应用此类名 -->

                <!-- includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。 -->
                <!-- 第一次全部循环,isEdit集体为false,即全部都不显示x按钮 -->
                <!-- 当点击编辑,isEdit发生变化(变为true),data中的数据发生变化了,页面重新渲染 -->
                <!-- isEdit为true,推荐的id包含在fiexChannels中,故为true(取反为false)即不显示x按钮,往后面的id都不包含在fiexChannels中,即为true(false取反为true),即显示x按钮 -->
                <van-icon name="clear" slot="icon" v-show="isEdit && !fiexChannels.includes(item.id)"></van-icon>

                <span slot="text" class="text" :class="{ active: index === active }">
                    {{ item.name }}
                </span>
            </van-grid-item>
        </van-grid>
        <!-- /我的频道 -->

        <!-- 频道推荐 -->
        <van-cell>
            <template #title>
                <div class="title-text">频道推荐</div>
            </template>
        </van-cell>
        <van-grid :gutter="10" :border="false" class="recommend-grid">
            <van-grid-item v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name"
                class="grid-item" icon="plus" @click="onAddChannel(channel)" />
        </van-grid>
        <!-- /频道推荐 -->
    </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
    name: 'ChannelEdit',
    data() {
        return {
            allChannels: [],//接收所有频道列表数据
            isEdit: false,//控制编辑状态的显示
            fiexChannels: [0],//固定频道,不允许被删除
        }
    },
    props: {
        channels: {
            type: Array,
            requred: true
        },
        active: {
            type: Number,
            required: true
        }
    },
    created() {
        this.loadAllChannels()
    },
    methods: {
        async loadAllChannels() {
            const res = await getAllChannels()
            this.allChannels = res.data.data.channels
        },
        async onAddChannel(channel) {
            this.channels.push(channel)
            //增加数据持久化处理
            try {
                if (this.user) {
                    //已登录,把数据请求接口放到线上
                    await addUserChannel({
                        id: channel.id,
                        seq: this.channels.length
                    })
                } else {
                    //未登录:把数据存储到本地
                    setItem('TOTIAO_CHANNELS', this.channels)
                }
            } catch {
                this.$toast('更新失败')
            }


        },
        onMyChannelClick(item, index) {
            if (this.isEdit) {
                //1.如果是固定频道,则不删除
                if (this.fiexChannels.includes(item.id)) {
                    return
                }
                //2.删除频道项
                this.channels.splice(index, 1)
                //3.如果删除的是激活频道之前的频道,则更新激活的频道项
                if (index <= this.active) {
                    this.$emit('update-active', this.active - 1)
                }

                //删除数据持久化处理
                this.deleteChannel(item)
            } else {
                //非编辑状态,执行切换频道
                this.$emit('update-active', index, false)
            }
        },
        async deleteChannel(item) {
            try {
                if (this.user) {
                    //已登录,把数据请求接口放到线上
                    const res = await deleteUserChannel(item.id)
                    console.log(res);
                } else {
                    //未登录:把数据存储到本地
                    setItem('TOTIAO_CHANNELS', this.channels)
                }
            } catch {
                this.$toast('操作失败,请稍后重试')
            }

        }
    },
    //计算属性会观测内部依赖数据的变化
    //如果所依赖的数据发生变化,则计算属性会重新执行
    computed: {
        ...mapState(['user']),
        recommendChannels() {
            // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
            return this.allChannels.filter(channel => {
                // const channels = []

                // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
                return !this.channels.find(myChannel => {
                    return myChannel.id === channel.id
                })

                // return channels
            })
        }
        /* recommendChannels() {
         const channels = []
         this.allChannels.forEach(channel => {
               const ret = this.channels.find(mychannel => {
                   return channel.id === mychannel.id
               )
             if(!ret) {
                 channels.push(channel)
               
           )
           return channels
            
     } */
    }
}
</script>

<style lang="less" scoped>
.channel-edit {
    padding-top: 48px;

    .title-text {
        font-size: 18px;
        color: #333333;
        line-height: 31.8px;
    }

    .edit-btn {
        width: 60px;
        height: 30px;
        font-size: 16px;
        color: #f85959;
        border: 1px solid #f85959;
    }

    .grid-item {
        width: 160px;
        height: 40px;

        /deep/ .van-grid-item__content {
            background-color: #f4f5f6;
            white-space: nowrap;

            .van-grid-item__text,
            .text {
                font-size: 16px;
                color: #222;
                margin-top: 0;
            }

            .active {
                color: orange;
            }

            .van-grid-item__icon-wrapper {
                position: unset;
            }
        }
    }

    /deep/ .my-grid {

        .grid-item {
            .van-grid-item__content {
                padding: 0;

                .van-icon-clear {
                    font-size: 18px;
                    position: absolute;
                    right: 2px;
                    top: -5px;
                    color: #cacaca;
                    z-index: 2;
                }
            }
        }
    }

    /deep/ .recommend-grid {
        .grid-item {
            width: 2.26667rem;
            height: 1.06667rem;

            .van-grid-item__content {
                flex-direction: row;

                .van-grid-item__icon {
                    font-size: 16px;
                }

                .van-grid-item__text {
                    margin-top: 0;
                }
            }
        }
    }
}
</style>