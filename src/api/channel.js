
import request from '@/utils/request'

//获取所有频道列表
export const getAllChannels = () => {
    return request({
        method: 'get',
        url: '/v1_0/channels'
    })
}

//添加用户频道
export const addUserChannel = channel => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data: {
            channels: [
                channel
            ]
        }
    })
}
//刹车农户用户指定频道
export const deleteUserChannel = (target) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/channels/${target}`
    })
}

