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
            let body = ''
            res.setEncoding('utf8')
            res.on('data', function (chunk) {
                body = body + chunk.toString();
            })
            res.on('end', () => {
                try {
                    const allSymbols: string[] = body.match(/<symbol.*?<\/symbol>/g)
                    if (!allSymbols) {
                        console.error('request error content: \t', body)
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
        weapp: '微信小程序',
        alipay: '支付宝小程序'
    }[runtime]
    console.log(`当前编译环境: ${APP_ENV_TEXT}`)
    console.log(`开始从[${remoteSvgLink}]链接获取icon`)
    const svgIcons = await fetchRemoteLinkIcons(remoteSvgLink)
    if (!svgIcons.length) {
        console.error('获取到0个图标，请重试或者确认iconPark svg symbol链接')
        return
    }
    if (total > svgIcons.length) {
        console.error(`图标总数: ${total}个，获取到: ${svgIcons.length}个图标，请确认配置文件或重试`)
        return
    } else if (svgIcons.length > total){
        console.warn(`图标总数: ${total}个，获取到: ${svgIcons.length}个图标，请更新配置文件总数`)
        return
    }
    console.log('获取并识别的icon共: \t', svgIcons.length, '个')
    const compiler = createCompiler()
    svgIcons.forEach(icon => {
        compiler.appendIcon(icon)
    })
    console.log('开始编译源码')
    const files = compiler.getIconFiles()
    // save Temp files
    const tempSavePath = join(__dirname, `./.temp/${runtime}`)
    files.forEach(({path, content}) => {
        const fp = join(tempSavePath, path)
        // console.log(`创建临时源码文件: \t`, fp)
        mkdirp.sync(dirname(fp))
        writeFileSync(fp, content, 'utf8')
    })
    console.log('源码编译完成')
    console.log(`开始编译${APP_ENV_TEXT}组件到目录: ${savePath}`)
    if (existsSync(join(savePath, './iconPark.js'))) {
        // 确认是iconPark编译后的根目录再删除，防止误删
        console.log('删除旧文件')
        rmdirSync(savePath, {recursive: true}) // 移除旧的文件
    }
    mkdirp.sync(savePath)
    const iconParkJs = await renderFile(join(__dirname, './ejs/iconPark.ejs'))
    await writeFileSync(join(savePath, './iconPark.js'), iconParkJs, {encoding: 'utf8'})
    const svg64Js = await renderFile(join(__dirname, './ejs/svg64.ejs'))
    await writeFileSync(join(savePath, './svg64.js'), svg64Js, {encoding: 'utf8'})
    const originIconFiles = readdirSync(join(tempSavePath, 'icons'))
    await Promise.all(originIconFiles.map(async (originIconName) => {
        const fileName = originIconName.replace(/\.[^/.]+$/, '').toLowerCase() // 获取文件名
        const fileContent = readFileSync(join(tempSavePath, 'icons', originIconName), {encoding: 'utf8'}) // 获取文件内容
        const svgContent = fileContent.slice(fileContent.indexOf('=> (') + 4, fileContent.indexOf('))')).trim() // 获取svg内容
        const currentIconFolderPath = join(savePath, fileName) // 微信、支付宝组件文件夹路径
        mkdirp.sync(currentIconFolderPath) // 创建文件夹
        console.log(`组件[${fileName}]路径: \t`, currentIconFolderPath)
        const renderCode = await renderFile(join(__dirname, `./ejs/icon.${runtime}.ejs`), {
            icon: {
                svgContent
            }
        })
        writeFileSync(join(currentIconFolderPath, fileName + '.js'), renderCode, {encoding: 'utf8'})
        writeFileSync(join(currentIconFolderPath, fileName + '.json'), JSON.stringify({component: true}), {encoding: 'utf8'})
        writeFileSync(join(currentIconFolderPath, fileName + (runtime === 'weapp' ? '.wxml': '.axml')), '<image style="width: {{width}}px;height: {{height}}px" src="{{base64Data}}" />', {encoding: 'utf8'})
    }))
    console.log('组件编译完成，删除临时文件')
    await rmdirSync(tempSavePath, {recursive: true})
    console.log('done')
}
export default miniCompiler
