import { WHITE_LIST } from './config';

function setup() {
    const elements = Array.from(document.getElementsByClassName('control-button'));
    elements.forEach((element) => {
        element.addEventListener('click', () => {
            postMessage({
                type: 'action',
                payload: {
                    action: element.getAttribute('title'),
                },
            });
        });
    });

    const [canvas] = Array.from(document.getElementsByClassName('touch-layer'));
    canvas.addEventListener('mousemove', ((evt: MouseEvent) => {
        postMessage({
            type: 'action',
            payload: {
                action: 'Mousemove',
                data: {
                    clientX: evt.clientX,
                    clientY: evt.clientY,
                },
            },
        });
    }) as EventListener);
    canvas.addEventListener('mousedown', ((start: MouseEvent) => {
        canvas.addEventListener(
            'mouseup',
            ((end: MouseEvent) => {
                if (Math.abs(start.clientX - end.clientX) >= 10 || Math.abs(start.clientY - end.clientY) >= 10) {
                    postMessage({
                        type: 'action',
                        payload: {
                            action: 'Scroll',
                            data: {
                                start: {
                                    clientX: start.clientX,
                                    clientY: start.clientY,
                                },
                                end: {
                                    clientX: end.clientX,
                                    clientY: end.clientY,
                                },
                            },
                        },
                    });
                } else {
                    postMessage({
                        type: 'action',
                        payload: {
                            action: 'Click',
                            data: {
                                clientX: start.clientX,
                                clientY: start.clientY,
                            },
                        },
                    });
                }
            }) as EventListener,
            { once: true },
        );
    }) as EventListener);

    const sendKeys = document.getElementById('send-as-keys');
    sendKeys?.addEventListener('click', () => {
        const textarea = Array.from(document.getElementsByClassName('text-area'))[0];
        postMessage({
            type: 'action',
            payload: {
                action: 'SendKeys',
                data: { value: (textarea as HTMLTextAreaElement).value },
            },
        });
    });
    // @ts-ignore
    sendKeys?.innerText = '发送文本';
    const getClipboard = sendKeys?.nextSibling;
    const setClipboard = getClipboard?.nextSibling;

    const [wrapper] = Array.from(document.getElementsByClassName('more-box'));
    // @ts-ignore
    [...Array.from(wrapper.children), getClipboard, setClipboard].forEach((child, index) => {
        if ([0, 1].includes(index)) return;
        // @ts-ignore
        child.style.display = 'none';
    });
}

function postMessage(data: any) {
    window.parent.postMessage(data, window.parent.origin);
}

if (WHITE_LIST.includes(window.parent.origin)) {
    setTimeout(setup, 2000);
}
