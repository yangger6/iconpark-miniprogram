import {taroCompiler} from '@iconpark-miniprogram-sht/core'

taroCompiler()
    .then(() => {
        console.log('编译完成')
    })
    .catch(e => {
        console.error('编译出错: \t', e)
    })
