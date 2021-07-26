# ws-scrcpy testwa 改造版

[原版README]('./docs/README.md')

## 启动

### 录制工具
默认启用高码率与高帧率
device <-ADB-> PC（本机） <--> 录制工具（本机）

```bash
npm run build:testwa-gen
npm run start:dist 8009
```

### 平台
延迟较高，默认启用低码率与低帧率
device <-GRPC-> Serve（服务器） <-公网-> 平台
```bash
npm run build:testwa-cloud
npm run start:dist 8000
```

## FAQ

- [File push does not work in Safari](https://github.com/NetrisTV/ws-scrcpy/issues/84)
- [add keyboard event](https://github.com/NetrisTV/ws-scrcpy/issues/7)
- [change default screen size](https://github.com/NetrisTV/ws-scrcpy/issues/28)
- [Where is calculating mouse x and mouse y for tap or swipe](https://github.com/NetrisTV/ws-scrcpy/issues/79)
