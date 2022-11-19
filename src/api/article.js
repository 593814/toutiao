import request from '@/utils/request'

//获取文章新闻推荐
export const getArticles = params => {
    return request({
        method: 'get',
        url: '/v1_0/articles',
        params
    })
}

export const getArticleById = articleId => {
    return request({
        method: 'get',
        //这里相当于自动toString了,字符串和其他类型拼接还是字符串
        url: `/v1_0/articles/${articleId}`
    })
}


//收藏文章
export const addCollect = target => {
    return request({
        method: 'POST',
        url: '/v1_0/article/collections',
        data: {
            target
        }
    })
}
//取消收藏文章
export const deleteCollect = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/collections/${target}`
    })
}

//点赞文章
export const addLick = target => {
    return request({
        method: 'POST',
        url: '/v1_0/article/likings',
        data: {
            target
        }
    })
}

//取消点赞文章
export const deleteLick = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/likings/${target}`,
    })
}