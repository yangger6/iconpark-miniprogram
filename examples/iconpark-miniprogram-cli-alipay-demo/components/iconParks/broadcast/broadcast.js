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
            + '<path stroke-linejoin="' + props.strokeLinejoin + '" stroke-width="' + props.strokeWidth + '" stroke="' + props.colors[0] + '" d="M24 28.63a4.538 4.538 0 0 0 4.546-4.532A4.538 4.538 0 0 0 24 19.567a4.538 4.538 0 0 0-4.545 4.53 4.538 4.538 0 0 0 4.546 4.532z" fill="none"/>'
            + '<path stroke-linejoin="' + props.strokeLinejoin + '" stroke-linecap="' + props.strokeLinecap + '" stroke-width="' + props.strokeWidth + '" stroke="' + props.colors[0] + '" d="M16 15c-5.333 4.97-5.333 13.03 0 18m16 0c5.333-4.97 5.333-13.03 0-18m-22-5c-8 7.732-8 20.268 0 28m28.143.196c7.81-7.786 7.81-20.41 0-28.196" fill="none"/>'
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
