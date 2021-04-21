import { WHITE_LIST } from './config';

interface Action {
    action: string;
    data: Record<string, any>;
}

interface Message {
    type: string;
    payload: Action;
}

window.addEventListener('message', ({ data, origin }) => {
    if (!WHITE_LIST.includes(origin)) return;
    const { type, payload } = data as Message;
    switch (type) {
        case 'action':
            return handleAction(payload);
        default:
            break;
    }
});

function handleAction({ action, data }: Action) {
    const element = Array.from(document.getElementsByClassName('touch-layer'))[0];
    switch (action) {
        case 'click': {
            const { clientX, clientY } = data;
            const eventInitDIct = { bubbles: true, clientX, clientY };
            element.dispatchEvent(new MouseEvent('mousedown', eventInitDIct));
            element.dispatchEvent(new MouseEvent('mouseup', eventInitDIct));
            return;
        }
        default:
            return;
    }
}
