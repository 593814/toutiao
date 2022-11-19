// 封装本地存储操作模块

// 存储数据
export const setItem = (key, value) => {
    //将数组,对象类型的数据转换为JSON格式字符串进行存储
    //typeof:判断数据类型
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}

// 获取数据
export const getItem = key => {
    const data = window.localStorage.getItem(key)
    //如果是一个JSON格式的字符串,执行try,否则报错,执行catch
    try {
        return JSON.parse(data)
    }
    //如果不是JSON格式的字符串,执行catch
    catch {
        return data
    }
}

//删除数据
export const removeItem = key => {
    window.removeItem(key)
}