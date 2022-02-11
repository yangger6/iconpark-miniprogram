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
            + '<path d="M0 0h48v48H0z" fill="' + props.colors[2] + '" fill-opacity=".01"/>'
            + '<circle cx="24" cy="24" r="20" stroke="' + props.colors[0] + '" stroke-width="' + props.strokeWidth + '" stroke-linecap="' + props.strokeLinecap + '" stroke-linejoin="' + props.strokeLinejoin + '" fill="none"/>'
            + '<path clip-rule="evenodd" d="M24 37v7-7z" fill="none"/>'
            + '<path d="M24 37v7" stroke="' + props.colors[0] + '" stroke-width="' + props.strokeWidth + '" stroke-linecap="' + props.strokeLinecap + '" stroke-linejoin="' + props.strokeLinejoin + '" fill="none"/>'
            + '<path clip-rule="evenodd" d="M36 24h8-8z" fill="none"/>'
            + '<path d="M36 24h8" stroke="' + props.colors[0] + '" stroke-width="' + props.strokeWidth + '" stroke-linecap="' + props.strokeLinecap + '" stroke-linejoin="' + props.strokeLinejoin + '" fill="none"/>'
            + '<path clip-rule="evenodd" d="M4 24h7-7z" fill="none"/>'
            + '<path d="M4 24h7" stroke="' + props.colors[0] + '" stroke-width="' + props.strokeWidth + '" stroke-linecap="' + props.strokeLinecap + '" stroke-linejoin="' + props.strokeLinejoin + '" fill="none"/>'
            + '<path clip-rule="evenodd" d="M24 11V4v7z" fill="none"/>'
            + '<path d="M24 11V4" stroke="' + props.colors[0] + '" stroke-width="' + props.strokeWidth + '" stroke-linecap="' + props.strokeLinecap + '" stroke-linejoin="' + props.strokeLinejoin + '" fill="none"/>'
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
