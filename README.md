# 刷机精灵

技术  electron, vue.js, node.js

* node v6.0
* npm v5.0
* electron v1.6.6


### 安装

serialport 包需要 python 2.7 和 visual studio(添加 c++ 桌面开发)

用户目录下可以提前下载需要的文件, 从 electron github 主页下载对应平台的文件到 "~/.electron/electron-v1.6.6-win32-x64.zip"

windows cmd 配置代理 "set HTTP_proxy=http://127.0.0.1:1080"

```
npm install [--arch=ia32]
npm install -g electron electron-rebuild
./node_modules/.bin/electron -v
./node_modules/.bin/electron-rebuild -v=1.6.6 [--arch=ia32]
```

启动

```
electron .
```

### 打包可执行程序

修改 env.json 文件，将 production 改为 true 。如果有 dist 目录先把 dist 目录删了

```
# npm install electron-packager --save-dev
# 苹果打苹果的包，windows 下打 windows 的包
./node_modules/.bin/electron-packager . --out=dist --overwrite --asar
```
