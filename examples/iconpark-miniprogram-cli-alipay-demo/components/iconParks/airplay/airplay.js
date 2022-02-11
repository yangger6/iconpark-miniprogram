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
            + '<path stroke-linejoin="' + props.strokeLinejoin + '" stroke-linecap="' + props.strokeLinecap + '" stroke-width="' + props.strokeWidth + '" stroke="' + props.colors[0] + '" d="M12 35.014H4V8.013a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v27h-8" fill="none"/>'
            + '<path stroke-linejoin="' + props.strokeLinejoin + '" stroke-width="' + props.strokeWidth + '" stroke="' + props.colors[0] + '" d="M24 32 14 42h20L24 32z" fill="none"/>'
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
