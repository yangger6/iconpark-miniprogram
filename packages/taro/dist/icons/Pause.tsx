import React from 'react'
import { Pause as originIcon } from '@icon-park/svg'
import { IIconProps } from '@icon-park/svg/lib/runtime'
import svg64 from 'svg64'

const Pause = (props: IIconProps) => {
    const base64Data = svg64(originIcon(props))
    //@ts-ignore next-line
    return <image src={base64Data} style={{width: '1em', height: '1em'}} mode="widthFix" alt={'icon'} />
}
export default Pause