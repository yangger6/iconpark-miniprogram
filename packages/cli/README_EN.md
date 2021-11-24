# IconPark Mini Program Cli

---

icon-park miniProgram code generator

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@iconpark-miniprogram/cli.svg)](https://npmjs.org/package/@iconpark-miniprogram/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@iconpark-miniprogram/cli.svg)](https://npmjs.org/package/@iconpark-miniprogram/cli)
[![License](https://img.shields.io/npm/l/@iconpark-miniprogram/cli.svg)](https://github.com/yangger6/iconpark-miniprogram/blob/master/packages/cli/package.json)

## Feature

* Automatic `iconpark-miniprogram.json` parsing
* Support generate Wechat Mini Program Components.

## Usage
<!-- usage -->
```sh-session
$ npm install -g @iconpark-miniprogram/cli
$ @iconpark-miniprogram/cli COMMAND
running command...
$ @iconpark-miniprogram/cli (-v|--version|version)
@iconpark-miniprogram/cli/0.0.14 darwin-x64 node-v14.16.0
$ @iconpark-miniprogram/cli --help [COMMAND]
USAGE
  $ @iconpark-miniprogram/cli COMMAND
...
```

## Example

### 1. Create `iconpark-miniprogram.json` in the project root directory.

```json
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
$ @iconpark-miniprogram/cli // Automatic `iconpark-miniprogram.json` parsing 
// or
$ @iconpark-miniprogram/cli -c ./iconpark-miniprogram.example.json
```

### 3. Or using command

```shell
$ @iconpark-miniprogram/cli --link https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_2112_11.caca56a254d4132af95083235d0735e1.js --total 11 --path ./components/iconParks --runtime weapp
```
