import { BaseCanvasBasedPlayer } from './BaseCanvasBasedPlayer';
import TinyH264Worker from 'worker-loader!./../../../vendor/tinyh264/H264NALDecoder.worker';
import VideoSettings from '../VideoSettings';
import YUVWebGLCanvas from '../../../vendor/tinyh264/YUVWebGLCanvas';
import YUVCanvas from '../../../vendor/tinyh264/YUVCanvas';
import Size from '../Size';
import { DisplayInfo } from '../DisplayInfo';
import { BasePlayer } from './BasePlayer';

type WorkerMessage = {
    type: string;
    width: number;
    height: number;
    data: ArrayBuffer;
    renderStateId: number;
};

export class TinyH264Player extends BaseCanvasBasedPlayer {
    public static readonly storageKeyPrefix = 'Tinyh264Decoder';
    public static readonly playerFullName = 'Tiny H264';
    public static readonly playerCodeName = 'tinyh264';
    private static videoStreamId = 1;
    public static get preferredVideoSettings(): VideoSettings {
        console.log(process.env.platform);
        if (process.env.platform === 'testwa-cloud') {
            return new VideoSettings({
                lockedVideoOrientation: -1,
                bitrate: 524288,
                maxFps: 24,
                iFrameInterval: 5,
                bounds: new Size(480, 480),
                sendFrameMeta: false,
            });
        } else {
            return new VideoSettings({
                lockedVideoOrientation: -1,
                bitrate: 5242880,
                maxFps: 60,
                iFrameInterval: 5,
                bounds: new Size(480, 480),
                sendFrameMeta: false,
            });
        }
    }

    private worker?: TinyH264Worker;
    private isDecoderReady = false;
    protected canvas?: YUVWebGLCanvas | YUVCanvas;
    public readonly supportsScreenshot: boolean = true;

    public static isSupported(): boolean {
        return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
    }

    constructor(udid: string, displayInfo?: DisplayInfo, name = TinyH264Player.playerFullName) {
        super(udid, displayInfo, name, TinyH264Player.storageKeyPrefix);
    }

    private onWorkerMessage = (e: MessageEvent): void => {
        const message: WorkerMessage = e.data;
        switch (message.type) {
            case 'pictureReady':
                const { width, height, data } = message;
                this.onFrameDecoded(width, height, new Uint8Array(data));
                break;
            case 'decoderReady':
                this.isDecoderReady = true;
                break;
            default:
                console.error(`[${this.name}]`, Error(`Wrong message type "${message.type}"`));
        }
    };

    private initWorker(): void {
        this.worker = new TinyH264Worker();
        this.worker.addEventListener('message', this.onWorkerMessage);
    }

    protected initCanvas(width: number, height: number): void {
        super.initCanvas(width, height);

        if (BaseCanvasBasedPlayer.hasWebGLSupport()) {
            this.canvas = new YUVWebGLCanvas(this.tag);
        } else {
            this.canvas = new YUVCanvas(this.tag);
        }
    }

    protected decode(data: Uint8Array): void {
        if (!this.worker || !this.isDecoderReady) {
            return;
        }

        this.worker.postMessage(
            {
                type: 'decode',
                data: data.buffer,
                offset: data.byteOffset,
                length: data.byteLength,
                renderStateId: TinyH264Player.videoStreamId,
            },
            [data.buffer],
        );
    }

    public play(): void {
        super.play();
        if (!this.worker) {
            this.initWorker();
        }
    }

    public stop(): void {
        super.stop();
        if (this.worker) {
            this.worker.removeEventListener('message', this.onWorkerMessage);
            this.worker.postMessage({ type: 'release', renderStateId: TinyH264Player.videoStreamId });
            delete this.worker;
        }
    }

    public getPreferredVideoSetting(): VideoSettings {
        return TinyH264Player.preferredVideoSettings;
    }

    public static getPreferredVideoSetting(): VideoSettings {
        return this.preferredVideoSettings;
    }

    protected clearState(): void {
        super.clearState();
        if (this.worker) {
            this.worker.postMessage({ type: 'release', renderStateId: TinyH264Player.videoStreamId });
            TinyH264Player.videoStreamId++;
        }
    }

    public getFitToScreenStatus(): boolean {
        return TinyH264Player.getFitToScreenStatus(this.udid, this.displayInfo);
    }

    public loadVideoSettings(): VideoSettings {
        return TinyH264Player.loadVideoSettings(this.udid, this.displayInfo);
    }

    public static getFitToScreenStatus(udid: string, displayInfo?: DisplayInfo): boolean {
        return BasePlayer.getFitToScreenFromStorage(TinyH264Player.storageKeyPrefix, udid, displayInfo);
    }

    public static loadVideoSettings(udid: string, displayInfo?: DisplayInfo): VideoSettings {
        return BasePlayer.getVideoSettingFromStorage(
            TinyH264Player.preferredVideoSettings,
            TinyH264Player.storageKeyPrefix,
            udid,
            displayInfo,
        );
    }

    public static saveVideoSettings(
        udid: string,
        videoSettings: VideoSettings,
        fitToScreen: boolean,
        displayInfo?: DisplayInfo,
    ): void {
        BasePlayer.putVideoSettingsToStorage(
            TinyH264Player.storageKeyPrefix,
            udid,
            videoSettings,
            fitToScreen,
            displayInfo,
        );
    }
}
