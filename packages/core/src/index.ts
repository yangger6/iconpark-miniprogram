import * as iconParkIcons from '@icon-park/svg'
import {renderFile, render} from 'ejs'
import {join} from 'path'
import {existsSync, mkdirSync, writeFileSync} from 'fs'
import {copySync} from 'fs-extra'

const iconGen = async () => {
    const filterNames = ['setConfig', 'DEFAULT_ICON_CONFIGS']
    const iconNames = Object.keys(iconParkIcons).filter(name => !filterNames.includes(name))
    console.log(`开始编译, 共${iconNames.length}个文件`)
    const baseUrl = join(__dirname, `../lib/taro`)
    const iconsUrl = join(baseUrl, './icons')
    // 新建文件夹
    if (!existsSync(baseUrl)) {
        mkdirSync(baseUrl)
    }
    if (!existsSync(iconsUrl)) {
        mkdirSync(iconsUrl)
    }
    for (let i = 0; i < iconNames.length; i++) {
        const iconName = iconNames[i]
        const renderCode = await renderFile(join(__dirname, `./ejs/icon.taro.ejs`), {
            icon: {
                name: iconName
            }
        })
        writeFileSync(join(iconsUrl, `${iconName}.tsx`), renderCode, {
            encoding: 'utf-8'
        })
    }
    const mapCode = render(`<% iconNames.forEach(function(iconName){ -%>
export { default as <%= iconName %> } from './icons/<%= iconName %>'
<% }); -%>`, {
        iconNames
    })
    writeFileSync(join(baseUrl, `map.ts`), mapCode, {
        encoding: 'utf-8'
    })
    writeFileSync(join(baseUrl, `index.ts`), `export * from './map'`, {
        encoding: 'utf-8'
    })
    copySync(join(baseUrl, '../../../../types'), join(baseUrl, './types'))
}

iconGen()
    .then(() => {
        console.log('ok')
    })
    .catch(e => {
        console.error(e)
    })
