import {IconDefaultProps} from '../iconPark'
const svg64 = require('../svg64')

Component({
    props: {
        fill: '#333', // 填充色
        size: '16', // 图标尺寸大小，默认16px
        strokeWidth: '', // 描边宽度
        strokeLinecap: '', // 描边端点类型
        strokeLinejoin: '', // 描边连接线类型
        theme: '', // 默认主题
    },
    data: {
        base64Data: '',
        width: 16,
        height: 16,
    },
    methods: {
        getSvgContent () {
            const props = IconDefaultProps(this.props)
            this.setData({
                width: props.size || 16,
                height: props.size || 16
            })
            return '<?xml version="1.0" encoding="UTF-8"?>'
    + '<svg width="' + props.size + '" height="' + props.size + '" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<g>'
            + '<path fill-opacity=".01" fill="' + props.colors[2] + '" d="M0 0h48v48H0z"/>'
            + '<path stroke-linejoin="' + props.strokeLinejoin + '" stroke-width="' + props.strokeWidth + '" stroke="' + props.colors[0] + '" d="M14 25c0-5.523 4.477-10 10-10s10 4.477 10 10v16H14V25z" fill="none"/>'
            + '<path stroke-linejoin="' + props.strokeLinejoin + '" stroke-linecap="' + props.strokeLinecap + '" stroke-width="' + props.strokeWidth + '" stroke="' + props.colors[0] + '" d="M24 5v3m11.892 1.328-1.929 2.298m8.256 8.662-2.955.52m-33.483-.52 2.954.52m3.373-11.48 1.929 2.298M6 41h37" fill="none"/>'
        + '</g>'
    + '</svg>'
        },
        initIcon () {
            this.setData({base64Data: svg64(this.getSvgContent())})
        }
    },
    didMount() {
        this.initIcon()
    },
    didUpdate(prevProps) {
        if (JSON.stringify(this.props) === JSON.stringify(prevProps)) {
            return
        }
        this.initIcon()
    }
})
