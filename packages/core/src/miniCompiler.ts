import {IconCompiler, IIconToolsOptions, IIconInfo} from '@icon-park/compiler'
import {existsSync, readdirSync, readFileSync, rmdirSync, writeFileSync} from 'fs'
import * as https from "https"
import {join, dirname} from "path"
import mkdirp from 'mkdirp'
import {renderFile} from "ejs";

export const BUILD_CONFIG: Omit<IIconToolsOptions, 'type'> = {
    author: 'IconPark',
    useType: true,
    fixedSize: true,
    stroke: 4,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
    cssPrefix: 'i',
    colors: [
        {
            type: 'color',
            color: '#000'
        },
        {
            type: 'color',
            color: '#2F88FF'
        },
        {
            type: 'color',
            color: '#FFF'
        },
        {
            type: 'color',
            color: '#43CCF8'
        }
    ],
    theme: [
        {
            name: 'outline',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'fill',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: 'transparent',
                    fixed: true,
                    name: 'background'
                }
            ],
            order: [0, 1, 0, 1]
        },
        {
            name: 'filled',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'fill',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: '#FFF',
                    fixed: true,
                    name: 'background'
                }
            ],
            order: [0, 0, 1, 1]
        },
        {
            name: 'two-tone',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'fill',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: '#2F88FF',
                    name: 'twoTone'
                }
            ],
            order: [0, 1, 0, 1]
        },
        {
            name: 'multi-color',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'outStrokeColor',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: '#2F88FF',
                    name: 'outFillColor'
                },
                {
                    type: 'color',
                    color: '#FFF',
                    name: 'innerStrokeColor'
                },
                {
                    type: 'color',
                    color: '#43CCF8',
                    name: 'innerFillColor'
                }
            ],
            order: [0, 1, 2, 3]
        }
    ]
}

const createCompiler = () => {
    return IconCompiler.instance({
        ...BUILD_CONFIG,
        type: 'svg'
    })
}

const fetchRemoteLinkIcons = (remoteSvgLink: string) => {
    return new Promise<IIconInfo[]>((resolve) => {
        const req = https.request(remoteSvgLink, function (res) {
            // console.log('STATUS: ' + res.statusCode)
            // console.log('HEADERS: ' + JSON.stringify(res.headers))
            res.setEncoding('utf8')
            res.on('data', function (chunk) {
                try {
                    const allSymbols: string[] = chunk.match(/<symbol.*?<\/symbol>/g)
                    if (!allSymbols) {
                        console.error('request error content: \t', chunk)
                        resolve([])
                        return
                    }
                    // <symbol viewBox="0 0 48 48">...</symbol> -> <g>...</g>
                    const symbolToG = (symbolText: string) => {
                        return symbolText
                            .replace(/(?<=<[\/]?)symbol/g, 'g')
                            .replace(/viewBox="[\d\s]+\"/, '')
                            .replace(/\#333/g, 'black')
                    }
                    const svgWrapper = (viewBox, content) => `<svg width="48" height="48" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">${content}</svg>`
                    const svgIcons: IIconInfo[] = allSymbols.map(symbolText => {
                        const matchResult = symbolText.match(/id="(?<iconId>[a-zA-z\d\-]+).*viewBox="(?<iconViewBox>[0-9|\s]+)/)
                        const {iconId, iconViewBox} = matchResult?.groups || {}
                        const content = svgWrapper(iconViewBox, symbolToG(symbolText))
                        // console.log(`========================`)
                        // console.log(`name -> ${iconId}`)
                        // console.log(content)
                        // console.log(`========================`)
                        if (iconId && iconViewBox) {
                            return {
                                name: iconId,
                                description: '',
                                rtl: false,
                                content
                            }
                        }
                    })
                    resolve(svgIcons)
                } catch (e) {
                    console.error('handle data error :\t', e)
                    resolve([])
                }
            })
        })
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message)
            resolve([])
        })
        req.end()
    })
}

const miniCompiler = async (remoteSvgLink: string, savePath: string, total: number, runtime: 'weapp' | 'alipay') => {
    const APP_ENV_TEXT = {
        weapp: '???????????????',
        alipay: '??????????????????'
    }[runtime]
    console.log(`??????????????????: ${APP_ENV_TEXT}`)
    console.log(`?????????[${remoteSvgLink}]????????????icon`)
    const svgIcons = await fetchRemoteLinkIcons(remoteSvgLink)
    if (!svgIcons.length) {
        console.error('?????????0?????????????????????????????????iconPark svg symbol??????')
        return
    }
    if (total > svgIcons.length) {
        console.error(`????????????: ${total}???????????????: ${svgIcons.length}??????????????????????????????????????????`)
        return
    } else if (svgIcons.length > total){
        console.warn(`????????????: ${total}???????????????: ${svgIcons.length}???????????????????????????????????????`)
        return
    }
    console.log('??????????????????icon???: \t', svgIcons.length, '???')
    const compiler = createCompiler()
    svgIcons.forEach(icon => {
        compiler.appendIcon(icon)
    })
    console.log('??????????????????')
    const files = compiler.getIconFiles()
    // save Temp files
    const tempSavePath = join(__dirname, `./.temp/${runtime}`)
    files.forEach(({path, content}) => {
        const fp = join(tempSavePath, path)
        // console.log(`????????????????????????: \t`, fp)
        mkdirp.sync(dirname(fp))
        writeFileSync(fp, content, 'utf8')
    })
    console.log('??????????????????')
    console.log(`????????????${APP_ENV_TEXT}???????????????: ${savePath}`)
    if (existsSync(join(savePath, './iconPark.js'))) {
        // ?????????iconPark?????????????????????????????????????????????
        console.log('???????????????')
        rmdirSync(savePath, {recursive: true}) // ??????????????????
    }
    mkdirp.sync(savePath)
    const iconParkJs = await renderFile(join(__dirname, './ejs/iconPark.ejs'))
    await writeFileSync(join(savePath, './iconPark.js'), iconParkJs, {encoding: 'utf8'})
    const svg64Js = await renderFile(join(__dirname, './ejs/svg64.ejs'))
    await writeFileSync(join(savePath, './svg64.js'), svg64Js, {encoding: 'utf8'})
    const originIconFiles = readdirSync(join(tempSavePath, 'icons'))
    await Promise.all(originIconFiles.map(async (originIconName) => {
        const fileName = originIconName.replace(/\.[^/.]+$/, '').toLowerCase() // ???????????????
        const fileContent = readFileSync(join(tempSavePath, 'icons', originIconName), {encoding: 'utf8'}) // ??????????????????
        const svgContent = fileContent.slice(fileContent.indexOf('=> (') + 4, fileContent.indexOf('))')).trim() // ??????svg??????
        const currentIconFolderPath = join(savePath, fileName) // ???????????????????????????????????????
        mkdirp.sync(currentIconFolderPath) // ???????????????
        console.log(`??????[${fileName}]??????: \t`, currentIconFolderPath)
        const renderCode = await renderFile(join(__dirname, `./ejs/icon.${runtime}.ejs`), {
            icon: {
                svgContent
            }
        })
        writeFileSync(join(currentIconFolderPath, fileName + '.js'), renderCode, {encoding: 'utf8'})
        writeFileSync(join(currentIconFolderPath, fileName + '.json'), JSON.stringify({component: true}), {encoding: 'utf8'})
        writeFileSync(join(currentIconFolderPath, fileName + (runtime === 'weapp' ? '.wxml': '.axml')), '<image style="width: {{width}}px;height: {{height}}px" src="{{base64Data}}" />', {encoding: 'utf8'})
    }))
    console.log('???????????????????????????????????????')
    await rmdirSync(tempSavePath, {recursive: true})
    console.log('done')
}
export default miniCompiler
