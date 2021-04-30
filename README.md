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