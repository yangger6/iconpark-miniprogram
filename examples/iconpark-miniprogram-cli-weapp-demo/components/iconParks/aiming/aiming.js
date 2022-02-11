import {IconDefaultProps} from '../iconPark'
const svg64 = require('../svg64')

Component({
    properties: {
        fill: { // 填充色
            type: String,
            optionalTypes: [Array],
            value: '#333'
        },
        size: { // 图标尺寸大小，默认1em
            type: String,
            optionalTypes: [Number]
        },
        strokeWidth: { // 描边宽度
            type: Number
        },
        strokeLinecap: { // 描边端点类型
            type: String
        },
        strokeLinejoin: { // 描边连接线类型
            type: String
        },
        theme: { // 默认主题
            type: String
        },
    },
    created() {
        this.initIcon()
    },
    data: {
        base64Data: '',
        width: 16,
        height: 16
    },
    methods: {
        getSvgContent () {
            const props = IconDefaultProps(this.properties)
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
    observers: {
        'fill,size,strokeWidth,strokeLinecap,strokeLinejoin,theme': function () {
            this.initIcon()
        }
    }
})
