# IconPark Mini Program Cli

---

icon-park miniProgram code generator

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@iconpark-miniprogram-sht/cli.svg)](https://npmjs.org/package/@iconpark-miniprogram-sht/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@iconpark-miniprogram-sht/cli.svg)](https://npmjs.org/package/@iconpark-miniprogram-sht/cli)
[![License](https://img.shields.io/npm/l/@iconpark-miniprogram/cli.svg)](https://github.com/yangger6/iconpark-miniprogram/blob/master/packages/cli/package.json)

## Statement
### Here, we just modified the bug to support more icons

## Feature

* Automatic `iconpark-miniprogram.json` parsing
* Support generate Wechat Mini Program Components.

## Usage
<!-- usage -->
```sh-session
$ npm install -g iconpark-miniprogram-sht
$ iconpark-miniprogram-sht COMMAND
running command...
$ iconpark-miniprogram-sht --help [COMMAND]
USAGE
  $ iconpark-miniprogram-sht COMMAND
...
```

## Example

### 1. Create `iconpark-miniprogram.json` in the project root directory.

```
  {
    "link": "https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_4748_4.6e9e78e1ff1d1089dd55d318b7c8e76f.js", // iconpark svg symbol link
    "total": 4, // total icons
    "path": "./components/iconParks/", // save components path
    "runtime": "weapp" // app runtime
  }
```

### 2. Built `Wechat Mini Program` or `Alipay Mini Program`.

generate component with `iconpark-miniprogram.json`

```shell
$ iconpark-miniprogram-sht // Automatic `iconpark-miniprogram.json` parsing 
// or
$ iconpark-miniprogram-sht -c ./iconpark-miniprogram.example.json
```

### 3. Or using command

```shell
$ iconpark-miniprogram-sht --link https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_2112_11.caca56a254d4132af95083235d0735e1.js --total 11 --path ./components/iconParks --runtime weapp
```
