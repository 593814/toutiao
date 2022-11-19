import request from '@/utils/request'
// import store from '@/store'

export const login = data => {
    return request({
        method: 'post',
        url: '/v1_0/authorizations',
        data
    })
}

//发送验证按
//注意:每个手机号每分钟一次(接口限制)
export const sendSms = mobile => {
    return request({
        method: 'get',
        url: `/v1_0/sms/codes/${mobile}`
    })
}

//获取用户自己的信息
export const getuserInfo = () => {
    return request({
        method: 'get',
        url: '/v1_0/user'
        //发送请求头数据(后端要求的)
        /*  headers: {
             //特别注意:该接口需要令牌才能访问
             //token的数据格式:Bearer token数据格式,注意:Bearer后面有个空格
             Authorization: `Bearer ${store.state.user.token}`
         } */

    })
}

//获取用户频道列表
export const getUserChannels = () => {
    return request({
        method: 'get',
        url: '/v1_0/user/channels'
    })
}

//关注用户
export const addFollow = target => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target
        }
    })
}

//取消关注用户
export const deleteFollow = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`,
    })
}

//获取当前登录用户的个人信息
export const getUserProfile = () => {
    return request({
        method: 'get',
        url: '/v1_0/user/profile'
    })
}

//更新用户信息
export const updateUserProfile = data => {
    return request({
        method: 'patch',
        url: '/v1_0/user/profile',
        data
    })
}

//更新用户照片资料
export const updateUserPhoto = data => {
    return request({
        method: 'patch',
        url: '/v1_0/user/photo',
        data
    })
}

//获取用户关注列表
export const getuserFocusList = params => {
    return request({
        method: 'get',
        url: '/v1_0/user/followings',
        params
    })
}