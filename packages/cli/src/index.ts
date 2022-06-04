import {Command, flags} from '@oclif/command'
import {join} from "path";
import * as process from "process";
import {readFileSync} from "fs";
import {miniCompiler} from '@iconpark-miniprogram-sht/core'

class IconParkMiniProgramCli extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
    config: flags.string({char: 'c', description: 'config to gen code'}),
    link: flags.string({char: 'l', description: 'iconPark svg symbol link'}),
    path: flags.string({char: 'p', description: 'icon components save path'}),
    total: flags.string({char: 't', description: 'icon total count'}),
    runtime: flags.string({char: 'r', description: 'app env runtime: weapp | alipay', options: ['weapp', 'alipay']})
  }
  // TODO 暂时不用args 不想做处理= =
  // static args = [
  //   {
  //     name: 'config'
  //   },
  //   {
  //     name: 'path'
  //   }
  // ]

  async run() {
    const {flags} = this.parse(IconParkMiniProgramCli)
    const rootPath = process.cwd() // root path
    // config
    let config: {
      link?: string,
      path?: string,
      total?: number
      runtime?: 'weapp' | 'alipay'
    } = {}
    let configPath = './iconpark-miniprogram.json'
    if (flags.config) {
      configPath = flags.config
    }
    const configAbsolutePath = join(rootPath, configPath)
    try {
      const configRawValue = readFileSync(configAbsolutePath, {
        encoding: 'utf8'
      })
      config = JSON.parse(configRawValue)
      this.log(JSON.stringify(config))
    } catch (e) {
      if (flags.config) {
        this.error('配置文件读取失败，请确认iconpark-miniprogram.json文件路径, path: \t' + configAbsolutePath)
      }
    }
    // fetch iconPark
    const fetchLink = flags.link || config.link
    const savePath = join(rootPath, (flags.path || config.path || './components/iconPark'))
    const total = Number(flags.total || config.total)
    const runtime = (flags.runtime as 'weapp' | 'alipay') || config.runtime || 'weapp'
    if (!fetchLink) {
      this.error('请配置iconpark-miniprogram.json的url或使用--link 传入iconPark的svg symbol url')
      return
    }
    if (!total) {
      this.error('请配置iconpark-miniprogram.json的total或使用--total 传入iconPark的图标总数')
      return
    }
    await miniCompiler(fetchLink, savePath, total, runtime)
  }
}

export = IconParkMiniProgramCli
