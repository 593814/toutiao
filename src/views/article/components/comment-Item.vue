<template>
    <van-cell class="comment-item">
        <van-image slot="icon" class="avatar" round fit="cover" :src="coment.aut_photo" />
        <div slot="title" class="title-wrap">
            <div class="user-name">{{ coment.aut_name }}</div>
            <van-button class="like-btn" :icon="coment.is_liking ? 'good-job' : 'good-job-o'"
                :class="{ liked: coment.is_liking }" @click="onCommentLike" :loading="loading">{{
                        coment.like_count || '赞'
                }}
            </van-button>
        </div>

        <div slot="label">
            <p class="comment-content">{{ coment.content }}</p>
            <div class="bottom-info">
                <span class="comment-pubdate">{{ coment.pubdate | relativeTime }}</span>
                <van-button class="reply-btn" round>回复 {{ coment.reply_count }}</van-button>
            </div>
        </div>
    </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
    name: 'CommentItem',
    components: {},
    props: {
        coment: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async onCommentLike() {
            console.log(this.coment);
            this.loading = true
            try {
                if (this.coment.is_liking) {
                    //已点赞,取消点赞
                    await deleteCommentLike(this.coment.com_id)
                    //取消点赞,数量减一
                    this.coment.like_count--
                } else {
                    //未点赞.添加点赞
                    await addCommentLike(this.coment.com_id)
                    //添加点赞,数量加一
                    this.coment.like_count++
                }
                // this.coment.is_liking = !this.coment.is_liking
                this.$emit('liking', !this.coment.is_liking)

            } catch {
                this.$toast('加载失败,请重试!')
            }
            this.loading = false
        }
    }
}
</script>

<style scoped lang="less">
.comment-item {
    .avatar {
        width: 40px;
        height: 40px;
        margin-right: 25px;
    }

    .title-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .user-name {
            color: #406599;
            font-size: 16px;
        }
    }

    .comment-content {
        font-size: 20px;
        color: #222222;
        word-break: break-all;
        text-align: justify;
    }

    .comment-pubdate {
        font-size: 14px;
        color: #222;
        margin-right: 25px;
    }

    .bottom-info {
        display: flex;
        align-items: center;
    }

    .reply-btn {
        width: 80px;
        height: 24px;
        line-height: 48px;
        font-size: 14px;
        color: #222;
    }

    .like-btn {
        height: 30px;
        padding: 0;
        border: none;
        font-size: 14px;
        line-height: 30px;
        margin-right: 7px;

        .van-icon {
            font-size: 15px;
        }

        &.liked {
            color: #e5645f;
        }
    }
}
</style>