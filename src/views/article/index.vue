<template>
    <div class="article-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="$router.back()"></van-nav-bar>
        <!-- /导航栏 -->

        <div class="main-wrap">
            <!-- 加载中 -->
            <div class="loading-wrap" v-if="loading">
                <van-loading color="#3296fa" vertical>加载中</van-loading>
            </div>
            <!-- /加载中 -->

            <!-- 加载完成-文章详情 -->
            <div class="article-detail" v-else-if="article.title">
                <!-- 文章标题 -->
                <h1 class="article-title">{{ article.title }}</h1>
                <!-- /文章标题 -->

                <!-- 用户信息 -->
                <van-cell class="user-info" center :border="false">
                    <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
                    <div slot="title" class="user-name">{{ article.aut_name }}</div>
                    <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>

                    <!-- 加一个loading效果,为了防止当用户点击关注的时候,会反应慢,然后用户不知道怎么回事,然后一直点,这就造成一直发送请求,然后关注按钮延迟连续跳转
                    加上loading效果后,不仅仅是给用户视觉上的感知,在loading效果中,即使用户一直点,也不会触发一直发送请求
                    -->
                    <!-- 2.封装为组件的写法 -->
                    <!-- 模板中获取子组件通过$emit传过来的参数,通过$event获取 -->
                    <!-- <Followuser :isFollowed="article.is_followed" class="follow-btn" :user-id="article.art_id"
                        @update-is_followed="article.is_followed = $event">
                    </Followuser> -->


                    <!-- 3.封装为组件的简写写法 -->
                    <!-- 通过v-model解决子组件的数据既要使用还要修改(要不然既要通过props传数据,还要通过$emit修改数据) -->
                    <Followuser v-model="article.is_followed" class="follow-btn" :user-id="article.art_id">
                        <!-- 模板中获取子组件通过$emit传过来的参数,通过$event获取 -->
                    </Followuser>
                    <!-- 当我们传递给予子组件的数据既要使用还要修改.
                    传递:props
                    :isFollowed="article.is_followed"
                    修改:自定义事件
                    @update-is_followed="article.is_followed = $event"
                    简写方式:在组件上使用v-model
                    value="article.is_followed"
                    @input="article.is_followed=$event" 
                
                如果需要v-model的规则名称,可以通过子组件的model属性来配置修改
                注意:一个组件只能使用一个v-model
                如果有多个数据需要实现类似以v-model的效果,怎么办?
                可以使用属性的  .sync修饰符
                -->


                    <!-- 1.最原始写法 -->
                    <!-- <van-button class="follow-btn" round size="small" v-if="article.is_followed" @click="onFollow"
                        :loading="followLoading">已关注
                    </van-button>
                    <van-button class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" v-else
                        @click="onFollow" :loading="followLoading">关注
                    </van-button> -->

                </van-cell>
                <!-- /用户信息 -->

                <!-- 文章内容 -->
                <div ref="article-content" class="article-content markdown-body " v-html="article.content"></div>
                <van-divider>正文结束</van-divider>
                <!-- 评论区域 -->
                <ArticleComment ref="ArticleComment" :source="article.art_id"
                    @onload-success="totalCommentCount = $event.total_count">
                </ArticleComment>
                <!-- /评论区域 -->
                <!-- 底部区域 -->
                <!-- 发布评论 -->
                <van-popup v-model="isPostShow" closeable position="bottom">
                    <CommentPost :target="article.art_id" @post-success="onPostSuccess">
                    </CommentPost>
                </van-popup>
                <!-- /发布评论 -->
                <!-- 只有当数据请求成功后再把页面渲染出来 -->
                <!-- 因为如果写在最后面的话,会造成页面还未渲染出来(因为只有当数据请求成功v-else-if才会为true),此时article.is_collected是undefined,这时候在CollectArticle组建中渲染的时候会报错 -->
                <!-- CollectArticle设定的数据类型是Bollean,undefined并不是,故报错 -->

                <!-- 写在数据请求成功之后即可解决问题,因为此时可以拿Bollean到数据,子组件即可渲染 -->
                <div class="article-bottom">
                    <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论
                    </van-button>
                    <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
                    <!-- 收藏图标 -->
                    <!-- <van-icon color="#777" name="star-o" /> -->
                    <CollectArticle v-model="article.is_collected" :article-id="article.art_id">
                    </CollectArticle>
                    <!-- 点赞图标 -->
                    <!-- <van-icon color="#777" name="good-job-o" /> -->
                    <LickArticle v-model="article.attitude" :article-id="article.art_id"></LickArticle>
                    <van-icon name="share" color="#777777"></van-icon>
                </div>
                <!-- /底部区域 -->
            </div>
            <!-- /加载完成-文章详情 -->

            <!-- 加载失败：404 -->
            <div class="error-wrap" v-else-if="errStatus === 404">
                <van-icon name="failure" />
                <p class="text">该资源不存在或已删除！</p>
            </div>
            <!-- /加载失败：404 -->

            <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
            <div class="error-wrap" v-else>
                <van-icon name="failure" />
                <p class="text">内容加载失败！</p>
                <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
            </div>
            <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
        </div>


    </div>
</template>

<script>
//ImagePreview需要单独引入
import { ImagePreview } from 'vant';
import { getArticleById } from '@/api/article'
import Followuser from '@/components/follow-user.vue'
import CollectArticle from '@/components/collect-article.vue'
import LickArticle from '@/components/lick-article.vue'
import ArticleComment from './components/article-comment.vue'
import CommentPost from './components/comment-post.vue'

/* ImagePreview({
    images: [
        'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
        'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    ],
    //起始位置,从0开始
    startPosition: 1,
    //onClose关闭图片预览的时候会触发
    onClose() {
        Toast('关闭');
    },
}); */
export default {
    name: 'ArticleIndex',
    components: { Followuser, CollectArticle, LickArticle, ArticleComment, CommentPost },
    props: {
        articleId: {
            type: [Number, String, Object],
            required: true
        }
    },
    data() {
        return {
            article: {},//文章详细
            loading: true,//加载中的loading状态
            errStatus: 0,//失败的状态码
            followLoading: false,//控制关注loading的状态
            totalCommentCount: 0,//评论总数
            isPostShow: false//控制发布评论的显示状态
        }
    },
    created() {
        this.loadArticle()
    },
    mounted() { },
    methods: {
        async loadArticle() {
            this.loading = true
            try {
                const { data } = await getArticleById(this.articleId)
                // 测试点击重试
                /* if (Math.random() > 0.5) {
                    JSON.parse('sddsd')
                } */

                //数据驱动视图不是立即执行的
                this.article = data.data
                // console.log(this.article);
                //请求成功,关闭loading
                this.loading = false

                //请求成功过后拿到文章内容的ref(article-content)
                //因为文章内容是条件渲染的v-else-if,我们给的条件是在请求数据成功的情况下才会渲染,生成真实DOM
                //以下直接拿取是得不到的,此时文章内容还没开始渲染,因为数据驱动视图不是立即执行的
                // console.log(this.$refs['article-content']);
                //解决
                /* this.$nextTick(function () {
                    console.log(this.$refs['article-content']);
                }) */

                /* this.$nextTick(function () {
                    this.previewImage()
                }) */
                setTimeout(() => {
                    this.previewImage()
                }, 0);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    this.errStatus = 404
                }
                // console.log('获取数据失败', err);
                //请求失败,关闭loading
                this.loading = false
            }
        },
        previewImage() {
            const articleContent = this.$refs['article-content']
            const imgs = articleContent.querySelectorAll('img')
            //获取所有img地址
            const images = []

            imgs.forEach((item, index) => {
                //将地址追加给images
                images.push(item.src)
                //给每个img注册点击事件,在处理函数中调用预览
                item.onclick = () => {
                    ImagePreview({
                        //预览图片的地址数组
                        images,
                        //起始位置,从0开始
                        startPosition: index
                    });
                }
            })
        },
        onPostSuccess(data) {
            //关闭弹出层
            this.isPostShow = false
            //将发布内容显示到列表顶部
            // console.log(this.$refs.ArticleComment);
            this.$refs.ArticleComment.list.unshift(data.new_obj)
        }
    }
}
</script>

<style scoped lang="less">
//将github-markdown.css样式文件加载进来 
@import './github-markdown';

.article-container {
    .main-wrap {
        position: fixed;
        left: 0;
        right: 0;
        top: 50px;
        bottom: 40px;
        overflow-y: scroll;
        background-color: #fff;
    }

    .article-detail {
        .article-title {
            font-size: 23px;
            padding: 30px 32px;
            margin: 0;
            color: #3a3a3a;
        }

        .user-info {
            padding: 0 32px;

            .avatar {
                width: 40px;
                height: 40px;
                margin-right: 17px;
            }

            .van-cell__label {
                margin-top: 0;
            }

            .user-name {
                font-size: 15px;
                color: #3a3a3a;
            }

            .publish-date {
                font-size: 12px;
                color: #b7b7b7;
            }

            .follow-btn {
                width: 100px;
                height: 40px;
            }
        }

        .article-content {
            padding: 35px 20px;

            /deep/ p {
                text-align: justify;
                font-size: 15px;
            }
        }
    }

    .loading-wrap {
        padding: 50px 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }

    .error-wrap {
        padding: 60px 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;

        .van-icon {
            font-size: 70px;
            color: #b4b4b4;
        }

        .text {
            font-size: 18px;
            color: #666666;
            margin: 25px 0 45px;
        }

        .retry-btn {
            width: 160px;
            height: 45px;
            line-height: 70px;
            border: 1px solid #c3c3c3;
            font-size: 18px;
            color: #666666;
        }
    }

    .article-bottom {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        height: 45px;
        border-top: 1px solid #d8d8d8;
        background-color: #fff;

        .comment-btn {
            width: 120px;
            height: 32px;
            border: 2px solid #eeeeee;
            font-size: 15px;
            line-height: 46px;
            color: #a7a7a7;
        }

        .van-icon {
            font-size: 25px;

            .van-info {
                font-size: 16px;
                background-color: #e22829;
            }
        }
    }
}
</style>
